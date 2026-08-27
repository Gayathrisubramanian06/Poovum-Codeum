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
                this.templateCtx.drawImage(img, 0, 0, this.canvasSize, this.canvasSize);
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

        // 1. Grayscale
        const lums = new Uint8Array(total);
        for (let i = 0; i < total; i++) {
            const idx = i * 4;
            lums[i] = Math.round(0.299 * px[idx] + 0.587 * px[idx + 1] + 0.114 * px[idx + 2]);
        }

        // 2. Otsu's threshold
        const hist = new Int32Array(256);
        for (let i = 0; i < total; i++) hist[lums[i]]++;

        let sumAll = 0;
        for (let t = 0; t < 256; t++) sumAll += t * hist[t];

        let wBg = 0, sumBg = 0, bestVar = 0, otsuThresh = 128;
        for (let t = 0; t < 256; t++) {
            wBg += hist[t];
            if (!wBg) continue;
            const wFg = total - wBg;
            if (!wFg) break;
            sumBg += t * hist[t];
            const mBg = sumBg / wBg;
            const mFg = (sumAll - sumBg) / wFg;
            const v = wBg * wFg * (mBg - mFg) * (mBg - mFg);
            if (v > bestVar) { bestVar = v; otsuThresh = t; }
        }
        otsuThresh = Math.max(55, Math.min(215, otsuThresh));

        // 3. Binarize
        for (let i = 0; i < total; i++) {
            const idx = i * 4;
            const v = lums[i] < otsuThresh ? 0 : 255;
            px[idx] = px[idx + 1] = px[idx + 2] = v;
            px[idx + 3] = 255;
        }

        // 4. Dilate borders by 1 pixel
        const snapshot = new Uint8Array(total);
        for (let i = 0; i < total; i++) snapshot[i] = px[i * 4] > 0 ? 1 : 0;

        for (let y = 1; y < this.canvasSize - 1; y++) {
            for (let x = 1; x < this.canvasSize - 1; x++) {
                const p = y * this.canvasSize + x;
                if (snapshot[p] === 1 && (
                    snapshot[p - 1] === 0 || snapshot[p + 1] === 0 ||
                    snapshot[p - this.canvasSize] === 0 || snapshot[p + this.canvasSize] === 0
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
            for (let r = 1; r <= 8; r++) {
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
}
