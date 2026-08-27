// ============================================
// Onam Pookalam Designer — Design Page Logic
// - 100% Vector Mandala Collection (All designs fill with symmetry)
// - Inner shapes, backdrop rings & outer canvas background fillable
// - Universal Radial Symmetry (ON/OFF) across all designs & flower stamping
// - Real Onam flowers, pinwheel jasmine, leaves & earth backdrop tones
// - Community Gallery & Social Sharing
// ============================================

(function () {
    const templateStep = document.getElementById('templateStep');
    const subTemplateStep = document.getElementById('subTemplateStep');
    const predefinedTemplates = document.getElementById('predefinedTemplates');
    const customTemplateUpload = document.getElementById('customTemplateUpload');
    const templateFileInput = document.getElementById('templateFileInput');
    const canvasStep = document.getElementById('canvasStep');
    const pageTitle = document.getElementById('pageTitle');
    const btnBack = document.getElementById('btnBack');
    const canvasHint = document.getElementById('canvasHint');

    if (!templateStep || !canvasStep) return; // not on design.html

    const svg = document.getElementById('pookalamCanvas');
    const canvasBgRect = document.getElementById('canvasBgRect');
    const vectorFillLayer = document.getElementById('vectorFillLayer');
    const vectorBorderLayer = document.getElementById('vectorBorderLayer');
    const guideLayer = document.getElementById('guideLayer');
    const petalLayer = document.getElementById('petalLayer');
    const btnSymmetry = document.getElementById('btnSymmetry');

    const CENTER = 200;
    const CANVAS_SIZE = 400;          // matches SVG viewBox
    const BORDER_THRESHOLD = 120;     // luminance below this = border pixel
    const MAX_REGION_RATIO = 0.98;

    const SIZES = { small: 16, medium: 26, large: 38 };

    // ====================================================
    // TRADITIONAL ONAM FLOWERS & AUTHENTIC PALETTES
    // ====================================================
    const ONAM_FLOWERS = [
        {
            id: 'thumba',
            nameEn: 'Thumba',
            nameMl: 'തുമ്പ',
            icon: '🌿',
            description: 'Sacred white Onam flower',
            varieties: [
                { name: 'Pure White', hex: '#ffffff', center: '#16a34a', border: '#cbd5e1' }
            ]
        },
        {
            id: 'thechi',
            nameEn: 'Thechi',
            nameMl: 'തെച്ചി',
            icon: '🌺',
            description: 'Vibrant 4-petal Ixora flower',
            varieties: [
                { name: 'Scarlet Red', hex: '#dc2626', center: '#fca5a5', border: '#991b1b' },
                { name: 'Golden Yellow', hex: '#facc15', center: '#854d0e', border: '#ca8a04' },
                { name: 'Coral Orange', hex: '#ea580c', center: '#fed7aa', border: '#9a3412' }
            ]
        },
        {
            id: 'jamanthi',
            nameEn: 'Jamanthi',
            nameMl: 'ജമന്തി',
            icon: '🌼',
            description: 'Radiating pom-pom Chrysanthemum',
            varieties: [
                { name: 'Sunshine Yellow', hex: '#fbbf24', center: '#d97706', border: '#b45309' },
                { name: 'Warm Orange', hex: '#f97316', center: '#c2410c', border: '#7c2d12' },
                { name: 'Pure White', hex: '#ffffff', center: '#facc15', border: '#cbd5e1' }
            ]
        },
        {
            id: 'rose',
            nameEn: 'Rose',
            nameMl: 'റോസ് / പനിനീർ',
            icon: '🌹',
            description: 'Layered fragrant Rose petals',
            varieties: [
                { name: 'Rose Red', hex: '#e11d48', center: '#881337', border: '#9f1239' },
                { name: 'Paneer Pink', hex: '#f472b6', center: '#be185d', border: '#db2777' }
            ]
        },
        {
            id: 'marigold',
            nameEn: 'Marigold',
            nameMl: 'ചെണ്ടുമല്ലി',
            icon: '🏵️',
            description: 'Ruffled festive Tagetes pom-pom',
            varieties: [
                { name: 'Bright Orange', hex: '#f97316', center: '#9a3412', border: '#c2410c' },
                { name: 'Golden Yellow', hex: '#eab308', center: '#854d0e', border: '#ca8a04' }
            ]
        },
        {
            id: 'lotus',
            nameEn: 'Lotus',
            nameMl: 'താമര',
            icon: '🪷',
            description: 'Sacred pointed Lotus petals',
            varieties: [
                { name: 'Lotus Pink', hex: '#fb7185', center: '#facc15', border: '#e11d48' },
                { name: 'Sacred White', hex: '#ffffff', center: '#facc15', border: '#cbd5e1' }
            ]
        },
        {
            id: 'chembarathi',
            nameEn: 'Chembarathi',
            nameMl: 'ചെമ്പരത്തി',
            icon: '🌺',
            description: 'Classic 5-petal flared Hibiscus',
            varieties: [
                { name: 'Crimson Red', hex: '#dc2626', center: '#7f1d1d', border: '#991b1b', stamen: '#fbbf24' },
                { name: 'Bright Pink', hex: '#ec4899', center: '#831843', border: '#be185d', stamen: '#fde047' }
            ]
        },
        {
            id: 'pinwheel',
            nameEn: 'Pinwheel (Nanthyarvattom)',
            nameMl: 'നന്ത്യാർവട്ടം',
            icon: '💮',
            description: 'Fragrant 5-petal pinwheel Crape Jasmine',
            varieties: [
                { name: 'Pure White', hex: '#ffffff', center: '#facc15', border: '#cbd5e1' },
                { name: 'Soft Cream', hex: '#fef3c7', center: '#eab308', border: '#e2e8f0' }
            ]
        },
        {
            id: 'backdrops',
            nameEn: 'Leaves & Earth Tones',
            nameMl: 'ഇലകളും പശ്ചാത്തലവും',
            icon: '🍃',
            description: 'Plantain leaf green and earthy background tones',
            varieties: [
                { name: 'Tulsi Green', hex: '#14532d', center: '#22c55e', border: '#052e16' },
                { name: 'Forest Green', hex: '#1b4332', center: '#40916c', border: '#081c15' },
                { name: 'Earth Brown', hex: '#4e3620', center: '#8c6239', border: '#2b1d0c' },
                { name: 'Dark Clay', hex: '#382314', center: '#6f4e37', border: '#1f130b' },
                { name: 'Temple Ochre', hex: '#b45309', center: '#f59e0b', border: '#78350f' }
            ]
        }
    ];

    let currentFlower = ONAM_FLOWERS[4]; // Default: Marigold
    let currentColor = ONAM_FLOWERS[4].varieties[0]; // Default: Bright Orange
    let currentMode = 'shredded'; // 'shredded' (pure solid color fill) or 'whole' (stamp flower)
    let isSymmetryActive = true; // Universal symmetry toggle
    let currentSizeKey = 'medium';
    let placed = []; // Undo stack

    const NS = 'http://www.w3.org/2000/svg';

    function hexToRgb(hex) {
        let c = hex.replace('#', '');
        if (c.length === 3) c = c.split('').map(x => x + x).join('');
        const num = parseInt(c, 16);
        return {
            r: (num >> 16) & 255,
            g: (num >> 8) & 255,
            b: num & 255
        };
    }

    function getSymmetricPoints(cx, cy, x, y, folds = 8) {
        const dx = x - cx;
        const dy = y - cy;
        const r = Math.sqrt(dx * dx + dy * dy);
        if (r < 16) {
            return [{ x, y }];
        }
        const baseAngle = Math.atan2(dy, dx);
        const step = (Math.PI * 2) / folds;
        const points = [];
        for (let k = 0; k < folds; k++) {
            const angle = baseAngle + k * step;
            const sx = Math.round(cx + r * Math.cos(angle));
            const sy = Math.round(cy + r * Math.sin(angle));
            points.push({ x: sx, y: sy });
        }
        return points;
    }

    // ====================================================
    // REGION DETECTION & SOLID IMAGE COLOR FILLING
    // ====================================================
    let isImageTemplate = false;
    let templateReady = false;
    let templateCtx = null;
    let imageFillCanvas = null;
    let imageFillCtx = null;
    let imageFillImgEl = null;
    let regionCache = new Map();
    let currentTemplateSrc = null;
    let currentSubTemplate = null;
    let currentVectorTpl = null;

    let adaptiveBorderThreshold = 128;

    function initRegionDetection(imgSrc) {
        isImageTemplate = true;
        templateReady = false;
        regionCache.clear();

        const offscreen = document.createElement('canvas');
        offscreen.width = CANVAS_SIZE;
        offscreen.height = CANVAS_SIZE;
        templateCtx = offscreen.getContext('2d', { willReadFrequently: true });

        imageFillCanvas = document.createElement('canvas');
        imageFillCanvas.width = CANVAS_SIZE;
        imageFillCanvas.height = CANVAS_SIZE;
        imageFillCtx = imageFillCanvas.getContext('2d', { willReadFrequently: true });
        imageFillCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        if (imageFillImgEl) imageFillImgEl.remove();
        imageFillImgEl = document.createElementNS(NS, 'image');
        imageFillImgEl.setAttribute('x', '0');
        imageFillImgEl.setAttribute('y', '0');
        imageFillImgEl.setAttribute('width', String(CANVAS_SIZE));
        imageFillImgEl.setAttribute('height', String(CANVAS_SIZE));
        vectorFillLayer.appendChild(imageFillImgEl);

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            templateCtx.drawImage(img, 0, 0, CANVAS_SIZE, CANVAS_SIZE);

            // Computer Vision: Adaptive luminance histogram analysis for edge threshold
            const imgData = templateCtx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
            const px = imgData.data;
            let sumLum = 0;
            let count = 0;
            for (let i = 0; i < px.length; i += 16) {
                const lum = 0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2];
                sumLum += lum;
                count++;
            }
            const avgLum = sumLum / count;
            adaptiveBorderThreshold = Math.max(65, Math.min(145, Math.round(avgLum * 0.72)));

            templateReady = true;
            updateHint();
        };
        img.onerror = () => { isImageTemplate = false; };
        img.src = imgSrc;
    }

    function floodFillRegion(svgX, svgY) {
        const startX = Math.round(svgX);
        const startY = Math.round(svgY);
        if (startX < 0 || startX >= CANVAS_SIZE || startY < 0 || startY >= CANVAS_SIZE) return null;

        const key = `${startX},${startY}`;
        if (regionCache.has(key)) return regionCache.get(key);

        const imgData = templateCtx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        const px = imgData.data;
        const total = CANVAS_SIZE * CANVAS_SIZE;
        const thresh = adaptiveBorderThreshold;

        function lum(p) {
            const i = p * 4;
            return 0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2];
        }

        let startPos = startY * CANVAS_SIZE + startX;
        if (lum(startPos) < thresh) {
            let foundPos = -1;
            for (let r = 1; r <= 4; r++) {
                for (let dy = -r; dy <= r; dy++) {
                    for (let dx = -r; dx <= r; dx++) {
                        const nx = startX + dx;
                        const ny = startY + dy;
                        if (nx >= 0 && nx < CANVAS_SIZE && ny >= 0 && ny < CANVAS_SIZE) {
                            const np = ny * CANVAS_SIZE + nx;
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

            const x = pos % CANVAS_SIZE;
            const y = Math.floor(pos / CANVAS_SIZE);

            if (x > 0) stack[stackTop++] = pos - 1;
            if (x < CANVAS_SIZE - 1) stack[stackTop++] = pos + 1;
            if (y > 0) stack[stackTop++] = pos - CANVAS_SIZE;
            if (y < CANVAS_SIZE - 1) stack[stackTop++] = pos + CANVAS_SIZE;
        }

        if (pixelCount === 0) return null;

        regionCache.set(key, mask);
        return mask;
    }

    function applyMasksToFillCanvas(masks, hexColor) {
        if (!imageFillCtx) return;
        const imgData = imageFillCtx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        const d = imgData.data;
        const rgb = hexToRgb(hexColor);

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

        imageFillCtx.putImageData(imgData, 0, 0);
        if (imageFillImgEl) {
            imageFillImgEl.setAttribute('href', imageFillCanvas.toDataURL('image/png'));
        }
    }

    function clearRegionState() {
        isImageTemplate = false;
        templateReady = false;
        templateCtx = null;
        imageFillCanvas = null;
        imageFillCtx = null;
        imageFillImgEl = null;
        regionCache.clear();
        currentTemplateSrc = null;
    }

    // ====================================================
    // COMPLETE INTERACTIVE VECTOR MANDALA COLLECTION
    // (Every design has crisp borders, symmetry & full filling)
    // ====================================================
    const VECTOR_TEMPLATES = [
        {
            id: 'surya-padma',
            name: 'Surya Padma (സൂര്യപത്മം)',
            badge: 'Mandala ✨',
            build: buildSuryaPadmaMandala
        },
        {
            id: 'lotus-mandala',
            name: 'Sacred Lotus (അഷ്ടദള പത്മം)',
            badge: 'Mandala ✨',
            build: buildLotusMandala
        },
        {
            id: 'sunburst-12',
            name: 'Sunburst Star (സൂര്യകാന്തി)',
            badge: 'Mandala ✨',
            build: buildSunburstMandala
        },
        {
            id: 'peacock-wheel',
            name: 'Peacock Wheel (മയിൽപ്പീലി)',
            badge: 'Mandala ✨',
            build: buildPeacockWheelMandala
        },
        {
            id: 'diamond-mandala',
            name: 'Diamond Star (വൈര നക്ഷത്രം)',
            badge: 'Mandala ✨',
            build: buildDiamondStarMandala
        },
        {
            id: 'concentric-rings',
            name: 'Concentric Bloom (സഹസ്രദളം)',
            badge: 'Mandala ✨',
            build: buildConcentricBloomMandala
        },
        {
            id: 'heritage-8',
            name: 'Classic Heritage (പാരമ്പര്യ വലയം)',
            badge: 'Mandala ✨',
            build: buildHeritageMandala
        },
        {
            id: 'festival-ring',
            name: 'Festival Floral Ring (ഉത്സവ വലയം)',
            badge: 'Mandala ✨',
            build: buildFestivalRingMandala
        },
        {
            id: 'star-weave',
            name: 'Star Weave (നക്ഷത്ര ജാലകം)',
            badge: 'Mandala ✨',
            build: buildStarWeaveMandala
        },
        {
            id: 'royal-core',
            name: 'Royal Core (രാജകീയ പത്മം)',
            badge: 'Mandala ✨',
            build: buildRoyalCoreMandala
        },
        {
            id: 'peacock-plume',
            name: 'Peacock Plumes (പീലി വിരിഞ്ഞത്)',
            badge: 'Mandala ✨',
            build: buildPeacockPlumeMandala
        },
        {
            id: 'spiral-bloom',
            name: 'Spiral Vortex (സർപ്പിള പുഷ്പം)',
            badge: 'Mandala ✨',
            build: buildSpiralBloomMandala
        }
    ];

    const PREDEFINED_TEMPLATES = {
        circle: [
            { id: 'c1', name: 'Floral Star', img: 'assets/images/circle-1.jpg' },
            { id: 'c2', name: 'Geometric Star', img: 'assets/images/circle-2.jpg' },
            { id: 'c3', name: 'Scalloped Mandala', img: 'assets/images/circle-3.jpg' },
            { id: 'c4', name: 'Diamond Burst', img: 'assets/images/circle-4.jpg' },
            { id: 'c5', name: 'Classic Ring', img: 'assets/images/circle-5.jpg' },
            { id: 'c6', name: 'Sunburst', img: 'assets/images/circle-6.jpg' },
            { id: 'c7', name: 'Petal Wave', img: 'assets/images/circle-7.jpg' },
            { id: 'c8', name: 'Lotus Bloom', img: 'assets/images/circle-8.jpg' },
            { id: 'c9', name: 'Intricate Web', img: 'assets/images/circle-9.jpg' },
            { id: 'c10', name: 'Royal Core', img: 'assets/images/circle-10.jpg' },
            { id: 'c11', name: 'Spiral Bloom', img: 'assets/images/circle-11.jpg' },
            { id: 'c12', name: 'Radiant Petals', img: 'assets/images/circle-12.jpg' },
            { id: 'c13', name: 'Layered Lotus', img: 'assets/images/circle-13.jpg' },
            { id: 'c14', name: 'Peacock Wheel', img: 'assets/images/circle-14.jpg' },
            { id: 'c15', name: 'Star Weave', img: 'assets/images/circle-15.jpg' },
            { id: 'c16', name: 'Floral Mandala', img: 'assets/images/circle-16.jpg' },
            { id: 'c17', name: 'Concentric Bloom', img: 'assets/images/circle-17.jpg' },
            { id: 'c18', name: 'Heritage Pattern', img: 'assets/images/circle-18.jpg' },
            { id: 'c19', name: 'Petal Crown', img: 'assets/images/circle-19.jpg' },
            { id: 'c20', name: 'Grand Sunflower', img: 'assets/images/circle-20.jpg' },
            { id: 'c21', name: 'Festival Ring', img: 'assets/images/circle-21.jpg' }
        ]
    };

    // Segment creation with dynamic symmetry hover & explicit presentation attributes
    function createSegmentElement(dPath, groupKey) {
        const path = document.createElementNS(NS, 'path');
        path.setAttribute('d', dPath);
        path.setAttribute('class', 'pookalam-segment');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', '#2a1608');
        path.setAttribute('stroke-width', '1.8');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        path.setAttribute('data-group', groupKey);

        path.addEventListener('mouseenter', () => {
            if (isSymmetryActive && groupKey) {
                const sameGroup = vectorBorderLayer.querySelectorAll(`.pookalam-segment[data-group="${groupKey}"]`);
                sameGroup.forEach(el => el.classList.add('symm-highlight'));
            } else {
                path.classList.add('symm-highlight');
            }
        });

        path.addEventListener('mouseleave', () => {
            const allHighlighted = vectorBorderLayer.querySelectorAll('.symm-highlight');
            allHighlighted.forEach(el => el.classList.remove('symm-highlight'));
        });

        path.addEventListener('click', (e) => {
            e.stopPropagation();
            fillVectorSegment(path, groupKey);
        });

        return path;
    }

    function addCircleSegment(layer, cx, cy, r, groupKey) {
        const d = `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx} ${cy + r} A ${r} ${r} 0 1 1 ${cx} ${cy - r} Z`;
        layer.appendChild(createSegmentElement(d, groupKey));
    }

    function addPetalSegment(layer, cx, cy, dist, angleDeg, length, width, groupKey) {
        const rad = (angleDeg - 90) * Math.PI / 180;
        const perp = rad + Math.PI / 2;

        const bx = cx + dist * Math.cos(rad);
        const by = cy + dist * Math.sin(rad);
        const tx = cx + (dist + length) * Math.cos(rad);
        const ty = cy + (dist + length) * Math.sin(rad);

        const mx1 = cx + (dist + length * 0.5) * Math.cos(rad) + (width * 0.5) * Math.cos(perp);
        const my1 = cy + (dist + length * 0.5) * Math.sin(rad) + (width * 0.5) * Math.sin(perp);
        const mx2 = cx + (dist + length * 0.5) * Math.cos(rad) - (width * 0.5) * Math.cos(perp);
        const my2 = cy + (dist + length * 0.5) * Math.sin(rad) - (width * 0.5) * Math.sin(perp);

        const d = `M ${bx} ${by} Q ${mx1} ${my1} ${tx} ${ty} Q ${mx2} ${my2} ${bx} ${by} Z`;
        layer.appendChild(createSegmentElement(d, groupKey));
    }

    function addAnnularArcSegment(layer, cx, cy, r1, r2, startDeg, endDeg, groupKey) {
        const rad1 = (startDeg - 90) * Math.PI / 180;
        const rad2 = (endDeg - 90) * Math.PI / 180;

        const x1 = cx + r1 * Math.cos(rad1);
        const y1 = cy + r1 * Math.sin(rad1);
        const x2 = cx + r2 * Math.cos(rad1);
        const y2 = cy + r2 * Math.sin(rad1);
        const x3 = cx + r2 * Math.cos(rad2);
        const y3 = cy + r2 * Math.sin(rad2);
        const x4 = cx + r1 * Math.cos(rad2);
        const y4 = cy + r1 * Math.sin(rad2);

        const largeArc = (endDeg - startDeg) > 180 ? 1 : 0;
        const d = `M ${x1} ${y1} L ${x2} ${y2} A ${r2} ${r2} 0 ${largeArc} 1 ${x3} ${y3} L ${x4} ${y4} A ${r1} ${r1} 0 ${largeArc} 0 ${x1} ${y1} Z`;
        layer.appendChild(createSegmentElement(d, groupKey));
    }

    function addDiamondSegment(layer, cx, cy, dist, angleDeg, length, width, groupKey) {
        const rad = (angleDeg - 90) * Math.PI / 180;
        const perp = rad + Math.PI / 2;

        const bx = cx + (dist - length * 0.5) * Math.cos(rad);
        const by = cy + (dist - length * 0.5) * Math.sin(rad);
        const tx = cx + (dist + length * 0.5) * Math.cos(rad);
        const ty = cy + (dist + length * 0.5) * Math.sin(rad);

        const mx1 = cx + dist * Math.cos(rad) + (width * 0.5) * Math.cos(perp);
        const my1 = cy + dist * Math.sin(rad) + (width * 0.5) * Math.sin(perp);
        const mx2 = cx + dist * Math.cos(rad) - (width * 0.5) * Math.cos(perp);
        const my2 = cy + dist * Math.sin(rad) - (width * 0.5) * Math.sin(perp);

        const d = `M ${bx} ${by} L ${mx1} ${my1} L ${tx} ${ty} L ${mx2} ${my2} Z`;
        layer.appendChild(createSegmentElement(d, groupKey));
    }

    // 1. Surya Padma Mandala (User Reference Design)
    function buildSuryaPadmaMandala(layer) {
        // Outer concentric backdrop rings
        for (let i = 0; i < 16; i++) {
            addPetalSegment(layer, CENTER, CENTER, 152, i * 22.5, 38, 30, 'surya-outer-scallops');
        }
        for (let i = 0; i < 16; i++) {
            addAnnularArcSegment(layer, CENTER, CENTER, 138, 152, i * 22.5, (i + 1) * 22.5, 'surya-red-rim');
        }
        for (let i = 0; i < 16; i++) {
            addAnnularArcSegment(layer, CENTER, CENTER, 114, 138, i * 22.5, (i + 1) * 22.5, 'surya-green-ring');
        }
        // NEW — fillable gap between green ring and petal tiers
        for (let i = 0; i < 12; i++) {
            addAnnularArcSegment(layer, CENTER, CENTER, 100, 114, i * 30, (i + 1) * 30, 'surya-gap-1');
        }
        // Dual interlocking petal tiers
        for (let i = 0; i < 12; i++) {
            addPetalSegment(layer, CENTER, CENTER, 74, i * 30 + 15, 48, 26, 'surya-orange-tier');
        }
        for (let i = 0; i < 12; i++) {
            addPetalSegment(layer, CENTER, CENTER, 74, i * 30, 48, 26, 'surya-yellow-tier');
        }
        // Inner green circle backdrop
        for (let i = 0; i < 8; i++) {
            addAnnularArcSegment(layer, CENTER, CENTER, 52, 74, i * 45, (i + 1) * 45, 'surya-inner-backdrop');
        }
        // White core jasmine petals
        for (let i = 0; i < 6; i++) {
            addPetalSegment(layer, CENTER, CENTER, 18, i * 60, 36, 20, 'surya-white-core');
        }
        // Center bindu
        addCircleSegment(layer, CENTER, CENTER, 18, 'surya-center-bindu');
        // NEW — outermost floor beyond scallops, up to canvas edge
        for (let i = 0; i < 16; i++) {
            addAnnularArcSegment(layer, CENTER, CENTER, 190, 199, i * 22.5, (i + 1) * 22.5, 'surya-outer-floor');
        }
    }

    // 2. Sacred Lotus Mandala
    function buildLotusMandala(layer) {
        addCircleSegment(layer, CENTER, CENTER, 24, 'lotus-center');
        for (let i = 0; i < 8; i++) {
            addPetalSegment(layer, CENTER, CENTER, 24, i * 45, 45, 24, 'lotus-inner-8');
        }
        // NEW — fillable gap between inner and mid petal tiers
        for (let i = 0; i < 16; i++) {
            addAnnularArcSegment(layer, CENTER, CENTER, 69, 76, i * 22.5, (i + 1) * 22.5, 'lotus-gap-1');
        }
        for (let i = 0; i < 8; i++) {
            addPetalSegment(layer, CENTER, CENTER, 65, i * 45 + 22.5, 60, 36, 'lotus-mid-8');
        }
        // NEW — fillable gap between mid petals and outer ring
        for (let i = 0; i < 16; i++) {
            addAnnularArcSegment(layer, CENTER, CENTER, 120, 125, i * 22.5, (i + 1) * 22.5, 'lotus-gap-2');
        }
        for (let i = 0; i < 16; i++) {
            addAnnularArcSegment(layer, CENTER, CENTER, 120, 155, i * 22.5, (i + 1) * 22.5, 'lotus-ring-16');
        }
        for (let i = 0; i < 16; i++) {
            addPetalSegment(layer, CENTER, CENTER, 155, i * 22.5 + 11.25, 38, 28, 'lotus-scallop-16');
        }
        // NEW — outermost floor beyond scallops, up to canvas edge
        for (let i = 0; i < 16; i++) {
            addAnnularArcSegment(layer, CENTER, CENTER, 190, 199, i * 22.5, (i + 1) * 22.5, 'lotus-outer-floor');
        }
    }

    // 3. Sunburst 12-Ray Mandala
    function buildSunburstMandala(layer) {
        addCircleSegment(layer, CENTER, CENTER, 28, 'sun-center');
        for (let i = 0; i < 12; i++) {
            addPetalSegment(layer, CENTER, CENTER, 28, i * 30, 48, 18, 'sun-rays-12');
        }
        for (let i = 0; i < 12; i++) {
            addDiamondSegment(layer, CENTER, CENTER, 100, i * 30 + 15, 52, 26, 'sun-diamonds-12');
        }
        for (let i = 0; i < 24; i++) {
            addAnnularArcSegment(layer, CENTER, CENTER, 128, 162, i * 15, (i + 1) * 15, 'sun-flutes-24');
        }
        for (let i = 0; i < 24; i++) {
            addPetalSegment(layer, CENTER, CENTER, 162, i * 15 + 7.5, 32, 18, 'sun-outer-24');
        }
    }

    // 4. Peacock Wheel Mandala
    function buildPeacockWheelMandala(layer) {
        addCircleSegment(layer, CENTER, CENTER, 26, 'peacock-center');
        for (let i = 0; i < 8; i++) {
            addPetalSegment(layer, CENTER, CENTER, 26, i * 45, 52, 28, 'peacock-eyes-8');
        }
        for (let i = 0; i < 8; i++) {
            addDiamondSegment(layer, CENTER, CENTER, 102, i * 45 + 22.5, 58, 36, 'peacock-fans-8');
        }
        for (let i = 0; i < 16; i++) {
            addAnnularArcSegment(layer, CENTER, CENTER, 130, 162, i * 22.5, (i + 1) * 22.5, 'peacock-ring-16');
        }
        for (let i = 0; i < 16; i++) {
            addPetalSegment(layer, CENTER, CENTER, 162, i * 22.5 + 11.25, 34, 26, 'peacock-waves-16');
        }
    }

    // 5. Diamond Star Mandala
    function buildDiamondStarMandala(layer) {
        addDiamondSegment(layer, CENTER, CENTER, 0, 0, 48, 48, 'diamond-core');
        for (let i = 0; i < 8; i++) {
            addDiamondSegment(layer, CENTER, CENTER, 52, i * 45, 48, 28, 'diamond-tier1');
        }
        for (let i = 0; i < 8; i++) {
            addDiamondSegment(layer, CENTER, CENTER, 98, i * 45 + 22.5, 62, 36, 'diamond-tier2');
        }
        for (let i = 0; i < 16; i++) {
            addDiamondSegment(layer, CENTER, CENTER, 142, i * 22.5, 46, 24, 'diamond-tier3');
        }
        for (let i = 0; i < 16; i++) {
            addPetalSegment(layer, CENTER, CENTER, 162, i * 22.5 + 11.25, 32, 24, 'diamond-chevrons');
        }
    }

    // 6. Concentric Bloom Mandala
    function buildConcentricBloomMandala(layer) {
        addCircleSegment(layer, CENTER, CENTER, 22, 'bloom-center');
        for (let i = 0; i < 8; i++) {
            addPetalSegment(layer, CENTER, CENTER, 22, i * 45, 42, 22, 'bloom-tier-8');
        }
        for (let i = 0; i < 12; i++) {
            addPetalSegment(layer, CENTER, CENTER, 62, i * 30 + 15, 52, 24, 'bloom-tier-12');
        }
        for (let i = 0; i < 16; i++) {
            addPetalSegment(layer, CENTER, CENTER, 110, i * 22.5, 54, 26, 'bloom-tier-16');
        }
        for (let i = 0; i < 24; i++) {
            addPetalSegment(layer, CENTER, CENTER, 158, i * 15 + 7.5, 36, 20, 'bloom-tier-24');
        }
    }

    // 7. Heritage 8-Petal Mandala
    function buildHeritageMandala(layer) {
        addCircleSegment(layer, CENTER, CENTER, 26, 'heritage-center');
        for (let i = 0; i < 8; i++) {
            addPetalSegment(layer, CENTER, CENTER, 26, i * 45, 56, 32, 'heritage-hearts-8');
        }
        for (let i = 0; i < 8; i++) {
            addDiamondSegment(layer, CENTER, CENTER, 102, i * 45 + 22.5, 60, 36, 'heritage-chevrons-8');
        }
        for (let i = 0; i < 16; i++) {
            addAnnularArcSegment(layer, CENTER, CENTER, 128, 160, i * 22.5, (i + 1) * 22.5, 'heritage-arcs-16');
        }
        for (let i = 0; i < 16; i++) {
            addPetalSegment(layer, CENTER, CENTER, 160, i * 22.5 + 11.25, 34, 26, 'heritage-shells-16');
        }
    }

    // 8. Festival Floral Ring Mandala
    function buildFestivalRingMandala(layer) {
        addCircleSegment(layer, CENTER, CENTER, 22, 'fest-center');
        for (let i = 0; i < 8; i++) {
            addPetalSegment(layer, CENTER, CENTER, 22, i * 45, 46, 24, 'fest-tier1');
        }
        for (let i = 0; i < 16; i++) {
            addAnnularArcSegment(layer, CENTER, CENTER, 68, 96, i * 22.5, (i + 1) * 22.5, 'fest-ring1');
        }
        for (let i = 0; i < 16; i++) {
            addDiamondSegment(layer, CENTER, CENTER, 116, i * 22.5, 44, 22, 'fest-diamonds');
        }
        for (let i = 0; i < 16; i++) {
            addAnnularArcSegment(layer, CENTER, CENTER, 136, 158, i * 22.5, (i + 1) * 22.5, 'fest-ring2');
        }
        for (let i = 0; i < 16; i++) {
            addPetalSegment(layer, CENTER, CENTER, 158, i * 22.5 + 11.25, 34, 26, 'fest-outer');
        }
    }

    // 9. Geometric Star Weave Mandala
    function buildStarWeaveMandala(layer) {
        addDiamondSegment(layer, CENTER, CENTER, 0, 0, 42, 42, 'weave-core');
        for (let i = 0; i < 8; i++) {
            addDiamondSegment(layer, CENTER, CENTER, 46, i * 45, 52, 28, 'weave-star-tier1');
        }
        for (let i = 0; i < 8; i++) {
            addPetalSegment(layer, CENTER, CENTER, 80, i * 45 + 22.5, 48, 30, 'weave-star-tier2');
        }
        for (let i = 0; i < 16; i++) {
            addAnnularArcSegment(layer, CENTER, CENTER, 120, 150, i * 22.5, (i + 1) * 22.5, 'weave-ring');
        }
        for (let i = 0; i < 16; i++) {
            addDiamondSegment(layer, CENTER, CENTER, 162, i * 22.5, 34, 22, 'weave-outer-chevrons');
        }
    }

    // 10. Royal Core Mandala
    function buildRoyalCoreMandala(layer) {
        addCircleSegment(layer, CENTER, CENTER, 26, 'royal-center');
        for (let i = 0; i < 8; i++) {
            addPetalSegment(layer, CENTER, CENTER, 26, i * 45, 54, 30, 'royal-inner-8');
        }
        for (let i = 0; i < 16; i++) {
            addAnnularArcSegment(layer, CENTER, CENTER, 80, 115, i * 22.5, (i + 1) * 22.5, 'royal-band');
        }
        for (let i = 0; i < 16; i++) {
            addDiamondSegment(layer, CENTER, CENTER, 134, i * 22.5 + 11.25, 42, 26, 'royal-diamonds');
        }
        for (let i = 0; i < 16; i++) {
            addPetalSegment(layer, CENTER, CENTER, 155, i * 22.5, 38, 28, 'royal-outer-arches');
        }
    }

    // 11. Peacock Plumes Mandala
    function buildPeacockPlumeMandala(layer) {
        addCircleSegment(layer, CENTER, CENTER, 24, 'plume-center');
        for (let i = 0; i < 8; i++) {
            addPetalSegment(layer, CENTER, CENTER, 24, i * 45, 54, 26, 'plume-fans');
        }
        for (let i = 0; i < 8; i++) {
            addDiamondSegment(layer, CENTER, CENTER, 94, i * 45 + 22.5, 48, 30, 'plume-eyes');
        }
        for (let i = 0; i < 16; i++) {
            addAnnularArcSegment(layer, CENTER, CENTER, 122, 156, i * 22.5, (i + 1) * 22.5, 'plume-arcs');
        }
        for (let i = 0; i < 16; i++) {
            addPetalSegment(layer, CENTER, CENTER, 156, i * 22.5 + 11.25, 36, 26, 'plume-crests');
        }
    }

    // 12. Spiral Vortex Bloom Mandala
    function buildSpiralBloomMandala(layer) {
        addCircleSegment(layer, CENTER, CENTER, 20, 'spiral-center');
        for (let i = 0; i < 8; i++) {
            addPetalSegment(layer, CENTER, CENTER, 20, i * 45 + 15, 48, 22, 'spiral-arm-inner');
        }
        for (let i = 0; i < 12; i++) {
            addPetalSegment(layer, CENTER, CENTER, 66, i * 30 + 15, 54, 26, 'spiral-arm-mid');
        }
        for (let i = 0; i < 16; i++) {
            addAnnularArcSegment(layer, CENTER, CENTER, 120, 155, i * 22.5, (i + 1) * 22.5, 'spiral-ring');
        }
        for (let i = 0; i < 16; i++) {
            addPetalSegment(layer, CENTER, CENTER, 155, i * 22.5 + 10, 36, 24, 'spiral-flares');
        }
    }

    // ---------- Vector Segment Filling Handler (Solid Pure Color) ----------
    function fillVectorSegment(targetPath, groupKey) {
        if (currentMode === 'whole') {
            const bbox = targetPath.getBBox();
            const cx = bbox.x + bbox.width / 2;
            const cy = bbox.y + bbox.height / 2;
            handleFlowerStampAt(cx, cy);
            return;
        }

        const segmentsToFill = (isSymmetryActive && groupKey)
            ? Array.from(vectorBorderLayer.querySelectorAll(`.pookalam-segment[data-group="${groupKey}"]`))
            : [targetPath];

        const batchAction = [];

        segmentsToFill.forEach(seg => {
            const d = seg.getAttribute('d');
            const pathFill = document.createElementNS(NS, 'path');
            pathFill.setAttribute('d', d);
            pathFill.setAttribute('fill', currentColor.hex);
            pathFill.setAttribute('stroke', currentColor.border || 'rgba(0,0,0,0.12)');
            pathFill.setAttribute('stroke-width', '0.5');
            pathFill.setAttribute('class', 'vector-segment-fill');

            vectorFillLayer.appendChild(pathFill);
            batchAction.push(pathFill);
        });

        placed.push({
            type: 'vector-batch',
            elements: batchAction
        });

        if (canvasHint) {
            canvasHint.textContent = `✨ Filled ${segmentsToFill.length} ${segmentsToFill.length === 1 ? 'shape' : 'mandala petals'} with ${currentColor.name} ${currentFlower.nameEn}!`;
        }
    }

    // ====================================================
    // FULL WHOLE FLOWER STAMP GENERATORS
    // (Render rich iconic flowers: 🌺, 💮, 🪷, 🏵️, 🌹, 🌼)
    // ====================================================

    function createFlower(cx, cy, flowerObj, colorObj, size) {
        const flowerType = flowerObj ? flowerObj.id : (currentFlower ? currentFlower.id : 'marigold');
        const color = colorObj || currentColor;
        const g = document.createElementNS(NS, 'g');

        const randomRot = Math.random() * 360;
        g.setAttribute('transform', `rotate(${randomRot} ${cx} ${cy})`);

        switch (flowerType) {
            case 'rose':
                return drawRoseFlower(g, cx, cy, color, size);
            case 'jamanthi':
                return drawJamanthiFlower(g, cx, cy, color, size);
            case 'lotus':
                return drawLotusFlower(g, cx, cy, color, size);
            case 'marigold':
                return drawMarigoldFlower(g, cx, cy, color, size);
            case 'chembarathi':
                return drawChembarathiFlower(g, cx, cy, color, size);
            case 'pinwheel':
                return drawPinwheelFlower(g, cx, cy, color, size);
            case 'thechi':
                return drawThechiFlower(g, cx, cy, color, size);
            case 'thumba':
                return drawThumbaFlower(g, cx, cy, color, size);
            case 'backdrops':
                return drawLeafFlake(g, cx, cy, color, size);
            default:
                return drawMarigoldFlower(g, cx, cy, color, size);
        }
    }

    // 🌹 Rose (Panineer) — 3-Tier Layered Spiral Rose Petals
    function drawRoseFlower(g, cx, cy, color, size) {
        // Outer 5 heart-shaped cup petals
        for (let i = 0; i < 5; i++) {
            const angle = (360 / 5) * i;
            const p = document.createElementNS(NS, 'path');
            const d = `M ${cx} ${cy} C ${cx - size * 0.44} ${cy - size * 0.18} ${cx - size * 0.38} ${cy - size * 0.54} ${cx} ${cy - size * 0.48} C ${cx + size * 0.38} ${cy - size * 0.54} ${cx + size * 0.44} ${cy - size * 0.18} ${cx} ${cy} Z`;
            p.setAttribute('d', d);
            p.setAttribute('fill', color.hex);
            p.setAttribute('stroke', color.border || '#9f1239');
            p.setAttribute('stroke-width', '0.7');
            p.setAttribute('transform', `rotate(${angle} ${cx} ${cy})`);
            g.appendChild(p);
        }
        // Mid 5 curved overlapping petals
        for (let i = 0; i < 5; i++) {
            const angle = (360 / 5) * i + 36;
            const p = document.createElementNS(NS, 'path');
            const d = `M ${cx} ${cy} C ${cx - size * 0.3} ${cy - size * 0.1} ${cx - size * 0.26} ${cy - size * 0.38} ${cx} ${cy - size * 0.34} C ${cx + size * 0.26} ${cy - size * 0.38} ${cx + size * 0.3} ${cy - size * 0.1} ${cx} ${cy} Z`;
            p.setAttribute('d', d);
            p.setAttribute('fill', color.center || '#be185d');
            p.setAttribute('stroke', color.border || '#9f1239');
            p.setAttribute('stroke-width', '0.5');
            p.setAttribute('opacity', '0.95');
            p.setAttribute('transform', `rotate(${angle} ${cx} ${cy})`);
            g.appendChild(p);
        }
        // Inner spiral rosebud core
        const core = document.createElementNS(NS, 'circle');
        core.setAttribute('cx', cx);
        core.setAttribute('cy', cy);
        core.setAttribute('r', size * 0.15);
        core.setAttribute('fill', color.center || '#881337');
        g.appendChild(core);

        const swirl = document.createElementNS(NS, 'path');
        const swD = `M ${cx - size * 0.08} ${cy + size * 0.04} C ${cx - size * 0.12} ${cy - size * 0.1} ${cx + size * 0.1} ${cy - size * 0.1} ${cx + size * 0.08} ${cy + size * 0.04} C ${cx + size * 0.04} ${cy + size * 0.1} ${cx - size * 0.02} ${cy + size * 0.08} ${cx - size * 0.02} ${cy} Z`;
        swirl.setAttribute('d', swD);
        swirl.setAttribute('fill', color.hex);
        g.appendChild(swirl);
        return g;
    }

    // 🌼 Jamanthi (Chrysanthemum) — Radiating Florets with Golden Center
    function drawJamanthiFlower(g, cx, cy, color, size) {
        // Outer 12 rounded petals
        for (let i = 0; i < 12; i++) {
            const angle = (360 / 12) * i;
            const petal = document.createElementNS(NS, 'ellipse');
            petal.setAttribute('cx', cx);
            petal.setAttribute('cy', cy - size * 0.32);
            petal.setAttribute('rx', size * 0.13);
            petal.setAttribute('ry', size * 0.34);
            petal.setAttribute('fill', color.hex);
            petal.setAttribute('stroke', color.border || '#ca8a04');
            petal.setAttribute('stroke-width', '0.6');
            petal.setAttribute('transform', `rotate(${angle} ${cx} ${cy})`);
            g.appendChild(petal);
        }
        // Inner 12 offset petals
        for (let i = 0; i < 12; i++) {
            const angle = (360 / 12) * i + 15;
            const petal = document.createElementNS(NS, 'ellipse');
            petal.setAttribute('cx', cx);
            petal.setAttribute('cy', cy - size * 0.22);
            petal.setAttribute('rx', size * 0.11);
            petal.setAttribute('ry', size * 0.24);
            petal.setAttribute('fill', color.hex);
            petal.setAttribute('stroke', color.border || '#ca8a04');
            petal.setAttribute('stroke-width', '0.5');
            petal.setAttribute('transform', `rotate(${angle} ${cx} ${cy})`);
            g.appendChild(petal);
        }
        // Golden Center Disc
        const centerOuter = document.createElementNS(NS, 'circle');
        centerOuter.setAttribute('cx', cx);
        centerOuter.setAttribute('cy', cy);
        centerOuter.setAttribute('r', size * 0.22);
        centerOuter.setAttribute('fill', color.center || '#d97706');
        centerOuter.setAttribute('stroke', '#78350f');
        centerOuter.setAttribute('stroke-width', '0.6');
        g.appendChild(centerOuter);

        const centerInner = document.createElementNS(NS, 'circle');
        centerInner.setAttribute('cx', cx);
        centerInner.setAttribute('cy', cy);
        centerInner.setAttribute('r', size * 0.12);
        centerInner.setAttribute('fill', '#fbbf24');
        g.appendChild(centerInner);
        return g;
    }

    // 🪷 Sacred Lotus (Thamarappoovu) — Pointed Lotus Bloom with Golden Seed Pod
    function drawLotusFlower(g, cx, cy, color, size) {
        // Outer 8 pointed lotus petals
        for (let i = 0; i < 8; i++) {
            const angle = (360 / 8) * i;
            const p = document.createElementNS(NS, 'path');
            const d = `M ${cx} ${cy} C ${cx - size * 0.32} ${cy - size * 0.15} ${cx - size * 0.22} ${cy - size * 0.52} ${cx} ${cy - size * 0.56} C ${cx + size * 0.22} ${cy - size * 0.52} ${cx + size * 0.32} ${cy - size * 0.15} ${cx} ${cy} Z`;
            p.setAttribute('d', d);
            p.setAttribute('fill', color.hex);
            p.setAttribute('stroke', color.border || '#e11d48');
            p.setAttribute('stroke-width', '0.7');
            p.setAttribute('transform', `rotate(${angle} ${cx} ${cy})`);
            g.appendChild(p);
        }
        // Inner 6 layered petals
        for (let i = 0; i < 6; i++) {
            const angle = (360 / 6) * i + 30;
            const p = document.createElementNS(NS, 'path');
            const d = `M ${cx} ${cy} C ${cx - size * 0.22} ${cy - size * 0.1} ${cx - size * 0.16} ${cy - size * 0.36} ${cx} ${cy - size * 0.4} C ${cx + size * 0.16} ${cy - size * 0.36} ${cx + size * 0.22} ${cy - size * 0.1} ${cx} ${cy} Z`;
            p.setAttribute('d', d);
            p.setAttribute('fill', color.hex);
            p.setAttribute('stroke', color.border || '#e11d48');
            p.setAttribute('stroke-width', '0.5');
            p.setAttribute('transform', `rotate(${angle} ${cx} ${cy})`);
            g.appendChild(p);
        }
        // Golden Seed Pod
        const pod = document.createElementNS(NS, 'circle');
        pod.setAttribute('cx', cx);
        pod.setAttribute('cy', cy);
        pod.setAttribute('r', size * 0.18);
        pod.setAttribute('fill', color.center || '#facc15');
        pod.setAttribute('stroke', '#ca8a04');
        pod.setAttribute('stroke-width', '0.7');
        g.appendChild(pod);

        // Seed dots
        for (let s = 0; s < 5; s++) {
            const sAngle = (360 / 5) * s;
            const sRad = (sAngle * Math.PI) / 180;
            const sx = cx + size * 0.08 * Math.cos(sRad);
            const sy = cy + size * 0.08 * Math.sin(sRad);
            const dot = document.createElementNS(NS, 'circle');
            dot.setAttribute('cx', sx);
            dot.setAttribute('cy', sy);
            dot.setAttribute('r', size * 0.025);
            dot.setAttribute('fill', '#854d0e');
            g.appendChild(dot);
        }
        return g;
    }

    // 🏵️ Marigold (Chendumalli) — Multi-Tier Ruffled Festive Pom-Pom
    function drawMarigoldFlower(g, cx, cy, color, size) {
        // Tier 1: Outer 12 ruffled scalloped petals
        for (let i = 0; i < 12; i++) {
            const angle = (360 / 12) * i;
            const petal = document.createElementNS(NS, 'ellipse');
            petal.setAttribute('cx', cx);
            petal.setAttribute('cy', cy - size * 0.34);
            petal.setAttribute('rx', size * 0.18);
            petal.setAttribute('ry', size * 0.36);
            petal.setAttribute('fill', color.hex);
            petal.setAttribute('stroke', color.border || '#c2410c');
            petal.setAttribute('stroke-width', '0.6');
            petal.setAttribute('transform', `rotate(${angle} ${cx} ${cy})`);
            g.appendChild(petal);
        }
        // Tier 2: Mid 12 ruffled petals
        for (let i = 0; i < 12; i++) {
            const angle = (360 / 12) * i + 15;
            const petal = document.createElementNS(NS, 'ellipse');
            petal.setAttribute('cx', cx);
            petal.setAttribute('cy', cy - size * 0.22);
            petal.setAttribute('rx', size * 0.15);
            petal.setAttribute('ry', size * 0.26);
            petal.setAttribute('fill', color.hex);
            petal.setAttribute('stroke', color.border || '#c2410c');
            petal.setAttribute('stroke-width', '0.5');
            petal.setAttribute('transform', `rotate(${angle} ${cx} ${cy})`);
            g.appendChild(petal);
        }
        // Tier 3: Inner 8 ruffled core petals
        for (let i = 0; i < 8; i++) {
            const angle = (360 / 8) * i + 22.5;
            const petal = document.createElementNS(NS, 'ellipse');
            petal.setAttribute('cx', cx);
            petal.setAttribute('cy', cy - size * 0.12);
            petal.setAttribute('rx', size * 0.12);
            petal.setAttribute('ry', size * 0.16);
            petal.setAttribute('fill', color.center || '#ea580c');
            petal.setAttribute('transform', `rotate(${angle} ${cx} ${cy})`);
            g.appendChild(petal);
        }
        // Deep Amber Pom-Pom Center
        const center = document.createElementNS(NS, 'circle');
        center.setAttribute('cx', cx);
        center.setAttribute('cy', cy);
        center.setAttribute('r', size * 0.16);
        center.setAttribute('fill', color.center || '#7c2d12');
        g.appendChild(center);
        return g;
    }

    // 🌺 Chembarathi (Hibiscus) — 5 Flared Petals with Stamen
    function drawChembarathiFlower(g, cx, cy, color, size) {
        // 5 Broad flared petals
        for (let i = 0; i < 5; i++) {
            const angle = (360 / 5) * i;
            const petal = document.createElementNS(NS, 'ellipse');
            petal.setAttribute('cx', cx);
            petal.setAttribute('cy', cy - size * 0.28);
            petal.setAttribute('rx', size * 0.3);
            petal.setAttribute('ry', size * 0.44);
            petal.setAttribute('fill', color.hex);
            petal.setAttribute('stroke', color.border || '#991b1b');
            petal.setAttribute('stroke-width', '0.7');
            petal.setAttribute('transform', `rotate(${angle} ${cx} ${cy})`);
            g.appendChild(petal);
        }
        // Deep crimson center nectar star
        const eye = document.createElementNS(NS, 'circle');
        eye.setAttribute('cx', cx);
        eye.setAttribute('cy', cy);
        eye.setAttribute('r', size * 0.22);
        eye.setAttribute('fill', color.center || '#7f1d1d');
        g.appendChild(eye);

        // Golden Stamen Column
        const stamenStem = document.createElementNS(NS, 'line');
        stamenStem.setAttribute('x1', cx);
        stamenStem.setAttribute('y1', cy);
        stamenStem.setAttribute('x2', cx + size * 0.22);
        stamenStem.setAttribute('y2', cy - size * 0.26);
        stamenStem.setAttribute('stroke', color.stamen || '#fbbf24');
        stamenStem.setAttribute('stroke-width', '2.5');
        stamenStem.setAttribute('stroke-linecap', 'round');
        g.appendChild(stamenStem);

        // Pollen dots
        for (let p = 0; p < 4; p++) {
            const pDot = document.createElementNS(NS, 'circle');
            pDot.setAttribute('cx', cx + size * (0.16 + p * 0.03));
            pDot.setAttribute('cy', cy - size * (0.18 + p * 0.03));
            pDot.setAttribute('r', size * 0.04);
            pDot.setAttribute('fill', '#fde047');
            g.appendChild(pDot);
        }
        return g;
    }

    // 💮 Pinwheel Crape Jasmine (Nanthyarvattom) — 5 Swirling Blade Petals
    function drawPinwheelFlower(g, cx, cy, color, size) {
        for (let i = 0; i < 5; i++) {
            const angle = (360 / 5) * i;
            const p = document.createElementNS(NS, 'path');
            const d = `M ${cx} ${cy} C ${cx + size * 0.14} ${cy - size * 0.18} ${cx + size * 0.44} ${cy - size * 0.32} ${cx + size * 0.42} ${cy - size * 0.52} C ${cx + size * 0.22} ${cy - size * 0.54} ${cx - size * 0.04} ${cy - size * 0.36} ${cx} ${cy} Z`;
            p.setAttribute('d', d);
            p.setAttribute('fill', color.hex);
            p.setAttribute('stroke', color.border || '#cbd5e1');
            p.setAttribute('stroke-width', '0.7');
            p.setAttribute('transform', `rotate(${angle} ${cx} ${cy})`);
            g.appendChild(p);
        }
        const eye = document.createElementNS(NS, 'circle');
        eye.setAttribute('cx', cx);
        eye.setAttribute('cy', cy);
        eye.setAttribute('r', size * 0.12);
        eye.setAttribute('fill', color.center || '#facc15');
        g.appendChild(eye);
        return g;
    }

    // 🌺 Thechi (Ixora) — 4 Cross Diamond Petals
    function drawThechiFlower(g, cx, cy, color, size) {
        for (let i = 0; i < 4; i++) {
            const angle = (360 / 4) * i + 45;
            const p = document.createElementNS(NS, 'polygon');
            const pts = `${cx},${cy} ${cx - size * 0.24},${cy - size * 0.3} ${cx},${cy - size * 0.54} ${cx + size * 0.24},${cy - size * 0.3}`;
            p.setAttribute('points', pts);
            p.setAttribute('fill', color.hex);
            p.setAttribute('stroke', color.border || '#991b1b');
            p.setAttribute('stroke-width', '0.7');
            p.setAttribute('transform', `rotate(${angle} ${cx} ${cy})`);
            g.appendChild(p);
        }
        const tube = document.createElementNS(NS, 'circle');
        tube.setAttribute('cx', cx);
        tube.setAttribute('cy', cy);
        tube.setAttribute('r', size * 0.14);
        tube.setAttribute('fill', color.center || '#fde047');
        g.appendChild(tube);
        return g;
    }

    // 🌿 Thumba (White Leucas) — Delicate 4-Petal Cluster
    function drawThumbaFlower(g, cx, cy, color, size) {
        for (let i = 0; i < 4; i++) {
            const angle = (360 / 4) * i;
            const p = document.createElementNS(NS, 'path');
            const d = `M ${cx} ${cy} Q ${cx - size * 0.18} ${cy - size * 0.3} ${cx} ${cy - size * 0.52} Q ${cx + size * 0.18} ${cy - size * 0.3} ${cx} ${cy} Z`;
            p.setAttribute('d', d);
            p.setAttribute('fill', color.hex);
            p.setAttribute('stroke', color.border || '#cbd5e1');
            p.setAttribute('stroke-width', '0.6');
            p.setAttribute('transform', `rotate(${angle} ${cx} ${cy})`);
            g.appendChild(p);
        }
        const calyx = document.createElementNS(NS, 'circle');
        calyx.setAttribute('cx', cx);
        calyx.setAttribute('cy', cy);
        calyx.setAttribute('r', size * 0.16);
        calyx.setAttribute('fill', color.center || '#16a34a');
        g.appendChild(calyx);
        return g;
    }

    // 🍃 Leaves & Earth Flake
    function drawLeafFlake(g, cx, cy, color, size) {
        const p = document.createElementNS(NS, 'path');
        const d = `M ${cx} ${cy - size * 0.4} Q ${cx + size * 0.3} ${cy} ${cx} ${cy + size * 0.4} Q ${cx - size * 0.3} ${cy} ${cx} ${cy - size * 0.4} Z`;
        p.setAttribute('d', d);
        p.setAttribute('fill', color.hex);
        p.setAttribute('stroke', color.border || 'rgba(0,0,0,0.18)');
        p.setAttribute('stroke-width', '0.6');
        g.appendChild(p);
        return g;
    }

    function withinBounds(x, y) {
        return x >= 0 && x <= CANVAS_SIZE && y >= 0 && y <= CANVAS_SIZE;
    }

    function flashOutOfBounds() {
        svg.classList.add('shake');
        setTimeout(() => svg.classList.remove('shake'), 200);
    }

    function svgPoint(evt) {
        const rect = svg.getBoundingClientRect();
        const clientX = evt.touches ? evt.touches[0].clientX : evt.clientX;
        const clientY = evt.touches ? evt.touches[0].clientY : evt.clientY;
        const x = ((clientX - rect.left) / rect.width) * CANVAS_SIZE;
        const y = ((clientY - rect.top) / rect.height) * CANVAS_SIZE;
        return { x, y };
    }

    function handleFlowerStampAt(x, y) {
        const size = SIZES[currentSizeKey];

        if (isSymmetryActive) {
            const symPoints = getSymmetricPoints(CENTER, CENTER, x, y, 8);
            const batch = [];
            symPoints.forEach(pt => {
                if (withinBounds(pt.x, pt.y)) {
                    const flower = createFlower(pt.x, pt.y, currentFlower, currentColor, size);
                    petalLayer.appendChild(flower);
                    batch.push(flower);
                }
            });
            placed.push({
                type: 'stamp-batch',
                elements: batch
            });
            canvasHint.textContent = `🌸 Placed ${batch.length} symmetrical ${currentFlower.nameEn} flowers!`;
        } else {
            const flower = createFlower(x, y, currentFlower, currentColor, size);
            petalLayer.appendChild(flower);
            placed.push({
                type: 'stamp-batch',
                elements: [flower]
            });
            canvasHint.textContent = `🌸 Placed ${currentColor.name} ${currentFlower.nameEn} flower!`;
        }
    }

    // ====================================================
    // MASTER CANVAS CLICK / DRAW HANDLER
    // ====================================================
    function handleCanvasClick(evt) {
        const { x, y } = svgPoint(evt);

        // 1. Stamp Flower Mode
        if (currentMode === 'whole') {
            if (!withinBounds(x, y)) {
                flashOutOfBounds();
                return;
            }
            handleFlowerStampAt(x, y);
            return;
        }

        // 2. Shredded (Color Fill Mode)
        // Check if user clicked on outer canvas floor background
        const clickedEl = evt.target;
        const dx = x - CENTER;
        const dy = y - CENTER;
        const distFromCenter = Math.sqrt(dx * dx + dy * dy);

        if (clickedEl === canvasBgRect || clickedEl === svg || (currentVectorTpl && distFromCenter > 175)) {
            const oldFill = canvasBgRect.getAttribute('fill') || 'url(#floorGradient)';
            canvasBgRect.setAttribute('fill', currentColor.hex);
            placed.push({
                type: 'bg-fill',
                previousFill: oldFill
            });
            canvasHint.textContent = `✨ Filled canvas background floor with ${currentColor.name}!`;
            return;
        }

        if (isImageTemplate) {
            if (!templateReady) {
                canvasHint.textContent = 'Template still loading — please wait a moment.';
                return;
            }

            const previousState = imageFillCtx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);

            if (isSymmetryActive) {
                const symPoints = getSymmetricPoints(CENTER, CENTER, x, y, 8);
                const masks = [];
                symPoints.forEach(pt => {
                    const m = floodFillRegion(pt.x, pt.y);
                    if (m) masks.push(m);
                });

                if (masks.length === 0) {
                    flashOutOfBounds();
                    canvasHint.textContent = "Clicked on a border line! Tap inside an enclosed shape to fill it.";
                    setTimeout(updateHint, 1800);
                    return;
                }

                applyMasksToFillCanvas(masks, currentColor.hex);

                placed.push({
                    type: 'image-fill',
                    previousState: previousState
                });

                canvasHint.textContent = `✨ Filled ${masks.length} symmetrical shapes with ${currentColor.name} ${currentFlower.nameEn}!`;
            } else {
                const mask = floodFillRegion(x, y);
                if (!mask) {
                    flashOutOfBounds();
                    canvasHint.textContent = "Clicked on a border line! Tap inside an enclosed shape to fill it.";
                    setTimeout(updateHint, 1800);
                    return;
                }

                applyMasksToFillCanvas([mask], currentColor.hex);

                placed.push({
                    type: 'image-fill',
                    previousState: previousState
                });

                canvasHint.textContent = `✨ Filled shape with ${currentColor.name} ${currentFlower.nameEn}!`;
            }
        } else if (currentVectorTpl) {
            // Handled directly by vector segment click listener
        } else {
            // Free blank canvas -> fill background
            const oldFill = canvasBgRect.getAttribute('fill') || 'url(#floorGradient)';
            canvasBgRect.setAttribute('fill', currentColor.hex);
            placed.push({
                type: 'bg-fill',
                previousFill: oldFill
            });
            canvasHint.textContent = `✨ Filled background floor with ${currentColor.name}!`;
        }
    }

    svg.addEventListener('click', handleCanvasClick);

    const customBuilderStep = document.getElementById('customBuilderStep');
    const btnDesignMyOwn = document.getElementById('btnDesignMyOwn');
    const btnUseCustomTemplate = document.getElementById('btnUseCustomTemplate');
    const customBuilderPreviewSvg = document.getElementById('customBuilderPreviewSvg');

    let previousStep = 'browse'; // 'browse' or 'custom'

    // ---------- Custom Template Builder State & Renderer ----------
    let customConfig = {
        core: 'ganapathi',
        coreScale: 1.0,
        mid: 'pointed-12',
        midScale: 1.0,
        rings: 'double-ring',
        ringScale: 1.0,
        outer: 'scallop-16',
        outerScale: 1.0
    };

    function addSegmentFromD(layer, dPath, groupKey) {
        layer.appendChild(createSegmentElement(dPath, groupKey));
    }

    function renderCustomMandala(layer, config) {
        const outerScale = config.outerScale || 1.0;
        const ringScale = config.ringScale || 1.0;
        const midScale = config.midScale || 1.0;
        const coreScale = config.coreScale || 1.0;

        // 1. Outer Border Layer
        const outerDist = 140 + 14 * outerScale;
        const outerLen = 34 * outerScale;
        const outerWid = 28 * outerScale;

        if (config.outer === 'scallop-16') {
            for (let i = 0; i < 16; i++) {
                addPetalSegment(layer, CENTER, CENTER, outerDist, i * 22.5, outerLen, outerWid, 'cust-outer-scallop');
            }
        } else if (config.outer === 'sunburst-24') {
            for (let i = 0; i < 24; i++) {
                addPetalSegment(layer, CENTER, CENTER, outerDist + 4, i * 15 + 7.5, outerLen * 0.95, outerWid * 0.6, 'cust-outer-sunburst');
            }
        } else if (config.outer === 'diamond-chevron') {
            for (let i = 0; i < 16; i++) {
                addDiamondSegment(layer, CENTER, CENTER, outerDist + 6, i * 22.5, outerLen * 1.05, outerWid * 0.8, 'cust-outer-chevrons');
            }
        } else if (config.outer === 'crest-waves') {
            for (let i = 0; i < 16; i++) {
                addPetalSegment(layer, CENTER, CENTER, outerDist + 2, i * 22.5 + 11.25, outerLen, outerWid * 0.9, 'cust-outer-waves');
            }
        } else if (config.outer === 'plain-circle') {
            const rOut = Math.min(195, outerDist + 8);
            addAnnularArcSegment(layer, CENTER, CENTER, rOut - 8, rOut, 0, 180, 'cust-outer-ring');
            addAnnularArcSegment(layer, CENTER, CENTER, rOut - 8, rOut, 180, 360, 'cust-outer-ring');
        }

        // 2. Concentric Rings / Bands
        const rOuter = Math.min(170, 138 * ringScale);
        const rInner = Math.max(90, 116 * ringScale);

        if (config.rings === 'double-ring') {
            for (let i = 0; i < 16; i++) {
                addAnnularArcSegment(layer, CENTER, CENTER, rInner + (rOuter - rInner) * 0.5, rOuter, i * 22.5, (i + 1) * 22.5, 'cust-ring-outer');
            }
            for (let i = 0; i < 16; i++) {
                addAnnularArcSegment(layer, CENTER, CENTER, rInner, rInner + (rOuter - rInner) * 0.5, i * 22.5, (i + 1) * 22.5, 'cust-ring-inner');
            }
        } else if (config.rings === 'single-ring') {
            for (let i = 0; i < 12; i++) {
                addAnnularArcSegment(layer, CENTER, CENTER, rInner + 4, rOuter, i * 30, (i + 1) * 30, 'cust-ring-single');
            }
        } else if (config.rings === 'fluted-ring') {
            for (let i = 0; i < 24; i++) {
                addAnnularArcSegment(layer, CENTER, CENTER, rInner + 8, rOuter + 2, i * 15, (i + 1) * 15, 'cust-ring-fluted');
            }
        }

        // 3. Mid Petal / Star Pattern
        const midDist = 58 + 14 * coreScale;
        const midLen = 46 * midScale;
        const midWid = 26 * midScale;

        if (config.mid === 'pointed-12') {
            for (let i = 0; i < 12; i++) {
                addPetalSegment(layer, CENTER, CENTER, midDist, i * 30, midLen, midWid, 'cust-mid-pointed');
            }
        } else if (config.mid === 'dual-interlock') {
            for (let i = 0; i < 12; i++) {
                addPetalSegment(layer, CENTER, CENTER, midDist, i * 30 + 15, midLen, midWid, 'cust-mid-dual-1');
            }
            for (let i = 0; i < 12; i++) {
                addPetalSegment(layer, CENTER, CENTER, midDist, i * 30, midLen, midWid, 'cust-mid-dual-2');
            }
        } else if (config.mid === 'diamond-star') {
            for (let i = 0; i < 8; i++) {
                addDiamondSegment(layer, CENTER, CENTER, midDist + 22, i * 45 + 22.5, midLen * 1.2, midWid * 1.3, 'cust-mid-diamonds');
            }
        } else if (config.mid === 'heart-petals') {
            for (let i = 0; i < 8; i++) {
                addPetalSegment(layer, CENTER, CENTER, midDist - 16, i * 45, midLen * 1.2, midWid * 1.2, 'cust-mid-hearts');
            }
        } else if (config.mid === 'peacock-fan') {
            for (let i = 0; i < 8; i++) {
                addDiamondSegment(layer, CENTER, CENTER, midDist + 20, i * 45 + 22.5, midLen * 1.1, midWid * 1.3, 'cust-mid-fans');
            }
        }

        // 4. Sacred Center Core Motifs (Scalable via Core Group)
        const coreG = document.createElementNS(NS, 'g');
        if (coreScale !== 1.0) {
            coreG.setAttribute('transform', `translate(${CENTER}, ${CENTER}) scale(${coreScale}) translate(-${CENTER}, -${CENTER})`);
        }

        if (config.core === 'ganapathi') {
            // Inner backdrop ring
            addCircleSegment(coreG, CENTER, CENTER, 44, 'cust-core-backdrop');
            // Ganapathi Crown (കിരീടം)
            addSegmentFromD(coreG, `M ${CENTER - 10} ${CENTER - 16} L ${CENTER} ${CENTER - 32} L ${CENTER + 10} ${CENTER - 16} Z`, 'cust-ganesh-crown');
            // Ganapathi Left Ear (ഇടത്തെ ചെവി)
            addSegmentFromD(coreG, `M ${CENTER - 8} ${CENTER - 10} C ${CENTER - 26} ${CENTER - 12} ${CENTER - 28} ${CENTER + 12} ${CENTER - 10} ${CENTER + 15} Z`, 'cust-ganesh-left-ear');
            // Ganapathi Right Ear (വലത്തെ ചെവി)
            addSegmentFromD(coreG, `M ${CENTER + 8} ${CENTER - 10} C ${CENTER + 26} ${CENTER - 12} ${CENTER + 28} ${CENTER + 12} ${CENTER + 10} ${CENTER + 15} Z`, 'cust-ganesh-right-ear');
            // Ganapathi Face & Curved Trunk (തുമ്പിക്കൈ)
            addSegmentFromD(coreG, `M ${CENTER - 4} ${CENTER - 6} C ${CENTER - 2} ${CENTER + 12} ${CENTER - 12} ${CENTER + 28} ${CENTER + 2} ${CENTER + 32} C ${CENTER + 14} ${CENTER + 34} ${CENTER + 20} ${CENTER + 22} ${CENTER + 16} ${CENTER + 15} C ${CENTER + 12} ${CENTER + 8} ${CENTER + 4} ${CENTER + 10} ${CENTER + 4} ${CENTER + 14} C ${CENTER + 4} ${CENTER + 18} ${CENTER + 10} ${CENTER + 18} ${CENTER + 10} ${CENTER + 14} C ${CENTER + 10} ${CENTER + 6} ${CENTER} ${CENTER - 2} ${CENTER + 2} ${CENTER - 6} Z`, 'cust-ganesh-trunk');
            // Sacred Tilak Bindu
            addCircleSegment(coreG, CENTER, CENTER - 14, 3, 'cust-ganesh-tilak');
        } else if (config.core === 'lotus') {
            addCircleSegment(coreG, CENTER, CENTER, 44, 'cust-core-backdrop');
            for (let i = 0; i < 8; i++) {
                addPetalSegment(coreG, CENTER, CENTER, 14, i * 45, 30, 18, 'cust-lotus-core-petals');
            }
            addCircleSegment(coreG, CENTER, CENTER, 14, 'cust-lotus-core-bindu');
        } else if (config.core === 'nilavilakku') {
            addCircleSegment(coreG, CENTER, CENTER, 44, 'cust-core-backdrop');
            // Sacred flame
            addSegmentFromD(coreG, `M ${CENTER} ${CENTER - 34} Q ${CENTER + 8} ${CENTER - 22} ${CENTER} ${CENTER - 14} Q ${CENTER - 8} ${CENTER - 22} ${CENTER} ${CENTER - 34} Z`, 'cust-lamp-flame');
            // Lamp oil bowl
            addSegmentFromD(coreG, `M ${CENTER - 16} ${CENTER - 8} C ${CENTER - 16} ${CENTER + 4} ${CENTER + 16} ${CENTER + 4} ${CENTER + 16} ${CENTER - 8} Z`, 'cust-lamp-bowl');
            // Pillar stem
            addSegmentFromD(coreG, `M ${CENTER - 3} ${CENTER + 4} L ${CENTER + 3} ${CENTER + 4} L ${CENTER + 3} ${CENTER + 24} L ${CENTER - 3} ${CENTER + 24} Z`, 'cust-lamp-stem');
            // Base stand
            addSegmentFromD(coreG, `M ${CENTER - 18} ${CENTER + 32} C ${CENTER - 18} ${CENTER + 24} ${CENTER + 18} ${CENTER + 24} ${CENTER + 18} ${CENTER + 32} Z`, 'cust-lamp-base');
        } else if (config.core === 'peacock') {
            addCircleSegment(coreG, CENTER, CENTER, 44, 'cust-core-backdrop');
            for (let i = 0; i < 6; i++) {
                addPetalSegment(coreG, CENTER, CENTER, 14, i * 60, 28, 16, 'cust-peacock-plumes');
            }
            addCircleSegment(coreG, CENTER, CENTER, 12, 'cust-peacock-eye');
        } else if (config.core === 'jasmine') {
            addCircleSegment(coreG, CENTER, CENTER, 44, 'cust-core-backdrop');
            for (let i = 0; i < 6; i++) {
                addPetalSegment(coreG, CENTER, CENTER, 16, i * 60, 28, 18, 'cust-core-jasmine');
            }
            addCircleSegment(coreG, CENTER, CENTER, 16, 'cust-core-bindu');
        } else if (config.core === 'diamond') {
            addDiamondSegment(coreG, CENTER, CENTER, 0, 0, 48, 48, 'cust-core-diamond');
            for (let i = 0; i < 8; i++) {
                addDiamondSegment(coreG, CENTER, CENTER, 48, i * 45, 42, 24, 'cust-core-diamond-tier');
            }
        } else if (config.core === 'circle') {
            addCircleSegment(coreG, CENTER, CENTER, 44, 'cust-core-outer-circle');
            addCircleSegment(coreG, CENTER, CENTER, 24, 'cust-core-mid-circle');
            addCircleSegment(coreG, CENTER, CENTER, 10, 'cust-core-inner-bindu');
        }

        layer.appendChild(coreG);
    }

    // ---------- Custom Template Builder State, Drag-to-Resize & Live Studio ----------
    let isBuilderDragging = false;
    let activeDragLayer = null;
    let dragStartDist = 0;
    let dragStartScale = 1.0;
    let hoveredLayer = null;

    const builderDragTooltip = document.getElementById('builderDragTooltip');
    const customBuilderWrapper = document.getElementById('customBuilderWrapper');
    const btnResetBuilderScales = document.getElementById('btnResetBuilderScales');

    const BUILDER_LAYERS = {
        core: { key: 'core', scaleKey: 'coreScale', name: 'Center Sacred Motif', min: 0.55, max: 1.55 },
        mid: { key: 'mid', scaleKey: 'midScale', name: 'Mid Petals & Stars', min: 0.55, max: 1.55 },
        rings: { key: 'rings', scaleKey: 'ringScale', name: 'Backdrop Rings', min: 0.60, max: 1.45 },
        outer: { key: 'outer', scaleKey: 'outerScale', name: 'Outer Border Motifs', min: 0.60, max: 1.55 }
    };

    function getBuilderSvgPoint(svgEl, evt) {
        const pt = svgEl.createSVGPoint();
        pt.x = evt.clientX;
        pt.y = evt.clientY;
        const ctm = svgEl.getScreenCTM();
        if (ctm) {
            return pt.matrixTransform(ctm.inverse());
        }
        const rect = svgEl.getBoundingClientRect();
        return {
            x: ((evt.clientX - rect.left) / (rect.width || 1)) * 400,
            y: ((evt.clientY - rect.top) / (rect.height || 1)) * 400
        };
    }

    function getLayerFromDistance(dist) {
        const coreR = 44 * (customConfig.coreScale || 1.0);
        const midR = 58 + 14 * (customConfig.coreScale || 1.0) + 46 * (customConfig.midScale || 1.0) * 0.5;
        const ringR = Math.min(175, 138 * (customConfig.ringScale || 1.0));
        const outerR = Math.min(195, 140 + 14 * (customConfig.outerScale || 1.0) + 34 * (customConfig.outerScale || 1.0) * 0.85);

        if (dist <= coreR + 14) {
            return BUILDER_LAYERS.core;
        } else if (dist <= (midR + ringR) * 0.5 - 6) {
            return BUILDER_LAYERS.mid;
        } else if (dist <= (ringR + outerR) * 0.5 - 6) {
            return BUILDER_LAYERS.rings;
        } else {
            return BUILDER_LAYERS.outer;
        }
    }

    function renderDragGuidesAndHandles(overlayG) {
        const coreR = 44 * (customConfig.coreScale || 1.0);
        const midR = 58 + 14 * (customConfig.coreScale || 1.0) + 46 * (customConfig.midScale || 1.0) * 0.5;
        const ringR = Math.min(175, 138 * (customConfig.ringScale || 1.0));
        const outerR = Math.min(195, 140 + 14 * (customConfig.outerScale || 1.0) + 34 * (customConfig.outerScale || 1.0) * 0.85);

        const list = [
            { layer: BUILDER_LAYERS.core, radius: coreR },
            { layer: BUILDER_LAYERS.mid, radius: midR },
            { layer: BUILDER_LAYERS.rings, radius: ringR },
            { layer: BUILDER_LAYERS.outer, radius: outerR }
        ];

        list.forEach(item => {
            const l = item.layer;
            const isAct = (activeDragLayer === l.key);
            const isHov = (hoveredLayer === l.key);

            // Circular guideline ring
            const guide = document.createElementNS(NS, 'circle');
            guide.setAttribute('cx', CENTER);
            guide.setAttribute('cy', CENTER);
            guide.setAttribute('r', item.radius);
            guide.setAttribute('class', 'drag-guide-ring' + (isAct ? ' active' : (isHov ? ' hovered' : '')));
            overlayG.appendChild(guide);

            // Drag handle at top-right diagonal (angle -45 deg)
            const rad = (-45 * Math.PI) / 180;
            const hx = CENTER + item.radius * Math.cos(rad);
            const hy = CENTER + item.radius * Math.sin(rad);

            const hg = document.createElementNS(NS, 'g');
            hg.setAttribute('class', 'drag-handle-group' + (isAct ? ' active' : ''));
            hg.setAttribute('data-layer', l.key);
            hg.setAttribute('transform', `translate(${hx}, ${hy})`);

            const outerCircle = document.createElementNS(NS, 'circle');
            outerCircle.setAttribute('r', '8.5');
            outerCircle.setAttribute('class', 'drag-handle-outer');

            const innerCircle = document.createElementNS(NS, 'circle');
            innerCircle.setAttribute('r', '3.5');
            innerCircle.setAttribute('class', 'drag-handle-inner');

            hg.appendChild(outerCircle);
            hg.appendChild(innerCircle);
            overlayG.appendChild(hg);
        });
    }

    function updateCustomBuilderPreview() {
        if (!customBuilderPreviewSvg) return;
        customBuilderPreviewSvg.innerHTML = '';

        // Render floral mandala elements
        const gMandala = document.createElementNS(NS, 'g');
        renderCustomMandala(gMandala, customConfig);
        customBuilderPreviewSvg.appendChild(gMandala);

        // Render interactive drag handles & guide rings
        const gGuides = document.createElementNS(NS, 'g');
        gGuides.setAttribute('id', 'builderOverlayGuides');
        renderDragGuidesAndHandles(gGuides);
        customBuilderPreviewSvg.appendChild(gGuides);
    }

    // Direct Drag-to-Resize Pointer Handlers on the SVG Canvas
    if (customBuilderPreviewSvg) {
        customBuilderPreviewSvg.addEventListener('pointerdown', (e) => {
            const pt = getBuilderSvgPoint(customBuilderPreviewSvg, e);
            const dx = pt.x - CENTER;
            const dy = pt.y - CENTER;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Check if a handle was clicked directly
            let handleEl = e.target.closest('.drag-handle-group');
            let targetLayerObj;
            if (handleEl && handleEl.dataset.layer) {
                targetLayerObj = BUILDER_LAYERS[handleEl.dataset.layer];
            } else {
                targetLayerObj = getLayerFromDistance(dist);
            }

            if (!targetLayerObj) return;

            isBuilderDragging = true;
            activeDragLayer = targetLayerObj.key;
            dragStartDist = Math.max(25, dist);
            dragStartScale = customConfig[targetLayerObj.scaleKey] || 1.0;

            customBuilderPreviewSvg.setPointerCapture(e.pointerId);
            if (customBuilderWrapper) customBuilderWrapper.classList.add('is-dragging');

            if (builderDragTooltip) {
                builderDragTooltip.textContent = `✨ ${targetLayerObj.name}: ${dragStartScale.toFixed(2)}×`;
                builderDragTooltip.classList.add('show');
            }

            updateCustomBuilderPreview();
        });

        customBuilderPreviewSvg.addEventListener('pointermove', (e) => {
            const pt = getBuilderSvgPoint(customBuilderPreviewSvg, e);
            const dx = pt.x - CENTER;
            const dy = pt.y - CENTER;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (isBuilderDragging && activeDragLayer) {
                const layerObj = BUILDER_LAYERS[activeDragLayer];
                if (!layerObj) return;

                const deltaDist = dist - dragStartDist;
                let newScale = dragStartScale + deltaDist * 0.012;
                newScale = Math.max(layerObj.min, Math.min(layerObj.max, newScale));
                newScale = Math.round(newScale * 100) / 100;

                customConfig[layerObj.scaleKey] = newScale;

                if (builderDragTooltip) {
                    builderDragTooltip.textContent = `✨ ${layerObj.name}: ${newScale.toFixed(2)}×`;
                    builderDragTooltip.classList.add('show');
                }

                updateCustomBuilderPreview();
            } else {
                // Hover highlight
                const layerObj = getLayerFromDistance(dist);
                const prevHover = hoveredLayer;
                hoveredLayer = layerObj ? layerObj.key : null;
                if (prevHover !== hoveredLayer) {
                    updateCustomBuilderPreview();
                }
            }
        });

        const stopDragging = (e) => {
            if (!isBuilderDragging) return;
            isBuilderDragging = false;
            activeDragLayer = null;
            hoveredLayer = null;

            if (customBuilderWrapper) customBuilderWrapper.classList.remove('is-dragging');
            if (builderDragTooltip) {
                setTimeout(() => {
                    if (!isBuilderDragging) builderDragTooltip.classList.remove('show');
                }, 800);
            }

            try {
                if (e && e.pointerId) customBuilderPreviewSvg.releasePointerCapture(e.pointerId);
            } catch (err) { }

            updateCustomBuilderPreview();
        };

        customBuilderPreviewSvg.addEventListener('pointerup', stopDragging);
        customBuilderPreviewSvg.addEventListener('pointercancel', stopDragging);
        customBuilderPreviewSvg.addEventListener('pointerleave', () => {
            if (!isBuilderDragging && hoveredLayer) {
                hoveredLayer = null;
                updateCustomBuilderPreview();
            }
        });
    }

    if (btnResetBuilderScales) {
        btnResetBuilderScales.addEventListener('click', () => {
            customConfig.coreScale = 1.0;
            customConfig.midScale = 1.0;
            customConfig.ringScale = 1.0;
            customConfig.outerScale = 1.0;
            updateCustomBuilderPreview();
            if (builderDragTooltip) {
                builderDragTooltip.textContent = '✨ Reset all sizes to 1.0×';
                builderDragTooltip.classList.add('show');
                setTimeout(() => builderDragTooltip.classList.remove('show'), 1200);
            }
        });
    }

    function setupCustomBuilderOptions(containerId, configKey) {
        const container = document.getElementById(containerId);
        if (!container) return;
        const cards = container.querySelectorAll('.builder-shape-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                cards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                customConfig[configKey] = card.dataset.val;
                updateCustomBuilderPreview();
            });
        });
    }

    setupCustomBuilderOptions('coreShapeOptions', 'core');
    setupCustomBuilderOptions('midPatternOptions', 'mid');
    setupCustomBuilderOptions('ringBandsOptions', 'rings');
    setupCustomBuilderOptions('outerBorderOptions', 'outer');

    function goToCustomBuilder() {
        templateStep.hidden = true;
        if (subTemplateStep) subTemplateStep.hidden = true;
        canvasStep.hidden = true;
        if (customBuilderStep) customBuilderStep.hidden = false;
        btnBack.hidden = false;
        pageTitle.textContent = 'Design My Own Template';
        previousStep = 'custom';
        updateCustomBuilderPreview();
    }

    if (btnDesignMyOwn) {
        btnDesignMyOwn.addEventListener('click', goToCustomBuilder);
    }

    if (btnUseCustomTemplate) {
        btnUseCustomTemplate.addEventListener('click', () => {
            currentVectorTpl = {
                id: 'custom-user-mandala',
                name: 'My Custom Pookalam',
                build: (layer) => renderCustomMandala(layer, customConfig)
            };
            currentTemplateSrc = null;
            currentSubTemplate = null;
            goToCanvas();
            if (vectorBorderLayer) {
                vectorBorderLayer.innerHTML = '';
                currentVectorTpl.build(vectorBorderLayer);
            }
        });
    }

    function goToHome() {
        canvasStep.hidden = true;
        if (subTemplateStep) subTemplateStep.hidden = true;
        if (customBuilderStep) customBuilderStep.hidden = true;
        templateStep.hidden = false;
        btnBack.hidden = true;
        pageTitle.textContent = 'Design Your Pookalam';
        clearRegionState();
        if (vectorFillLayer) vectorFillLayer.innerHTML = '';
        if (vectorBorderLayer) vectorBorderLayer.innerHTML = '';
        if (canvasBgRect) canvasBgRect.setAttribute('fill', 'url(#floorGradient)');
        guideLayer.innerHTML = '';
        petalLayer.innerHTML = '';
        placed = [];
    }

    function goToBrowseTemplates() {
        templateStep.hidden = true;
        if (customBuilderStep) customBuilderStep.hidden = true;
        canvasStep.hidden = true;
        if (subTemplateStep) subTemplateStep.hidden = false;
        btnBack.hidden = false;
        pageTitle.textContent = 'Pick a Design';
        previousStep = 'browse';

        const subTitle = document.getElementById('subTemplateTitle');
        const subSubtitle = document.getElementById('subTemplateSubtitle');
        if (subTitle) subTitle.textContent = 'Pick a design';
        if (subSubtitle) subSubtitle.textContent = 'Select an interactive mandala or classic tracing layout — all support symmetrical color filling & background floor coloring!';

        predefinedTemplates.hidden = false;
        customTemplateUpload.hidden = true;
        predefinedTemplates.innerHTML = '';

        // Section 1: Interactive Vector Mandalas (12 Designs)
        const head1 = document.createElement('div');
        head1.className = 'template-section-divider';
        head1.innerHTML = '<h3>✨ Interactive Mandala Layouts</h3><p>Instant crisp border snapping & 100% radial symmetry</p>';
        predefinedTemplates.appendChild(head1);

        const grid1 = document.createElement('div');
        grid1.className = 'templates-subgrid';

        VECTOR_TEMPLATES.forEach(tpl => {
            const btn = document.createElement('button');
            btn.className = 'template-card vector-card';

            const previewSvg = document.createElementNS(NS, 'svg');
            previewSvg.setAttribute('viewBox', '0 0 400 400');
            previewSvg.setAttribute('class', 'template-card-preview');
            const g = document.createElementNS(NS, 'g');
            tpl.build(g);
            previewSvg.appendChild(g);

            btn.appendChild(previewSvg);

            const title = document.createElement('div');
            title.className = 'template-card-title';
            title.innerHTML = `<span>${tpl.name}</span><span class="tpl-badge">${tpl.badge}</span>`;
            btn.appendChild(title);

            btn.addEventListener('click', () => {
                currentVectorTpl = tpl;
                currentTemplateSrc = null;
                currentSubTemplate = null;
                goToCanvas();
                if (vectorBorderLayer) {
                    vectorBorderLayer.innerHTML = '';
                    tpl.build(vectorBorderLayer);
                }
            });
            grid1.appendChild(btn);
        });
        predefinedTemplates.appendChild(grid1);

        // Section 2: Classic Pookalam Tracing Outlines (21 Designs)
        const head2 = document.createElement('div');
        head2.className = 'template-section-divider';
        head2.innerHTML = '<h3>📷 Classic Pookalam Tracing Outlines</h3><p>Traditional circular guide patterns with automatic border detection & symmetry</p>';
        predefinedTemplates.appendChild(head2);

        const grid2 = document.createElement('div');
        grid2.className = 'templates-subgrid classic-grid';

        PREDEFINED_TEMPLATES.circle.forEach(tpl => {
            const btn = document.createElement('button');
            btn.className = 'template-card';
            btn.innerHTML = `<img src="${tpl.img}" alt="${tpl.name}" loading="lazy" /><div class="template-card-title"><span>${tpl.name}</span></div>`;
            btn.addEventListener('click', () => {
                currentVectorTpl = null;
                currentTemplateSrc = tpl.img;
                currentSubTemplate = `<image href="${tpl.img}" x="0" y="0" width="400" height="400" opacity="0.28" preserveAspectRatio="xMidYMid meet" />`;
                goToCanvas();
            });
            grid2.appendChild(btn);
        });
        predefinedTemplates.appendChild(grid2);
    }

    function goToUploadOwn() {
        templateStep.hidden = true;
        if (customBuilderStep) customBuilderStep.hidden = true;
        canvasStep.hidden = true;
        if (subTemplateStep) subTemplateStep.hidden = false;
        btnBack.hidden = false;
        pageTitle.textContent = 'Upload Your Template';
        previousStep = 'upload';

        predefinedTemplates.innerHTML = '';
        predefinedTemplates.hidden = true;
        customTemplateUpload.hidden = false;

        const subTitle = document.getElementById('subTemplateTitle');
        const subSubtitle = document.getElementById('subTemplateSubtitle');
        if (subTitle) subTitle.textContent = 'Upload Your Own';
        if (subSubtitle) subSubtitle.textContent = 'Use your own picture or sketch as a tracing guide.';
    }

    function goToCanvas() {
        if (subTemplateStep) subTemplateStep.hidden = true;
        if (customBuilderStep) customBuilderStep.hidden = true;
        templateStep.hidden = true;
        canvasStep.hidden = false;
        btnBack.hidden = false;
        pageTitle.textContent = 'Design Your Pookalam';

        clearRegionState();
        if (vectorFillLayer) vectorFillLayer.innerHTML = '';
        if (!currentVectorTpl && vectorBorderLayer) vectorBorderLayer.innerHTML = '';
        if (canvasBgRect) canvasBgRect.setAttribute('fill', 'url(#floorGradient)');
        petalLayer.innerHTML = '';
        placed = [];

        if (currentTemplateSrc) {
            initRegionDetection(currentTemplateSrc);
        }

        drawGuide();
        updateHint();
    }

    const btnChooseTemplate = document.getElementById('btnChooseTemplate');
    if (btnChooseTemplate) btnChooseTemplate.addEventListener('click', goToBrowseTemplates);

    const btnUploadOwn = document.getElementById('btnUploadOwn');
    if (btnUploadOwn) btnUploadOwn.addEventListener('click', goToUploadOwn);

    const btnBrowseFiles = document.getElementById('btnBrowseFiles');
    if (btnBrowseFiles && templateFileInput) {
        btnBrowseFiles.addEventListener('click', () => {
            templateFileInput.click();
        });
    }

    if (templateFileInput) {
        templateFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                currentVectorTpl = null;
                currentTemplateSrc = event.target.result;
                currentSubTemplate = `<image href="${event.target.result}" x="0" y="0" width="400" height="400" opacity="0.28" preserveAspectRatio="xMidYMid meet" />`;
                goToCanvas();
            };
            reader.readAsDataURL(file);
        });
    }

    if (btnBack) {
        btnBack.addEventListener('click', () => {
            if (!canvasStep.hidden) {
                if (previousStep === 'custom') {
                    goToCustomBuilder();
                } else if (previousStep === 'upload') {
                    goToUploadOwn();
                } else {
                    goToBrowseTemplates();
                }
            } else if ((subTemplateStep && !subTemplateStep.hidden) || (customBuilderStep && !customBuilderStep.hidden)) {
                goToHome();
            }
        });
    }

    function updateHint() {
        const symLabel = isSymmetryActive ? '✨ Symmetry ON' : 'Symmetry OFF';
        if (currentMode === 'shredded') {
            if (isImageTemplate || currentVectorTpl) {
                canvasHint.textContent = `✂️ Shredded / Color Mode (${symLabel}): Tap any shape to fill petals, rings, or tap outside to color the background floor!`;
            } else {
                canvasHint.textContent = `🌸 Tap anywhere on the canvas to place ${currentFlower.nameEn} blooms (${symLabel}).`;
            }
        } else {
            canvasHint.textContent = `🌸 Whole Flower Mode (${symLabel}): Tap anywhere to stamp complete ${currentFlower.nameEn} blooms.`;
        }
    }

    function drawGuide() {
        guideLayer.innerHTML = '';
        if (currentSubTemplate) {
            guideLayer.innerHTML = currentSubTemplate;
        }
    }

    // ====================================================
    // FLOWER PALETTE & SWATCHES
    // ====================================================
    const flowerCategoriesEl = document.getElementById('flowerCategories');
    const activeFlowerIndicator = document.getElementById('activeFlowerIndicator');
    const activeFlowerName = document.getElementById('activeFlowerName');
    const activeColorName = document.getElementById('activeColorName');

    function updateActiveFlowerDisplay() {
        if (activeFlowerIndicator) activeFlowerIndicator.style.backgroundColor = currentColor.hex;
        if (activeFlowerName) activeFlowerName.textContent = `${currentFlower.icon} ${currentFlower.nameEn} (${currentFlower.nameMl})`;
        if (activeColorName) activeColorName.textContent = currentColor.name;
    }

    function buildFlowerSidebar() {
        if (!flowerCategoriesEl) return;
        flowerCategoriesEl.innerHTML = '';

        ONAM_FLOWERS.forEach(flower => {
            const isCategorySelected = (flower.id === currentFlower.id);
            const card = document.createElement('div');
            card.className = `flower-category-card ${isCategorySelected ? 'selected' : ''}`;
            card.dataset.flowerId = flower.id;

            const header = document.createElement('div');
            header.className = 'flower-category-header';
            header.innerHTML = `
                <span class="flower-category-icon">${flower.icon}</span>
                <div class="flower-category-names">
                    <span class="flower-name-en">${flower.nameEn}</span>
                    <span class="flower-name-ml">${flower.nameMl}</span>
                </div>
            `;
            card.appendChild(header);

            const swatchesGrid = document.createElement('div');
            swatchesGrid.className = 'flower-swatches-grid';

            flower.varieties.forEach(variety => {
                const isVarietyActive = (isCategorySelected && variety.name === currentColor.name);
                const swatchBtn = document.createElement('button');
                swatchBtn.className = `flower-swatch-item ${isVarietyActive ? 'active' : ''}`;
                swatchBtn.setAttribute('title', `${flower.nameEn} - ${variety.name}`);
                swatchBtn.setAttribute('aria-label', `${flower.nameEn} ${variety.name}`);

                swatchBtn.innerHTML = `
                    <div class="flower-swatch-circle" style="background: ${variety.hex}; ${variety.border ? `border-color: ${variety.border};` : ''}"></div>
                    <span class="flower-swatch-name">${variety.name}</span>
                `;

                swatchBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    currentFlower = flower;
                    currentColor = variety;

                    document.querySelectorAll('.flower-category-card').forEach(c => c.classList.remove('selected'));
                    card.classList.add('selected');

                    document.querySelectorAll('.flower-swatch-item').forEach(s => s.classList.remove('active'));
                    swatchBtn.classList.add('active');

                    updateActiveFlowerDisplay();
                    updateHint();
                });

                swatchesGrid.appendChild(swatchBtn);
            });

            card.appendChild(swatchesGrid);
            flowerCategoriesEl.appendChild(card);
        });

        updateActiveFlowerDisplay();
    }

    buildFlowerSidebar();

    // ---------- Symmetry Toggle Button ----------
    if (btnSymmetry) {
        btnSymmetry.addEventListener('click', () => {
            isSymmetryActive = !isSymmetryActive;
            btnSymmetry.classList.toggle('active', isSymmetryActive);
            btnSymmetry.textContent = isSymmetryActive ? '✨ Symmetry: ON' : 'Symmetry: OFF';
            updateHint();
        });
    }

    // ---------- Drawing Mode (Fill vs Stamp) ----------
    document.querySelectorAll('.form-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            currentMode = btn.dataset.form;
            document.querySelectorAll('.form-btn').forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
            updateHint();
        });
    });

    // ---------- Size Buttons ----------
    document.querySelectorAll('.size-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            currentSizeKey = btn.dataset.size;
            document.querySelectorAll('.size-btn').forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // ---------- Undo ----------
    document.getElementById('btnUndo').addEventListener('click', () => {
        const last = placed.pop();
        if (!last) return;
        if (last.type === 'vector-batch' || last.type === 'stamp-batch') {
            last.elements.forEach(el => el.remove());
        } else if (last.type === 'bg-fill' && canvasBgRect) {
            canvasBgRect.setAttribute('fill', last.previousFill);
        } else if (last.type === 'image-fill' && last.previousState && imageFillCtx) {
            imageFillCtx.putImageData(last.previousState, 0, 0);
            if (imageFillImgEl) {
                imageFillImgEl.setAttribute('href', imageFillCanvas.toDataURL('image/png'));
            }
        } else if (last.remove) {
            last.remove();
        }
        updateHint();
    });

    // ---------- Clear ----------
    document.getElementById('btnClear').addEventListener('click', () => {
        if (vectorFillLayer) vectorFillLayer.innerHTML = '';
        if (canvasBgRect) canvasBgRect.setAttribute('fill', 'url(#floorGradient)');
        if (imageFillCtx) {
            imageFillCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
            if (imageFillImgEl) {
                imageFillImgEl.setAttribute('href', '');
                vectorFillLayer.appendChild(imageFillImgEl);
            }
        }
        petalLayer.innerHTML = '';
        regionCache.clear();
        placed = [];
        updateHint();
    });

    // ---------- Download as PNG ----------
    document.getElementById('btnDownload').addEventListener('click', () => {
        generatePNG((blob) => {
            triggerDownload(blob, 'my-onam-pookalam.png');
        });
    });

    // ====================================================
    // SHARING & COMMUNITY GALLERY
    // ====================================================
    const sharePanel = document.getElementById('sharePanel');
    const shareHint = document.getElementById('shareHint');

    const PROJECT_URL = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '') + '/index.html';
    const SHARE_TEXT = 'I just designed a festive Onam Pookalam! 🌸🪔 Create yours too:';

    const btnShare = document.getElementById('btnShare');
    if (btnShare) {
        btnShare.addEventListener('click', () => {
            if (!sharePanel) return;
            sharePanel.hidden = !sharePanel.hidden;
            if (!sharePanel.hidden && shareHint) {
                shareHint.textContent = '';
                sharePanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    }

    function generatePNG(callback) {
        try {
            const wasHidden = guideLayer.style.display;
            guideLayer.style.display = 'none';

            const svgClone = svg.cloneNode(true);
            svgClone.setAttribute('width', '400');
            svgClone.setAttribute('height', '400');

            const styleEl = document.createElementNS(NS, 'style');
            styleEl.textContent = `
                .pookalam-segment { fill: none !important; stroke: #2a1608 !important; stroke-width: 1.8px !important; }
                .vector-segment-fill { }
            `;
            svgClone.insertBefore(styleEl, svgClone.firstChild);

            svgClone.querySelectorAll('.symm-highlight').forEach(el => {
                el.classList.remove('symm-highlight');
                el.setAttribute('fill', 'none');
                el.setAttribute('stroke', '#2a1608');
                el.setAttribute('stroke-width', '1.8');
            });

            const serializer = new XMLSerializer();
            const svgString = serializer.serializeToString(svgClone);
            guideLayer.style.display = wasHidden;

            const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);
            const img = new Image();

            img.onload = function () {
                const canvas = document.createElement('canvas');
                canvas.width = 800;
                canvas.height = 800;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, 800, 800);
                URL.revokeObjectURL(url);
                canvas.toBlob(callback, 'image/png');
            };

            img.onerror = function () {
                URL.revokeObjectURL(url);
                if (shareHint) shareHint.textContent = 'Notice: Could not render image preview.';
            };

            img.src = url;
        } catch (err) {
            console.error('PNG export error:', err);
            if (shareHint) shareHint.textContent = 'Could not generate image. Please try again.';
        }
    }

    function triggerDownload(blob, filename) {
        if (!blob) return;
        const link = document.createElement('a');
        link.download = filename;
        link.href = URL.createObjectURL(blob);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    }

    // Publish to Community Gallery Modal
    const shareGalleryBtn = document.getElementById('shareGallery');
    const galleryPublishModal = document.getElementById('galleryPublishModal');
    const modalPreviewImg = document.getElementById('modalPreviewImg');
    const publishGalleryForm = document.getElementById('publishGalleryForm');
    const creatorNameInput = document.getElementById('creatorNameInput');
    const creatorMsgInput = document.getElementById('creatorMsgInput');
    const btnCancelPublish = document.getElementById('btnCancelPublish');

    let currentPublishDataUrl = null;

    if (shareGalleryBtn) {
        shareGalleryBtn.addEventListener('click', () => {
            generatePNG((blob) => {
                if (!blob) return;
                const reader = new FileReader();
                reader.onload = function (e) {
                    currentPublishDataUrl = e.target.result;
                    if (modalPreviewImg) modalPreviewImg.src = currentPublishDataUrl;
                    if (galleryPublishModal) {
                        galleryPublishModal.hidden = false;
                        galleryPublishModal.classList.add('show');
                        if (creatorNameInput) creatorNameInput.focus();
                    }
                };
                reader.readAsDataURL(blob);
            });
        });
    }

    if (btnCancelPublish) {
        btnCancelPublish.addEventListener('click', () => {
            if (galleryPublishModal) {
                galleryPublishModal.hidden = true;
                galleryPublishModal.classList.remove('show');
            }
        });
    }

    if (publishGalleryForm) {
        publishGalleryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const creatorName = (creatorNameInput ? creatorNameInput.value.trim() : '') || 'Pookalam Artist';
            const creatorMsg = (creatorMsgInput ? creatorMsgInput.value.trim() : '') || 'Happy Onam! 🌸';

            if (!currentPublishDataUrl) {
                alert('Pookalam image is still processing. Please try again in a moment.');
                return;
            }

            const newEntry = {
                id: 'community-' + Date.now(),
                title: `${creatorName}'s Pookalam`,
                creator: creatorName,
                city: creatorMsg,
                date: 'Just now',
                img: currentPublishDataUrl,
                likes: 1
            };

            try {
                const STORAGE_KEY = 'pookalam_community_gallery';
                const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
                existing.unshift(newEntry);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
            } catch (err) {
                console.error('Failed to save to gallery localStorage:', err);
            }

            if (galleryPublishModal) {
                galleryPublishModal.hidden = true;
                galleryPublishModal.classList.remove('show');
            }

            if (shareHint) {
                shareHint.textContent = '🎉 Published to Community Gallery! Opening Gallery…';
            }

            setTimeout(() => {
                window.location.href = 'gallery.html';
            }, 1000);
        });
    }

    // WhatsApp Share
    const shareWhatsappBtn = document.getElementById('shareWhatsapp');
    if (shareWhatsappBtn) {
        shareWhatsappBtn.addEventListener('click', () => {
            const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(SHARE_TEXT + ' ' + PROJECT_URL)}`;
            window.open(waUrl, '_blank', 'noopener,noreferrer');
            generatePNG((blob) => {
                triggerDownload(blob, 'my-onam-pookalam.png');
                if (shareHint) shareHint.textContent = '✅ WhatsApp opened & Pookalam image downloaded to share with family!';
            });
        });
    }

    // Twitter / X Share
    const shareTwitterBtn = document.getElementById('shareTwitter');
    if (shareTwitterBtn) {
        shareTwitterBtn.addEventListener('click', () => {
            const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT + ' #Onam #Pookalam #Kerala')}&url=${encodeURIComponent(PROJECT_URL)}`;
            window.open(tweetUrl, '_blank', 'noopener,noreferrer');
            generatePNG((blob) => {
                triggerDownload(blob, 'my-onam-pookalam.png');
                if (shareHint) shareHint.textContent = '✅ Twitter opened & Pookalam image downloaded to attach!';
            });
        });
    }

    // Copy Website Link
    const shareCopyBtn = document.getElementById('shareCopyLink');
    if (shareCopyBtn) {
        shareCopyBtn.addEventListener('click', async () => {
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(PROJECT_URL);
                } else {
                    const tempInput = document.createElement('input');
                    tempInput.value = PROJECT_URL;
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    document.execCommand('copy');
                    document.body.removeChild(tempInput);
                }
                if (shareHint) shareHint.textContent = '📋 Link copied to clipboard!';
            } catch (err) {
                if (shareHint) shareHint.textContent = 'Link: ' + PROJECT_URL;
            }
        });
    }
})();