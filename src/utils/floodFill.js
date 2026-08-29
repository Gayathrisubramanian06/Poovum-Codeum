export class ImageTemplateEngine {
    constructor(canvasSize = 800) {
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

        this.templatePixels = null;
        this.regionMap = new Int32Array(canvasSize * canvasSize);
        this.regionsById = new Map();
        this.nextRegionId = 1;
        this.backgroundMask = null;
        this.centerSvg = { x: 200, y: 200 };
        this.outerRadiusSvg = 190;
    }

    async init(imgSrc) {
        this.regionsById.clear();
        this.regionMap.fill(0);
        this.nextRegionId = 1;
        this.backgroundMask = null;
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
        const size = this.canvasSize;
        const total = size * size;
        const imgData = this.templateCtx.getImageData(0, 0, size, size);
        const px = imgData.data;

        // 1. Grayscale luminance extraction
        const lums = new Uint8Array(total);
        for (let i = 0; i < total; i++) {
            const idx = i * 4;
            lums[i] = Math.round(0.299 * px[idx] + 0.587 * px[idx + 1] + 0.114 * px[idx + 2]);
        }

        // 2. High-sensitivity thresholding for JPEG outlines:
        // Pure background is 245-255. Any stroke, spoke, or antialiased compression line < 236 is treated as a border stroke (0).
        const binary = new Uint8Array(total);
        for (let i = 0; i < total; i++) {
            binary[i] = lums[i] < 236 ? 0 : 255;
        }

        // 3. Diagonal corner bridge pass:
        // When diagonal pixels are borders (0), seal the orthogonal connections to prevent 4-way flood fill leaking through diagonal cracks
        const sealed = new Uint8Array(binary);
        for (let y = 1; y < size - 1; y++) {
            for (let x = 1; x < size - 1; x++) {
                const p = y * size + x;
                if (binary[p] === 255) {
                    const l = binary[p - 1] === 0;
                    const r = binary[p + 1] === 0;
                    const t = binary[p - size] === 0;
                    const b = binary[p + size] === 0;
                    const tl = binary[p - size - 1] === 0;
                    const br = binary[p + size + 1] === 0;
                    const tr = binary[p - size + 1] === 0;
                    const bl = binary[p + size - 1] === 0;

                    // Close 1px gaps and diagonal leaks
                    if ((l && r) || (t && b) || (tl && br) || (tr && bl) ||
                        (l && b) || (r && b) || (l && t) || (r && t) ||
                        (tl && b) || (tr && b) || (bl && t) || (br && t) ||
                        (tl && r) || (bl && r) || (tr && l) || (br && l)) {
                        sealed[p] = 0;
                    }
                }
            }
        }

        // 4. Secondary gap-closing pass for 2px breaks along fine radial lines and thin spokes
        for (let y = 2; y < size - 2; y++) {
            for (let x = 2; x < size - 2; x++) {
                const p = y * size + x;
                if (sealed[p] === 255) {
                    if ((sealed[p - 2] === 0 && sealed[p + 1] === 0) || (sealed[p - 1] === 0 && sealed[p + 2] === 0) ||
                        (sealed[p - size * 2] === 0 && sealed[p + size] === 0) || (sealed[p - size] === 0 && sealed[p + size * 2] === 0) ||
                        (sealed[p - 2] === 0 && sealed[p + 2] === 0) || (sealed[p - size * 2] === 0 && sealed[p + size * 2] === 0) ||
                        (sealed[p - size * 2 - 2] === 0 && sealed[p + size + 1] === 0) ||
                        (sealed[p - size * 2 + 2] === 0 && sealed[p + size - 1] === 0) ||
                        (sealed[p + size * 2 - 2] === 0 && sealed[p - size + 1] === 0) ||
                        (sealed[p + size * 2 + 2] === 0 && sealed[p - size - 1] === 0)) {
                        sealed[p] = 0;
                    }
                }
            }
        }

        // 5. Watertight Border Dilation:
        // Dilate borders by 1px so thin 1px radial spokes and lines form an impermeable barrier that never leaks
        const dilated = new Uint8Array(sealed);
        for (let y = 1; y < size - 1; y++) {
            for (let x = 1; x < size - 1; x++) {
                const p = y * size + x;
                if (sealed[p] === 0) {
                    dilated[p - 1] = 0;
                    dilated[p + 1] = 0;
                    dilated[p - size] = 0;
                    dilated[p + size] = 0;
                }
            }
        }

        // 6. Pre-identify Outside Background Mask starting from the 4 outer image edges
        const bgMask = new Uint8Array(total);
        const bgVisited = new Uint8Array(total);
        const stack = new Int32Array(total);
        let stackTop = 0;

        const pushIfValid = (x, y) => {
            const p = y * size + x;
            if (!bgVisited[p] && dilated[p] === 255) {
                bgVisited[p] = 1;
                stack[stackTop++] = p;
            }
        };

        // Seed along all 4 perimeter borders
        for (let x = 0; x < size; x++) {
            pushIfValid(x, 0);
            pushIfValid(x, size - 1);
        }
        for (let y = 0; y < size; y++) {
            pushIfValid(0, y);
            pushIfValid(size - 1, y);
        }

        while (stackTop > 0) {
            const pos = stack[--stackTop];
            bgMask[pos] = 1;

            const x = pos % size;
            const y = Math.floor(pos / size);

            const neighbors = [
                x > 0 ? pos - 1 : -1,
                x < size - 1 ? pos + 1 : -1,
                y > 0 ? pos - size : -1,
                y < size - 1 ? pos + size : -1
            ];

            for (const next of neighbors) {
                if (next !== -1 && !bgVisited[next] && dilated[next] === 255) {
                    bgVisited[next] = 1;
                    stack[stackTop++] = next;
                }
            }
        }

        this.backgroundMask = bgMask;

        // Compute exact center and outer radius of the mandala artwork
        let minX = size, maxX = 0, minY = size, maxY = 0;
        let count = 0;
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const p = y * size + x;
                if (dilated[p] === 0 && !bgMask[p]) {
                    if (x < minX) minX = x;
                    if (x > maxX) maxX = x;
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;
                    count++;
                }
            }
        }

        const scale = size / 400;
        if (count > 100 && maxX > minX && maxY > minY) {
            this.centerSvg = {
                x: ((minX + maxX) / 2) / scale,
                y: ((minY + maxY) / 2) / scale
            };
            const radiusPx = Math.max((maxX - minX) / 2, (maxY - minY) / 2);
            this.outerRadiusSvg = Math.min(196, (radiusPx / scale) + 2);
        } else {
            this.centerSvg = { x: 200, y: 200 };
            this.outerRadiusSvg = 192;
        }

        // Put sealed data back to template canvas for display
        for (let i = 0; i < total; i++) {
            const idx = i * 4;
            const v = dilated[i];
            px[idx] = v;
            px[idx + 1] = v;
            px[idx + 2] = v;
            px[idx + 3] = 255;
        }
        this.templateCtx.putImageData(imgData, 0, 0);

        // Cache pixel data in memory for O(1) reads
        this.templatePixels = new Uint8Array(px);
    }

    floodFill(svgX, svgY, strict = false) {
        const scale = this.canvasSize / 400;
        const startX = Math.round(svgX * scale);
        const startY = Math.round(svgY * scale);
        const size = this.canvasSize;
        if (startX < 0 || startX >= size || startY < 0 || startY >= size) return null;

        const center = this.getCenterOfDesign();
        const distFromCenterSvg = Math.hypot(svgX - center.x, svgY - center.y);

        // Never color outside the outer mandala perimeter
        if (distFromCenterSvg > this.outerRadiusSvg) {
            return null;
        }

        const px = this.templatePixels;
        if (!px) return null;
        const total = size * size;

        let startPos = startY * size + startX;

        // If clicked on outside canvas background mask, reject immediately
        if (this.backgroundMask && this.backgroundMask[startPos]) {
            return null;
        }

        // Check if pixel was already segmented into a known region
        const existingRegionId = this.regionMap[startPos];
        if (existingRegionId > 0) {
            return this.regionsById.get(existingRegionId) || null;
        }

        // If clicked on a border line (0), search locally for the nearest interior white pixel
        if (px[startPos * 4] === 0) {
            let foundPos = -1;
            let minDist = Infinity;
            const maxRadius = strict ? 4 : 16;
            for (let r = 1; r <= maxRadius; r++) {
                for (let dy = -r; dy <= r; dy++) {
                    for (let dx = -r; dx <= r; dx++) {
                        const nx = startX + dx;
                        const ny = startY + dy;
                        if (nx >= 0 && nx < size && ny >= 0 && ny < size) {
                            const np = ny * size + nx;
                            const dSvg = Math.hypot((nx / scale) - center.x, (ny / scale) - center.y);
                            const isOutsideBg = this.backgroundMask && this.backgroundMask[np];
                            if (px[np * 4] === 255 && !isOutsideBg && dSvg <= this.outerRadiusSvg) {
                                const dist = dx * dx + dy * dy;
                                if (dist < minDist) {
                                    minDist = dist;
                                    foundPos = np;
                                }
                            }
                        }
                    }
                }
                if (foundPos !== -1) break;
            }
            if (foundPos === -1) return null;
            startPos = foundPos;

            // Check if found pixel already has a known region
            if (this.regionMap[startPos] > 0) {
                return this.regionsById.get(this.regionMap[startPos]) || null;
            }
        }

        const mask = new Uint8Array(total);
        const visited = new Uint8Array(total);
        const stack = new Int32Array(total);
        let stackTop = 0;
        stack[stackTop++] = startPos;

        let pixelCount = 0;
        const regionPixels = [];

        while (stackTop > 0) {
            const pos = stack[--stackTop];
            if (visited[pos]) continue;
            visited[pos] = 1;

            // Stop at black borders
            if (px[pos * 4] === 0) continue;

            // Stop if touching outside background mask
            if (this.backgroundMask && this.backgroundMask[pos]) continue;

            const x = pos % size;
            const y = Math.floor(pos / size);
            const dCenterSvg = Math.hypot(x / scale - center.x, y / scale - center.y);

            // Never leak beyond outer mandala boundary
            if (dCenterSvg > this.outerRadiusSvg) continue;

            mask[pos] = 1;
            regionPixels.push(pos);
            pixelCount++;

            if (x > 0) stack[stackTop++] = pos - 1;
            if (x < size - 1) stack[stackTop++] = pos + 1;
            if (y > 0) stack[stackTop++] = pos - size;
            if (y < size - 1) stack[stackTop++] = pos + size;
        }

        if (pixelCount === 0) return null;

        const regionId = this.nextRegionId++;
        for (let i = 0; i < regionPixels.length; i++) {
            this.regionMap[regionPixels[i]] = regionId;
        }
        this.regionsById.set(regionId, mask);

        return mask;
    }

    applyFills(masks, hexColor) {
        const imgData = this.fillCtx.getImageData(0, 0, this.canvasSize, this.canvasSize);
        const d = imgData.data;
        const size = this.canvasSize;
        const total = size * size;

        // Hex to RGB
        let c = hexColor.replace('#', '');
        if (c.length === 3) c = c.split('').map(x => x + x).join('');
        const num = parseInt(c, 16);
        const r = (num >> 16) & 255;
        const g = (num >> 8) & 255;
        const b = num & 255;

        for (let m = 0; m < masks.length; m++) {
            const mask = masks[m];
            if (!mask) continue;

            for (let i = 0; i < total; i++) {
                if (mask[i]) {
                    const idx = i * 4;
                    d[idx] = r;
                    d[idx + 1] = g;
                    d[idx + 2] = b;
                    d[idx + 3] = 255;
                }
            }
        }

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
        return this.getFillDataUrl();
    }

    getMaskMetrics(mask) {
        if (!mask) return null;
        const size = this.canvasSize;
        const total = size * size;
        let sumX = 0, sumY = 0, area = 0;
        let minX = size, maxX = 0, minY = size, maxY = 0;

        for (let i = 0; i < total; i++) {
            if (mask[i]) {
                const pxX = i % size;
                const pxY = Math.floor(i / size);
                sumX += pxX;
                sumY += pxY;
                if (pxX < minX) minX = pxX;
                if (pxX > maxX) maxX = pxX;
                if (pxY < minY) minY = pxY;
                if (pxY > maxY) maxY = pxY;
                area++;
            }
        }

        if (area === 0) return null;
        const scale = size / 400;
        const center = this.getCenterOfDesign();
        const centroidSvg = {
            x: (sumX / area) / scale,
            y: (sumY / area) / scale
        };

        const dx = centroidSvg.x - center.x;
        const dy = centroidSvg.y - center.y;

        // Bounding box size in SVG units
        const bboxWidthSvg = (maxX - minX) / scale;
        const bboxHeightSvg = (maxY - minY) / scale;

        return {
            area,
            centroid: centroidSvg,
            radiusFromCenter: Math.hypot(dx, dy),
            angle: Math.atan2(dy, dx),
            bboxWidth: bboxWidthSvg,
            bboxHeight: bboxHeightSvg,
            key: `${Math.round(centroidSvg.x)},${Math.round(centroidSvg.y)},${area}`
        };
    }

    /**
     * Complete Radial Ring & Symmetry Flood Fill:
     * Discovers all matching shapes lying along the same concentric mandala ring at radius R.
     * Works seamlessly across all templates with thin radial spokes and fine dividing lines.
     */
    floodFillSymmetric(svgX, svgY, preferredFolds = null) {
        const baseMask = this.floodFill(svgX, svgY, false);
        if (!baseMask) return [];

        const baseMetrics = this.getMaskMetrics(baseMask);
        if (!baseMetrics || baseMetrics.area < 10) return [baseMask];

        const center = this.getCenterOfDesign();
        const baseR = baseMetrics.radiusFromCenter;

        // Central core motif (radius < 18px in SVG) is singular; color only itself
        if (baseR < 18) {
            return [baseMask];
        }

        // If the shape is enormous (spans over half the design), it is a large backdrop, not a ring petal
        if (baseMetrics.bboxWidth > 180 || baseMetrics.bboxHeight > 180) {
            return [baseMask];
        }

        const baseArea = baseMetrics.area;
        const scale = this.canvasSize / 400;
        const size = this.canvasSize;
        const cX = center.x * scale;
        const cY = center.y * scale;
        const rPx = baseR * scale;
        const px = this.templatePixels;
        if (!px) return [baseMask];

        // 1. Angular sweep at radius baseR to discover all candidate shapes on this ring
        const numAngularSteps = 120;
        const stepAngle = (2 * Math.PI) / numAngularSteps;
        const radialDeltas = [0, 4, -4, 8, -8, 12, -12];

        const ringMasks = [baseMask];
        const visitedKeys = new Set([baseMetrics.key]);

        for (let i = 0; i < numAngularSteps; i++) {
            const angle = i * stepAngle;
            const cosA = Math.cos(angle);
            const sinA = Math.sin(angle);

            for (let d = 0; d < radialDeltas.length; d++) {
                const sampleR = rPx + radialDeltas[d];
                if (sampleR <= 6) continue;

                const samplePxX = Math.round(cX + sampleR * cosA);
                const samplePxY = Math.round(cY + sampleR * sinA);

                if (samplePxX >= 0 && samplePxX < size && samplePxY >= 0 && samplePxY < size) {
                    const pos = samplePxY * size + samplePxX;
                    // Skip black outlines in O(1)
                    if (px[pos * 4] === 0) continue;

                    const sampleSvgX = samplePxX / scale;
                    const sampleSvgY = samplePxY / scale;

                    const candMask = this.floodFill(sampleSvgX, sampleSvgY, true);
                    if (candMask) {
                        const candMetrics = this.getMaskMetrics(candMask);
                        if (candMetrics && !visitedKeys.has(candMetrics.key)) {
                            const rDiff = Math.abs(candMetrics.radiusFromCenter - baseR);
                            const areaRatio = candMetrics.area / (baseArea || 1);

                            // Ring Member Criteria:
                            // 1. Lies on the exact same concentric radius band
                            // 2. Similar shape area (0.45x - 2.2x)
                            // 3. Similar bounding box dimension (not a giant backdrop)
                            const isSameBand = rDiff <= Math.max(10, baseR * 0.14);
                            const isSameSize = areaRatio >= 0.45 && areaRatio <= 2.2;
                            const isLocalized = candMetrics.bboxWidth < 180 && candMetrics.bboxHeight < 180;

                            if (isSameBand && isSameSize && isLocalized) {
                                visitedKeys.add(candMetrics.key);
                                ringMasks.push(candMask);
                                break;
                            }
                        }
                    }
                }
            }
        }

        // If 3 or more symmetric shapes form a circular layer, return the complete ring
        if (ringMasks.length >= 3) {
            return ringMasks;
        }

        // 2. If fewer than 3 shapes found in radial sweep, check for bilateral/mirror reflection
        const mirrorSvgX = 2 * center.x - baseMetrics.centroid.x;
        const mirrorSvgY = baseMetrics.centroid.y;
        const mirrorMask = this.floodFill(mirrorSvgX, mirrorSvgY, true);
        if (mirrorMask) {
            const mirrorMetrics = this.getMaskMetrics(mirrorMask);
            if (mirrorMetrics && mirrorMetrics.key !== baseMetrics.key) {
                const rDiff = Math.abs(mirrorMetrics.radiusFromCenter - baseR);
                const areaRatio = mirrorMetrics.area / (baseArea || 1);
                if (rDiff <= 8 && areaRatio >= 0.65 && areaRatio <= 1.55) {
                    return [baseMask, mirrorMask];
                }
            }
        }

        // If non-symmetric / isolated motif, color ONLY the clicked shape
        return [baseMask];
    }

    getCenterOfDesign() {
        return this.centerSvg || { x: 200, y: 200 };
    }
}
