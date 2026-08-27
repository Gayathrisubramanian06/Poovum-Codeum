export class ImageTemplateEngine {
    constructor(canvasSize = 400) {
        this.canvasSize = canvasSize;
        
        // Offscreen canvas for loading raw template and binarizing it
        this.templateCanvas = document.createElement('canvas');
        this.templateCanvas.width = canvasSize;
        this.templateCanvas.height = canvasSize;
        this.templateCtx = this.templateCanvas.getContext('2d', { willReadFrequently: true });

        // Offscreen canvas for drawing color fills
        this.fillCanvas = document.createElement('canvas');
        this.fillCanvas.width = canvasSize;
        this.fillCanvas.height = canvasSize;
        this.fillCtx = this.fillCanvas.getContext('2d', { willReadFrequently: true });

        this.regionCache = new Map();
        this.adaptiveBorderThreshold = 128;
    }

    async init(imgSrc) {
        this.regionCache.clear();
        this.fillCtx.clearRect(0, 0, this.canvasSize, this.canvasSize);

        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                const imgW = img.width || 1;
                const imgH = img.height || 1;

                let drawW = this.canvasSize;
                let drawH = this.canvasSize;
                let drawX = 0;
                let drawY = 0;

                const imgRatio = imgW / imgH;
                const canvasRatio = 1.0;

                if (imgRatio > canvasRatio) {
                    drawW = this.canvasSize;
                    drawH = this.canvasSize / imgRatio;
                    drawY = (this.canvasSize - drawH) / 2;
                } else if (imgRatio < canvasRatio) {
                    drawH = this.canvasSize;
                    drawW = this.canvasSize * imgRatio;
                    drawX = (this.canvasSize - drawW) / 2;
                }

                this.templateCtx.fillStyle = '#ffffff';
                this.templateCtx.fillRect(0, 0, this.canvasSize, this.canvasSize);

                this.templateCtx.drawImage(img, drawX, drawY, drawW, drawH);
                this.preprocess();
                resolve(this.getFillDataUrl());
            };
            img.onerror = (e) => reject(e);
            img.src = imgSrc;
        });
    }

    preprocess() {
        const imgData = this.templateCtx.getImageData(0, 0, this.canvasSize, this.canvasSize);
        const px = imgData.data;
        const total = this.canvasSize * this.canvasSize;
        const size = this.canvasSize;

        // 1. Grayscale
        const lums = new Uint8Array(total);
        for (let i = 0; i < total; i++) {
            const idx = i * 4;
            lums[i] = Math.round(0.299 * px[idx] + 0.587 * px[idx + 1] + 0.114 * px[idx + 2]);
        }

        // 2. Adaptive Local Thresholding using Integral Image
        const R = 3;
        const C = 6;
        const thresholded = new Uint8Array(total);

        const integral = new Float64Array((size + 1) * (size + 1));
        for (let y = 0; y < size; y++) {
            let rowSum = 0;
            for (let x = 0; x < size; x++) {
                rowSum += lums[y * size + x];
                integral[(y + 1) * (size + 1) + (x + 1)] = integral[y * (size + 1) + (x + 1)] + rowSum;
            }
        }

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const p = y * size + x;
                
                const ymin = Math.max(0, y - R);
                const ymax = Math.min(size - 1, y + R);
                const xmin = Math.max(0, x - R);
                const xmax = Math.min(size - 1, x + R);
                
                const count = (ymax - ymin + 1) * (xmax - xmin + 1);
                const sum = integral[(ymax + 1) * (size + 1) + (xmax + 1)]
                          - integral[ymin * (size + 1) + (xmax + 1)]
                          - integral[(ymax + 1) * (size + 1) + xmin]
                          + integral[ymin * (size + 1) + xmin];
                
                const avg = sum / count;
                thresholded[p] = lums[p] < (avg - C) ? 0 : 255;
            }
        }

        // 3. Write back thresholded pixels
        for (let i = 0; i < total; i++) {
            const idx = i * 4;
            const v = thresholded[i];
            px[idx] = px[idx + 1] = px[idx + 2] = v;
            px[idx + 3] = 255;
        }

        // 4. 8-Direction Dilation to close micro-gaps
        const snapshot = new Uint8Array(total);
        for (let i = 0; i < total; i++) snapshot[i] = px[i * 4] > 0 ? 1 : 0;

        for (let y = 1; y < size - 1; y++) {
            for (let x = 1; x < size - 1; x++) {
                const p = y * size + x;
                if (snapshot[p] === 1 && (
                    snapshot[p - 1] === 0 || snapshot[p + 1] === 0 ||
                    snapshot[p - size] === 0 || snapshot[p + size] === 0 ||
                    snapshot[p - size - 1] === 0 || snapshot[p - size + 1] === 0 ||
                    snapshot[p + size - 1] === 0 || snapshot[p + size + 1] === 0
                )) {
                    const idx = p * 4;
                    px[idx] = px[idx + 1] = px[idx + 2] = 0;
                }
            }
        }

        this.templateCtx.putImageData(imgData, 0, 0);
        this.adaptiveBorderThreshold = 128;
    }

    floodFill(svgX, svgY) {
        const startX = Math.round(svgX);
        const startY = Math.round(svgY);
        if (startX < 0 || startX >= this.canvasSize || startY < 0 || startY >= this.canvasSize) return null;

        const key = `${startX},${startY}`;
        if (this.regionCache.has(key)) return this.regionCache.get(key);

        const imgData = this.templateCtx.getImageData(0, 0, this.canvasSize, this.canvasSize);
        const px = imgData.data;
        const total = this.canvasSize * this.canvasSize;
        const thresh = this.adaptiveBorderThreshold;

        const lum = (p) => {
            const i = p * 4;
            return 0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2];
        };

        let startPos = startY * this.canvasSize + startX;
        if (lum(startPos) < thresh) {
            let foundPos = -1;
            for (let r = 1; r <= 18; r++) {
                for (let dy = -r; dy <= r; dy++) {
                    for (let dx = -r; dx <= r; dx++) {
                        const nx = startX + dx;
                        const ny = startY + dy;
                        if (nx >= 0 && nx < this.canvasSize && ny >= 0 && ny < this.canvasSize) {
                            const np = ny * this.canvasSize + nx;
                            if (lum(np) >= thresh) {
                                foundPos = np;
                                break;
                            }
                        }
                    }
                    if (foundPos !== -1) break;
                }
                if (foundPos !== -1) break;
            }
            if (foundPos === -1) return null;
            startPos = foundPos;
        }

        const mask = new Uint8Array(total);
        const visited = new Uint8Array(total);
        const stack = new Int32Array(total);
        let stackTop = 0;
        stack[stackTop++] = startPos;

        let pixelCount = 0;

        while (stackTop > 0) {
            const pos = stack[--stackTop];
            if (visited[pos]) continue;
            visited[pos] = 1;
            if (lum(pos) < thresh) continue;

            mask[pos] = 1;
            pixelCount++;

            const x = pos % this.canvasSize;
            const y = Math.floor(pos / this.canvasSize);

            if (x > 0) stack[stackTop++] = pos - 1;
            if (x < this.canvasSize - 1) stack[stackTop++] = pos + 1;
            if (y > 0) stack[stackTop++] = pos - this.canvasSize;
            if (y < this.canvasSize - 1) stack[stackTop++] = pos + this.canvasSize;
        }

        if (pixelCount === 0) return null;

        this.regionCache.set(key, mask);
        return mask;
    }

    applyFills(masks, hexColor) {
        const imgData = this.fillCtx.getImageData(0, 0, this.canvasSize, this.canvasSize);
        const d = imgData.data;

        // Hex to RGB inside class
        let c = hexColor.replace('#', '');
        if (c.length === 3) c = c.split('').map(x => x + x).join('');
        const num = parseInt(c, 16);
        const rgb = {
            r: (num >> 16) & 255,
            g: (num >> 8) & 255,
            b: num & 255
        };

        masks.forEach(mask => {
            if (!mask) return;
            for (let i = 0; i < mask.length; i++) {
                if (mask[i]) {
                    const idx = i * 4;
                    d[idx] = rgb.r;
                    d[idx + 1] = rgb.g;
                    d[idx + 2] = rgb.b;
                    d[idx + 3] = 255;
                }
            }
        });

        this.fillCtx.putImageData(imgData, 0, 0);
        return this.getFillDataUrl();
    }

    getFillDataUrl() {
        return this.fillCanvas.toDataURL('image/png');
    }

    restoreState(imageData) {
        this.fillCtx.putImageData(imageData, 0, 0);
        return this.getFillDataUrl();
    }

    getFillState() {
        return this.fillCtx.getImageData(0, 0, this.canvasSize, this.canvasSize);
    }

    clear() {
        this.fillCtx.clearRect(0, 0, this.canvasSize, this.canvasSize);
        this.regionCache.clear();
        return this.getFillDataUrl();
    }

    getCenterOfDesign() {
        const imgData = this.templateCtx.getImageData(0, 0, this.canvasSize, this.canvasSize);
        const px = imgData.data;
        const size = this.canvasSize;
        
        let sumX = 0;
        let sumY = 0;
        let count = 0;
        
        // Ignore margins (outer 5%) to avoid edge noise / crop borders
        const margin = Math.round(size * 0.05);
        
        for (let y = margin; y < size - margin; y++) {
            for (let x = margin; x < size - margin; x++) {
                const idx = (y * size + x) * 4;
                // If it is a black border outline pixel
                if (px[idx] === 0) {
                    sumX += x;
                    sumY += y;
                    count++;
                }
            }
        }
        
        if (count > 80) {
            return {
                x: sumX / count,
                y: sumY / count
            };
        }
        
        // Fallback to absolute center
        return { x: size / 2, y: size / 2 };
    }
}
