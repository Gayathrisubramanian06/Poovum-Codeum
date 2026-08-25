// ============================================
// Onam Pookalam Designer — Design Page Logic
// Step 1: pick a shape template
// Step 1.5: pick a sub-template or upload custom
// Step 2: stamp flower petals onto the canvas
//
// Region detection uses canvas flood-fill:
//   - Template image is drawn to a hidden canvas
//   - Dark pixels (luminance < BORDER_THRESHOLD) = borders
//   - Flood fill from click → detects bounded region
//   - Region mask applied as SVG <mask> to clip flowers
// ============================================

(function () {
    const templateStep       = document.getElementById('templateStep');
    const subTemplateStep    = document.getElementById('subTemplateStep');
    const predefinedTemplates = document.getElementById('predefinedTemplates');
    const customTemplateUpload = document.getElementById('customTemplateUpload');
    const templateFileInput  = document.getElementById('templateFileInput');
    const canvasStep         = document.getElementById('canvasStep');
    const pageTitle          = document.getElementById('pageTitle');
    const btnBack            = document.getElementById('btnBack');
    const canvasHint         = document.getElementById('canvasHint');

    if (!templateStep || !canvasStep) return; // not on design.html

    const svg        = document.getElementById('pookalamCanvas');
    const guideLayer = document.getElementById('guideLayer');
    const petalLayer = document.getElementById('petalLayer');

    const CENTER      = 200;
    const CIRCLE_R    = 160;
    const SQUARE_HALF = 130;
    const CANVAS_SIZE = 400;          // matches SVG viewBox
    const BORDER_THRESHOLD = 110;     // luminance below this = border pixel (handles JPEG blur)
    const MAX_REGION_RATIO = 0.82;    // flood fills larger than this fraction = background

    const SIZES = { small: 16, medium: 26, large: 38 };

    // ====================================================
    // TRADITIONAL ONAM FLOWERS & MAIN COMMON COLORS
    // ====================================================
    const ONAM_FLOWERS = [
        {
            id: 'thumba',
            nameEn: 'Thumba',
            nameMl: 'തുമ്പ',
            icon: '🌿',
            description: 'Sacred white Onam flower',
            varieties: [
                { name: 'Pure White',      hex: '#ffffff', center: '#16a34a', border: '#cbd5e1' }
            ]
        },
        {
            id: 'thechi',
            nameEn: 'Thechi',
            nameMl: 'തെച്ചി',
            icon: '🌺',
            description: 'Vibrant 4-petal Ixora flower',
            varieties: [
                { name: 'Scarlet Red',     hex: '#dc2626', center: '#fca5a5', border: '#991b1b' },
                { name: 'Golden Yellow',   hex: '#facc15', center: '#854d0e', border: '#ca8a04' },
                { name: 'Coral Orange',    hex: '#ea580c', center: '#fed7aa', border: '#9a3412' }
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
                { name: 'Warm Orange',     hex: '#f97316', center: '#c2410c', border: '#7c2d12' },
                { name: 'Pure White',      hex: '#ffffff', center: '#facc15', border: '#cbd5e1' }
            ]
        },
        {
            id: 'rose',
            nameEn: 'Rose',
            nameMl: 'റോസ് / പനിനീർ',
            icon: '🌹',
            description: 'Layered fragrant Rose petals',
            varieties: [
                { name: 'Rose Red',        hex: '#e11d48', center: '#881337', border: '#9f1239' },
                { name: 'Paneer Pink',     hex: '#f472b6', center: '#be185d', border: '#db2777' }
            ]
        },
        {
            id: 'marigold',
            nameEn: 'Marigold',
            nameMl: 'ചെണ്ടുമല്ലി',
            icon: '🏵️',
            description: 'Ruffled festive Tagetes pom-pom',
            varieties: [
                { name: 'Bright Orange',   hex: '#f97316', center: '#9a3412', border: '#c2410c' },
                { name: 'Golden Yellow',   hex: '#eab308', center: '#854d0e', border: '#ca8a04' }
            ]
        },
        {
            id: 'lotus',
            nameEn: 'Lotus',
            nameMl: 'താമര',
            icon: '🪷',
            description: 'Sacred pointed Lotus petals',
            varieties: [
                { name: 'Lotus Pink',      hex: '#fb7185', center: '#facc15', border: '#e11d48' },
                { name: 'Sacred White',    hex: '#ffffff', center: '#facc15', border: '#cbd5e1' }
            ]
        },
        {
            id: 'chembarathi',
            nameEn: 'Chembarathi',
            nameMl: 'ചെമ്പരത്തി',
            icon: '🌺',
            description: 'Classic 5-petal flared Hibiscus',
            varieties: [
                { name: 'Crimson Red',     hex: '#dc2626', center: '#7f1d1d', border: '#991b1b', stamen: '#fbbf24' },
                { name: 'Bright Pink',     hex: '#ec4899', center: '#831843', border: '#be185d', stamen: '#fde047' }
            ]
        }
    ];

    let currentFlower = ONAM_FLOWERS[4]; // Default: Marigold
    let currentColor  = ONAM_FLOWERS[4].varieties[0]; // Default: Golden Orange

    const PREDEFINED_TEMPLATES = {
        circle: [
            { id: 'c1',  name: 'Floral Star',      img: 'assets/images/circle-1.jpg' },
            { id: 'c2',  name: 'Geometric Star',    img: 'assets/images/circle-2.jpg' },
            { id: 'c3',  name: 'Scalloped Mandala', img: 'assets/images/circle-3.jpg' },
            { id: 'c4',  name: 'Diamond Burst',     img: 'assets/images/circle-4.jpg' },
            { id: 'c5',  name: 'Classic Ring',      img: 'assets/images/circle-5.jpg' },
            { id: 'c6',  name: 'Sunburst',          img: 'assets/images/circle-6.jpg' },
            { id: 'c7',  name: 'Petal Wave',        img: 'assets/images/circle-7.jpg' },
            { id: 'c8',  name: 'Lotus Bloom',       img: 'assets/images/circle-8.jpg' },
            { id: 'c9',  name: 'Intricate Web',     img: 'assets/images/circle-9.jpg' },
            { id: 'c10', name: 'Royal Core',        img: 'assets/images/circle-10.jpg' },
            { id: 'c11', name: 'Spiral Bloom',      img: 'assets/images/circle-11.jpg' },
            { id: 'c12', name: 'Radiant Petals',    img: 'assets/images/circle-12.jpg' },
            { id: 'c13', name: 'Layered Lotus',     img: 'assets/images/circle-13.jpg' },
            { id: 'c14', name: 'Peacock Wheel',     img: 'assets/images/circle-14.jpg' },
            { id: 'c15', name: 'Star Weave',        img: 'assets/images/circle-15.jpg' },
            { id: 'c16', name: 'Floral Mandala',    img: 'assets/images/circle-16.jpg' },
            { id: 'c17', name: 'Concentric Bloom',  img: 'assets/images/circle-17.jpg' },
            { id: 'c18', name: 'Heritage Pattern',  img: 'assets/images/circle-18.jpg' },
            { id: 'c19', name: 'Petal Crown',       img: 'assets/images/circle-19.jpg' },
            { id: 'c20', name: 'Grand Sunflower',   img: 'assets/images/circle-20.jpg' },
            { id: 'c21', name: 'Festival Ring',     img: 'assets/images/circle-21.jpg' }
        ],
        square: [
            { id: 's1', name: 'Grid',     img: null, svg: '<rect x="70" y="70" width="260" height="260" rx="10" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="2"/><line x1="200" y1="70" x2="200" y2="330" stroke="rgba(0,0,0,0.15)" stroke-width="2"/><line x1="70" y1="200" x2="330" y2="200" stroke="rgba(0,0,0,0.15)" stroke-width="2"/>' },
            { id: 's2', name: 'Diagonal', img: null, svg: '<rect x="70" y="70" width="260" height="260" rx="10" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="2"/><line x1="70" y1="70" x2="330" y2="330" stroke="rgba(0,0,0,0.15)" stroke-width="2"/><line x1="330" y1="70" x2="70" y2="330" stroke="rgba(0,0,0,0.15)" stroke-width="2"/>' }
        ]
    };

    let currentSubTemplate = null;
    let currentTemplateSrc = null; // image src for pixel analysis
    let currentSizeKey     = 'medium';
    let placed             = []; // stack of elements for undo

    const NS = 'http://www.w3.org/2000/svg';

    // ====================================================
    // REGION DETECTION STATE
    // ====================================================
    let isImageTemplate    = false;
    let templateReady      = false;
    let templateCtx        = null;          // offscreen canvas context for pixel reads
    let accumulatedMask    = null;          // Uint8Array — union of all clicked regions
    let accumulatedCanvas  = null;          // canvas used to convert mask → data URL
    let svgMaskEl          = null;          // <mask> element in SVG defs
    let svgMaskImgEl       = null;          // <image> inside the mask
    let regionGroup        = null;          // <g mask="url(#regionMask)"> inside petalLayer
    let regionCache        = new Map();     // "x,y" → Uint8Array mask (performance cache)

    // ------ Initialise region detection for a given image src ------
    function initRegionDetection(imgSrc) {
        isImageTemplate   = true;
        templateReady     = false;
        regionCache.clear();
        accumulatedMask   = new Uint8Array(CANVAS_SIZE * CANVAS_SIZE);
        accumulatedCanvas = document.createElement('canvas');
        accumulatedCanvas.width  = CANVAS_SIZE;
        accumulatedCanvas.height = CANVAS_SIZE;

        // Draw template to offscreen canvas for pixel sampling
        const offscreen = document.createElement('canvas');
        offscreen.width  = CANVAS_SIZE;
        offscreen.height = CANVAS_SIZE;
        templateCtx = offscreen.getContext('2d', { willReadFrequently: true });

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            templateCtx.drawImage(img, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
            templateReady = true;
            updateHint();
        };
        img.onerror = () => { isImageTemplate = false; };
        img.src = imgSrc;

        // Build the SVG <mask> and masked <g> group
        setupSVGMask();
    }

    function setupSVGMask() {
        // Clean up any previous mask
        const old = document.getElementById('regionMask');
        if (old) old.remove();
        if (regionGroup) { regionGroup.remove(); regionGroup = null; }

        const defs = svg.querySelector('defs');

        svgMaskEl = document.createElementNS(NS, 'mask');
        svgMaskEl.setAttribute('id', 'regionMask');

        svgMaskImgEl = document.createElementNS(NS, 'image');
        svgMaskImgEl.setAttribute('x', '0');
        svgMaskImgEl.setAttribute('y', '0');
        svgMaskImgEl.setAttribute('width',  String(CANVAS_SIZE));
        svgMaskImgEl.setAttribute('height', String(CANVAS_SIZE));
        svgMaskEl.appendChild(svgMaskImgEl);
        defs.appendChild(svgMaskEl);

        regionGroup = document.createElementNS(NS, 'g');
        regionGroup.setAttribute('mask', 'url(#regionMask)');
        petalLayer.appendChild(regionGroup);
    }

    // ------ Flood fill: returns a Uint8Array mask or null if on border / too large ------
    function floodFillRegion(svgX, svgY) {
        const startX = Math.round(svgX);
        const startY = Math.round(svgY);
        if (startX < 0 || startX >= CANVAS_SIZE || startY < 0 || startY >= CANVAS_SIZE) return null;

        // Return cached result if available
        const key = `${startX},${startY}`;
        if (regionCache.has(key)) return regionCache.get(key);

        const imgData = templateCtx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        const px      = imgData.data; // flat RGBA array
        const total   = CANVAS_SIZE * CANVAS_SIZE;

        // Luminance of pixel at flat index p
        function lum(p) {
            const i = p * 4;
            return 0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2];
        }

        const startPos = startY * CANVAS_SIZE + startX;
        if (lum(startPos) < BORDER_THRESHOLD) return null; // clicked on a border line

        const mask    = new Uint8Array(total);
        const visited = new Uint8Array(total);
        // Use a typed stack for performance (avoid shift/unshift on large arrays)
        const stack   = new Int32Array(total);
        let   stackTop = 0;
        stack[stackTop++] = startPos;

        let pixelCount  = 0;
        let touchedEdge = false;

        while (stackTop > 0) {
            const pos = stack[--stackTop];
            if (visited[pos]) continue;
            visited[pos] = 1;
            if (lum(pos) < BORDER_THRESHOLD) continue;

            mask[pos] = 1;
            pixelCount++;

            const x = pos % CANVAS_SIZE;
            const y = Math.floor(pos / CANVAS_SIZE);

            if (x === 0 || x === CANVAS_SIZE - 1 || y === 0 || y === CANVAS_SIZE - 1) {
                touchedEdge = true;
            }

            // Bail out early if region is suspiciously large (outer background)
            if (pixelCount > total * MAX_REGION_RATIO) return null;

            if (x > 0)               stack[stackTop++] = pos - 1;
            if (x < CANVAS_SIZE - 1) stack[stackTop++] = pos + 1;
            if (y > 0)               stack[stackTop++] = pos - CANVAS_SIZE;
            if (y < CANVAS_SIZE - 1) stack[stackTop++] = pos + CANVAS_SIZE;
        }

        // Large region touching the edge = outer background
        if (touchedEdge && pixelCount > total * 0.25) return null;

        regionCache.set(key, mask);
        return mask;
    }

    // ------ Union this region into the accumulated mask and refresh the SVG mask ------
    function commitRegion(regionMask) {
        for (let i = 0; i < regionMask.length; i++) {
            if (regionMask[i]) accumulatedMask[i] = 1;
        }
        const ctx    = accumulatedCanvas.getContext('2d');
        const imgOut = ctx.createImageData(CANVAS_SIZE, CANVAS_SIZE);
        const d      = imgOut.data;
        for (let i = 0; i < accumulatedMask.length; i++) {
            const idx = i * 4;
            const v   = accumulatedMask[i] ? 255 : 0;
            d[idx] = v;  d[idx + 1] = v;  d[idx + 2] = v;  d[idx + 3] = 255;
        }
        ctx.putImageData(imgOut, 0, 0);
        svgMaskImgEl.setAttribute('href', accumulatedCanvas.toDataURL('image/png'));
    }

    // ------ Clean up all region state (called when leaving canvas step) ------
    function clearRegionState() {
        isImageTemplate = false;
        templateReady   = false;
        templateCtx     = null;
        accumulatedMask = null;
        accumulatedCanvas = null;
        regionCache.clear();
        currentTemplateSrc = null;
        const old = document.getElementById('regionMask');
        if (old) old.remove();
        if (regionGroup) { regionGroup.remove(); regionGroup = null; }
        svgMaskEl    = null;
        svgMaskImgEl = null;
    }

    const vectorFillLayer   = document.getElementById('vectorFillLayer');
    const vectorBorderLayer = document.getElementById('vectorBorderLayer');
    const btnSymmetry       = document.getElementById('btnSymmetry');
    let isSymmetryActive    = true;
    let currentVectorTpl    = null; // ID of active vector template

    if (btnSymmetry) {
        btnSymmetry.addEventListener('click', () => {
            isSymmetryActive = !isSymmetryActive;
            btnSymmetry.classList.toggle('active', isSymmetryActive);
            btnSymmetry.textContent = isSymmetryActive ? '✨ On (Mandala)' : 'Off (Single)';
            updateHint();
        });
    }

    // ====================================================
    // INTERACTIVE VECTOR MANDALA TEMPLATES (100% Leak-Proof)
    // ====================================================
    const VECTOR_TEMPLATES = [
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
        }
    ];

    // ---------- Geometric SVG Segment Math Helpers ----------

    function createSegmentElement(dPath, groupKey) {
        const path = document.createElementNS(NS, 'path');
        path.setAttribute('d', dPath);
        path.setAttribute('class', 'pookalam-segment');
        path.setAttribute('data-group', groupKey);

        // Interactive hover highlight (mandala symmetry)
        path.addEventListener('mouseenter', () => {
            if (isSymmetryActive) {
                const sameGroup = vectorBorderLayer.querySelectorAll(`.pookalam-segment[data-group="${groupKey}"]`);
                sameGroup.forEach(el => el.classList.add('symm-highlight'));
            }
        });

        path.addEventListener('mouseleave', () => {
            const allHighlighted = vectorBorderLayer.querySelectorAll('.symm-highlight');
            allHighlighted.forEach(el => el.classList.remove('symm-highlight'));
        });

        // Click to fill
        path.addEventListener('click', (e) => {
            e.stopPropagation();
            fillVectorSegment(path, groupKey);
        });

        return path;
    }

    function addCircleSegment(layer, cx, cy, r, groupKey) {
        const d = `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx} ${cy + r} A ${r} ${r} 0 1 1 ${cx} ${cy - r} Z`;
        const seg = createSegmentElement(d, groupKey);
        layer.appendChild(seg);
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
        const seg = createSegmentElement(d, groupKey);
        layer.appendChild(seg);
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
        const seg = createSegmentElement(d, groupKey);
        layer.appendChild(seg);
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
        const seg = createSegmentElement(d, groupKey);
        layer.appendChild(seg);
    }

    // ---------- 1. Sacred Lotus Mandala Builder ----------
    function buildLotusMandala(layer) {
        // Center Bindu
        addCircleSegment(layer, CENTER, CENTER, 24, 'lotus-center');

        // Inner 8-Petal Ring
        for (let i = 0; i < 8; i++) {
            addPetalSegment(layer, CENTER, CENTER, 24, i * 45, 45, 24, 'lotus-inner-8');
        }

        // Mid 8-Pointed Lotus Petals
        for (let i = 0; i < 8; i++) {
            addPetalSegment(layer, CENTER, CENTER, 65, i * 45 + 22.5, 60, 36, 'lotus-mid-8');
        }

        // Concentric Annular Ring 1 (16 Segments)
        for (let i = 0; i < 16; i++) {
            addAnnularArcSegment(layer, CENTER, CENTER, 120, 155, i * 22.5, (i + 1) * 22.5, 'lotus-ring-16');
        }

        // Outer Scallop Shells (16 Segments)
        for (let i = 0; i < 16; i++) {
            addPetalSegment(layer, CENTER, CENTER, 155, i * 22.5 + 11.25, 38, 28, 'lotus-scallop-16');
        }
    }

    // ---------- 2. Sunburst 12-Ray Mandala Builder ----------
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

    // ---------- 3. Peacock Wheel Mandala Builder ----------
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

    // ---------- 4. Diamond Star Mandala Builder ----------
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

    // ---------- 5. Concentric Bloom Mandala Builder ----------
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

    // ---------- 6. Heritage 8-Petal Mandala Builder ----------
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

    // ---------- Vector Segment Filling Handler ----------
    function fillVectorSegment(targetPath, groupKey) {
        const segmentsToFill = isSymmetryActive && groupKey
            ? Array.from(vectorBorderLayer.querySelectorAll(`.pookalam-segment[data-group="${groupKey}"]`))
            : [targetPath];

        const batchAction = [];

        segmentsToFill.forEach(seg => {
            const d = seg.getAttribute('d');
            const fillGroup = document.createElementNS(NS, 'g');
            fillGroup.setAttribute('class', 'vector-segment-fill');

            // 1. Exact base path fill in flower color
            const pathFill = document.createElementNS(NS, 'path');
            pathFill.setAttribute('d', d);
            pathFill.setAttribute('fill', currentColor.hex);
            pathFill.setAttribute('stroke', currentColor.border || 'none');
            pathFill.setAttribute('stroke-width', '0.5');
            fillGroup.appendChild(pathFill);

            // 2. If in Cut Petals Mode: add authentic shredded petal flakes inside the shape
            if (currentFlowerForm === 'cut') {
                const bbox = seg.getBBox();
                const step = 8;
                for (let py = bbox.y; py <= bbox.y + bbox.height; py += step) {
                    for (let px = bbox.x; px <= bbox.x + bbox.width; px += step) {
                        const jx = px + (Math.random() - 0.5) * (step * 0.8);
                        const jy = py + (Math.random() - 0.5) * (step * 0.8);

                        // Check if point is inside the shape
                        const pt = svg.createSVGPoint();
                        pt.x = jx;
                        pt.y = jy;

                        if (seg.isPointInFill ? seg.isPointInFill(pt) : true) {
                            const flake = document.createElementNS(NS, 'path');
                            const w = 3.5 + Math.random() * 2.5;
                            const h = 7.0 + Math.random() * 4.0;
                            const rot = Math.random() * 360;

                            const flakeD = `M ${jx} ${jy} Q ${jx - w} ${jy - h * 0.5} ${jx} ${jy - h} Q ${jx + w * 0.8} ${jy - h * 0.5} ${jx} ${jy} Z`;
                            flake.setAttribute('d', flakeD);
                            flake.setAttribute('fill', currentColor.hex);
                            flake.setAttribute('stroke', currentColor.border || 'rgba(0,0,0,0.12)');
                            flake.setAttribute('stroke-width', '0.4');
                            flake.setAttribute('opacity', (0.85 + Math.random() * 0.15).toFixed(2));
                            flake.setAttribute('transform', `rotate(${rot} ${jx} ${jy})`);
                            fillGroup.appendChild(flake);
                        }
                    }
                }
            } else {
                // Whole flower mode: stamp flower in center of segment
                const bbox = seg.getBBox();
                const size = SIZES[currentSizeKey];
                const cx = bbox.x + bbox.width / 2;
                const cy = bbox.y + bbox.height / 2;
                const flower = createFlower(cx, cy, currentFlower, currentColor, size);
                fillGroup.appendChild(flower);
            }

            vectorFillLayer.appendChild(fillGroup);
            batchAction.push(fillGroup);
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
    // STEP NAVIGATION
    // ====================================================
    function goToHome() {
        canvasStep.hidden = true;
        if (subTemplateStep) subTemplateStep.hidden = true;
        templateStep.hidden = false;
        btnBack.hidden = true;
        pageTitle.textContent = 'Design Your Pookalam';
        clearRegionState();
        if (vectorFillLayer) vectorFillLayer.innerHTML = '';
        if (vectorBorderLayer) vectorBorderLayer.innerHTML = '';
        petalLayer.innerHTML = '';
        placed = [];
    }

    function goToBrowseTemplates() {
        templateStep.hidden = true;
        canvasStep.hidden   = true;
        if (subTemplateStep) subTemplateStep.hidden = false;
        btnBack.hidden = false;
        pageTitle.textContent = 'Pick a Design';

        const subTitle    = document.getElementById('subTemplateTitle');
        const subSubtitle = document.getElementById('subTemplateSubtitle');
        if (subTitle)    subTitle.textContent    = 'Pick a design';
        if (subSubtitle) subSubtitle.textContent = 'Select an interactive mandala layout or classic outline to start.';

        predefinedTemplates.hidden    = false;
        customTemplateUpload.hidden   = true;

        predefinedTemplates.innerHTML = '';

        // 1. Render Interactive Vector Mandalas (Instant Border Snapping + Symmetry)
        VECTOR_TEMPLATES.forEach(tpl => {
            const btn = document.createElement('button');
            btn.className = 'template-card vector-card';

            // Generate mini vector preview
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
            predefinedTemplates.appendChild(btn);
        });

        // 2. Also render the 21 classic photo templates
        PREDEFINED_TEMPLATES.circle.forEach(tpl => {
            const btn = document.createElement('button');
            btn.className = 'template-card';
            btn.innerHTML = `<img src="${tpl.img}" alt="${tpl.name}" loading="lazy" />`;
            btn.addEventListener('click', () => {
                currentVectorTpl = null;
                currentTemplateSrc = tpl.img;
                currentSubTemplate = `<image href="${tpl.img}" x="0" y="0" width="400" height="400" opacity="0.3" preserveAspectRatio="xMidYMid meet" />`;
                goToCanvas();
            });
            predefinedTemplates.appendChild(btn);
        });
    }

    function goToUploadOwn() {
        templateStep.hidden = true;
        canvasStep.hidden   = true;
        if (subTemplateStep) subTemplateStep.hidden = false;
        btnBack.hidden = false;
        pageTitle.textContent = 'Upload Your Template';

        predefinedTemplates.innerHTML = '';
        predefinedTemplates.hidden    = true;
        customTemplateUpload.hidden   = false;

        const subTitle    = document.getElementById('subTemplateTitle');
        const subSubtitle = document.getElementById('subTemplateSubtitle');
        if (subTitle)    subTitle.textContent    = 'Upload Your Own';
        if (subSubtitle) subSubtitle.textContent = 'Use your own image as a tracing guide.';
    }

    function goToCanvas() {
        if (subTemplateStep) subTemplateStep.hidden = true;
        templateStep.hidden = true;
        canvasStep.hidden   = false;
        btnBack.hidden      = false;
        pageTitle.textContent = 'Design Your Pookalam';

        // Reset canvas content
        clearRegionState();
        if (vectorFillLayer) vectorFillLayer.innerHTML = '';
        if (!currentVectorTpl && vectorBorderLayer) vectorBorderLayer.innerHTML = '';
        petalLayer.innerHTML = '';
        placed = [];

        // Initialise image region detection if a photo template was chosen
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
                currentTemplateSrc = event.target.result; // data URL
                currentSubTemplate = `<image href="${event.target.result}" x="0" y="0" width="400" height="400" opacity="0.3" preserveAspectRatio="xMidYMid meet" />`;
                goToCanvas();
            };
            reader.readAsDataURL(file);
        });
    }

    if (btnBack) {
        btnBack.addEventListener('click', () => {
            if (!canvasStep.hidden) {
                goToBrowseTemplates();
            } else if (subTemplateStep && !subTemplateStep.hidden) {
                goToHome();
            }
        });
    }

    function updateHint() {
        if (isImageTemplate) {
            if (templateReady) {
                if (currentFlowerForm === 'cut') {
                    canvasHint.textContent = `✂️ Cut Petals Mode: Click inside any bordered shape to fill it with ${currentColor.name} ${currentFlower.nameEn} petals!`;
                } else {
                    canvasHint.textContent = `🌸 Whole Flower Mode: Click anywhere to place a complete ${currentFlower.nameEn} bloom.`;
                }
            } else {
                canvasHint.textContent = 'Loading template borders… please wait.';
            }
        } else if (currentSubTemplate) {
            canvasHint.textContent = 'Tap on the design to place a flower.';
        } else {
            canvasHint.textContent = "Tap anywhere to place a flower — no boundary, it's your design.";
        }
    }

    // ---------- Guide outline ----------
    function drawGuide() {
        guideLayer.innerHTML = '';
        if (currentSubTemplate) {
            guideLayer.innerHTML = currentSubTemplate;
        }
    }

    // ---------- Flower Sidebar & Variety Selection ----------
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

            // Card Header
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

            // Swatches Grid
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

                    // Update UI selection states
                    document.querySelectorAll('.flower-category-card').forEach(c => c.classList.remove('selected'));
                    card.classList.add('selected');

                    document.querySelectorAll('.flower-swatch-item').forEach(s => s.classList.remove('active'));
                    swatchBtn.classList.add('active');

                    updateActiveFlowerDisplay();
                });

                swatchesGrid.appendChild(swatchBtn);
            });

            card.appendChild(swatchesGrid);
            flowerCategoriesEl.appendChild(card);
        });

        updateActiveFlowerDisplay();
    }

    buildFlowerSidebar();

    // ---------- Flower Form (Whole vs Cut Petals) ----------
    let currentFlowerForm = 'cut'; // default: 'cut' (fill shape) or 'whole' (stamp flower)

    document.querySelectorAll('.form-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            currentFlowerForm = btn.dataset.form;
            document.querySelectorAll('.form-btn').forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
            updateHint();
        });
    });

    // ---------- Size buttons ----------
    document.querySelectorAll('.size-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            currentSizeKey = btn.dataset.size;
            document.querySelectorAll('.size-btn').forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // ====================================================
    // SPECIALIZED ONAM FLOWER SVG GENERATORS
    // ====================================================

    function createFlower(cx, cy, flowerObj, colorObj, size) {
        const flowerType = flowerObj ? flowerObj.id : (currentFlower ? currentFlower.id : 'marigold');
        const color = colorObj || currentColor;
        const g = document.createElementNS(NS, 'g');

        // Check if user selected Cut Petals (Shredded) or Whole Flower
        if (currentFlowerForm === 'cut') {
            return drawCutPetals(g, cx, cy, flowerType, color, size);
        }

        const randomRot = Math.random() * 360;
        g.setAttribute('transform', `rotate(${randomRot} ${cx} ${cy})`);

        switch (flowerType) {
            case 'thumba':
                return drawThumbaFlower(g, cx, cy, color, size);
            case 'thechi':
                return drawThechiFlower(g, cx, cy, color, size);
            case 'jamanthi':
                return drawJamanthiFlower(g, cx, cy, color, size);
            case 'rose':
                return drawRoseFlower(g, cx, cy, color, size);
            case 'lotus':
                return drawLotusFlower(g, cx, cy, color, size);
            case 'chembarathi':
                return drawChembarathiFlower(g, cx, cy, color, size);
            case 'marigold':
            default:
                return drawMarigoldFlower(g, cx, cy, color, size);
        }
    }

    // ====================================================
    // REGION SHAPE FILLER (Cut / Shredded Petals)
    // Fills an entire detected bordered shape with realistic shredded petals
    // ====================================================

    function fillRegionWithCutPetals(regionMask, flowerObj, colorObj) {
        const flowerType = flowerObj ? flowerObj.id : (currentFlower ? currentFlower.id : 'marigold');
        const color = colorObj || currentColor;
        const group = document.createElementNS(NS, 'g');
        group.setAttribute('class', 'shape-petal-fill');

        // 1. Base floral wash layer over the region
        const baseWash = document.createElementNS(NS, 'rect');
        baseWash.setAttribute('x', '0');
        baseWash.setAttribute('y', '0');
        baseWash.setAttribute('width',  String(CANVAS_SIZE));
        baseWash.setAttribute('height', String(CANVAS_SIZE));
        baseWash.setAttribute('fill', color.hex);
        baseWash.setAttribute('opacity', '0.68');
        group.appendChild(baseWash);

        // 2. Compute bounding box of this region
        let minX = CANVAS_SIZE, maxX = 0, minY = CANVAS_SIZE, maxY = 0;
        for (let y = 0; y < CANVAS_SIZE; y++) {
            const rowOffset = y * CANVAS_SIZE;
            for (let x = 0; x < CANVAS_SIZE; x++) {
                if (regionMask[rowOffset + x]) {
                    if (x < minX) minX = x;
                    if (x > maxX) maxX = x;
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;
                }
            }
        }

        // 3. Dense scatter of individual cut petal flakes across the shape interior
        const step = 8; // Dense 8px grid for rich, seamless physical petal coverage
        for (let py = minY; py <= maxY; py += step) {
            for (let px = minX; px <= maxX; px += step) {
                // Organic jitter
                const jx = Math.round(px + (Math.random() - 0.5) * (step * 0.9));
                const jy = Math.round(py + (Math.random() - 0.5) * (step * 0.9));

                if (jx >= 0 && jx < CANVAS_SIZE && jy >= 0 && jy < CANVAS_SIZE) {
                    if (regionMask[jy * CANVAS_SIZE + jx]) {
                        const rot = Math.random() * 360;
                        const flake = document.createElementNS(NS, 'path');

                        // Shred dimensions based on flower variety
                        const w = 4.5 + Math.random() * 3.5;
                        const h = 8.5 + Math.random() * 5.5;

                        let d;
                        if (flowerType === 'thechi') {
                            // Pointed Ixora petal shred
                            d = `M ${jx} ${jy} L ${jx - w * 0.7} ${jy - h * 0.4} L ${jx} ${jy - h} L ${jx + w * 0.7} ${jy - h * 0.4} Z`;
                        } else if (flowerType === 'lotus' || flowerType === 'thumba') {
                            // Pointed lotus / delicate thumba flake
                            d = `M ${jx} ${jy} Q ${jx - w * 0.8} ${jy - h * 0.5} ${jx} ${jy - h} Q ${jx + w * 0.8} ${jy - h * 0.5} ${jx} ${jy} Z`;
                        } else {
                            // Scalloped / curved marigold, rose, jamanthi, chembarathi flake
                            d = `M ${jx} ${jy} C ${jx - w} ${jy - h * 0.3} ${jx - w * 0.8} ${jy - h * 0.8} ${jx} ${jy - h} C ${jx + w * 0.8} ${jy - h * 0.8} ${jx + w} ${jy - h * 0.3} ${jx} ${jy} Z`;
                        }

                        flake.setAttribute('d', d);
                        flake.setAttribute('fill', color.hex);
                        flake.setAttribute('stroke', color.border || 'rgba(0,0,0,0.14)');
                        flake.setAttribute('stroke-width', '0.45');
                        flake.setAttribute('opacity', (0.85 + Math.random() * 0.15).toFixed(2));
                        flake.setAttribute('transform', `rotate(${rot} ${jx} ${jy})`);
                        group.appendChild(flake);
                    }
                }
            }
        }

        return group;
    }

    // ---------- Free-Draw Cut Petal Cluster (when no template loaded) ----------
    function drawCutPetals(g, cx, cy, flowerType, color, size) {
        const flakeCount = size < 20 ? 8 : (size < 30 ? 14 : 22);
        const spread = size * 0.55;

        for (let i = 0; i < flakeCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist  = Math.random() * spread;
            const px    = cx + Math.cos(angle) * dist;
            const py    = cy + Math.sin(angle) * dist;
            const rot   = Math.random() * 360;

            const flake = document.createElementNS(NS, 'path');
            const flakeW = size * (0.18 + Math.random() * 0.12);
            const flakeH = size * (0.32 + Math.random() * 0.18);

            const d = `M ${px} ${py} Q ${px - flakeW} ${py - flakeH * 0.5} ${px} ${py - flakeH} Q ${px + flakeW * 0.8} ${py - flakeH * 0.5} ${px} ${py} Z`;
            flake.setAttribute('d', d);
            flake.setAttribute('fill', color.hex);
            flake.setAttribute('stroke', color.border || 'rgba(0,0,0,0.12)');
            flake.setAttribute('stroke-width', '0.5');
            flake.setAttribute('transform', `rotate(${rot} ${px} ${py})`);
            g.appendChild(flake);
        }
        return g;
    }

    // 1. Thumba (തുമ്പ) — delicate 4-petal starry white Onam flower with green calyx
    function drawThumbaFlower(g, cx, cy, color, size) {
        const petalCount = 4;
        for (let i = 0; i < petalCount; i++) {
            const angle = (360 / petalCount) * i;
            const p = document.createElementNS(NS, 'path');
            const d = `M ${cx} ${cy} Q ${cx - size * 0.18} ${cy - size * 0.3} ${cx} ${cy - size * 0.52} Q ${cx + size * 0.18} ${cy - size * 0.3} ${cx} ${cy} Z`;
            p.setAttribute('d', d);
            p.setAttribute('fill', color.hex);
            p.setAttribute('stroke', color.border || '#cbd5e1');
            p.setAttribute('stroke-width', '0.6');
            p.setAttribute('transform', `rotate(${angle} ${cx} ${cy})`);
            g.appendChild(p);
        }
        // Green calyx/center dot
        const calyx = document.createElementNS(NS, 'circle');
        calyx.setAttribute('cx', cx);
        calyx.setAttribute('cy', cy);
        calyx.setAttribute('r', size * 0.16);
        calyx.setAttribute('fill', color.center || '#16a34a');
        g.appendChild(calyx);
        return g;
    }

    // 2. Thechi (തെച്ചി) — 4-pointed cross star Ixora flower
    function drawThechiFlower(g, cx, cy, color, size) {
        const petalCount = 4;
        for (let i = 0; i < petalCount; i++) {
            const angle = (360 / petalCount) * i + 45;
            const p = document.createElementNS(NS, 'polygon');
            const pts = `${cx},${cy} ${cx - size * 0.22},${cy - size * 0.28} ${cx},${cy - size * 0.52} ${cx + size * 0.22},${cy - size * 0.28}`;
            p.setAttribute('points', pts);
            p.setAttribute('fill', color.hex);
            p.setAttribute('stroke', color.border || 'rgba(0,0,0,0.15)');
            p.setAttribute('stroke-width', '0.6');
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

    // 3. Jamanthi (ജമന്തി) — 12 radiating layered pom-pom petals in two tiers
    function drawJamanthiFlower(g, cx, cy, color, size) {
        // Outer tier (8 petals)
        for (let i = 0; i < 8; i++) {
            const angle = (360 / 8) * i;
            const petal = document.createElementNS(NS, 'ellipse');
            petal.setAttribute('cx', cx);
            petal.setAttribute('cy', cy - size * 0.32);
            petal.setAttribute('rx', size * 0.15);
            petal.setAttribute('ry', size * 0.34);
            petal.setAttribute('fill', color.hex);
            petal.setAttribute('stroke', color.border || 'rgba(0,0,0,0.1)');
            petal.setAttribute('stroke-width', '0.5');
            petal.setAttribute('transform', `rotate(${angle} ${cx} ${cy})`);
            g.appendChild(petal);
        }
        // Inner tier (8 petals offset)
        for (let i = 0; i < 8; i++) {
            const angle = (360 / 8) * i + 22.5;
            const petal = document.createElementNS(NS, 'ellipse');
            petal.setAttribute('cx', cx);
            petal.setAttribute('cy', cy - size * 0.22);
            petal.setAttribute('rx', size * 0.13);
            petal.setAttribute('ry', size * 0.24);
            petal.setAttribute('fill', color.hex);
            petal.setAttribute('transform', `rotate(${angle} ${cx} ${cy})`);
            g.appendChild(petal);
        }
        // Center disc
        const center = document.createElementNS(NS, 'circle');
        center.setAttribute('cx', cx);
        center.setAttribute('cy', cy);
        center.setAttribute('r', size * 0.22);
        center.setAttribute('fill', color.center || '#b45309');
        g.appendChild(center);
        return g;
    }

    // 4. Rose (റോസ് / പനിനീർ) — overlapping curved layered petals
    function drawRoseFlower(g, cx, cy, color, size) {
        // Outer petals
        for (let i = 0; i < 5; i++) {
            const angle = (360 / 5) * i;
            const petal = document.createElementNS(NS, 'path');
            const d = `M ${cx} ${cy} C ${cx - size * 0.38} ${cy - size * 0.25} ${cx - size * 0.32} ${cy - size * 0.52} ${cx} ${cy - size * 0.48} C ${cx + size * 0.32} ${cy - size * 0.52} ${cx + size * 0.38} ${cy - size * 0.25} ${cx} ${cy} Z`;
            petal.setAttribute('d', d);
            petal.setAttribute('fill', color.hex);
            petal.setAttribute('stroke', color.border || 'rgba(0,0,0,0.15)');
            petal.setAttribute('stroke-width', '0.5');
            petal.setAttribute('transform', `rotate(${angle} ${cx} ${cy})`);
            g.appendChild(petal);
        }
        // Inner spiral core
        for (let i = 0; i < 4; i++) {
            const angle = (360 / 4) * i + 36;
            const petal = document.createElementNS(NS, 'ellipse');
            petal.setAttribute('cx', cx);
            petal.setAttribute('cy', cy - size * 0.16);
            petal.setAttribute('rx', size * 0.2);
            petal.setAttribute('ry', size * 0.26);
            petal.setAttribute('fill', color.center || '#be185d');
            petal.setAttribute('opacity', '0.9');
            petal.setAttribute('transform', `rotate(${angle} ${cx} ${cy})`);
            g.appendChild(petal);
        }
        const center = document.createElementNS(NS, 'circle');
        center.setAttribute('cx', cx);
        center.setAttribute('cy', cy);
        center.setAttribute('r', size * 0.14);
        center.setAttribute('fill', color.hex);
        g.appendChild(center);
        return g;
    }

    // 5. Marigold (ചെണ്ടുമല്ലി) — ruffled festive pom-pom
    function drawMarigoldFlower(g, cx, cy, color, size) {
        const petalCount = 8;
        for (let i = 0; i < petalCount; i++) {
            const angle = (360 / petalCount) * i;
            const petal = document.createElementNS(NS, 'ellipse');
            petal.setAttribute('cx', cx);
            petal.setAttribute('cy', cy - size * 0.34);
            petal.setAttribute('rx', size * 0.2);
            petal.setAttribute('ry', size * 0.38);
            petal.setAttribute('fill', color.hex);
            petal.setAttribute('stroke', color.border || 'rgba(0,0,0,0.12)');
            petal.setAttribute('stroke-width', '0.6');
            petal.setAttribute('transform', `rotate(${angle} ${cx} ${cy})`);
            g.appendChild(petal);
        }
        for (let i = 0; i < petalCount; i++) {
            const angle = (360 / petalCount) * i + 22.5;
            const petal = document.createElementNS(NS, 'ellipse');
            petal.setAttribute('cx', cx);
            petal.setAttribute('cy', cy - size * 0.2);
            petal.setAttribute('rx', size * 0.16);
            petal.setAttribute('ry', size * 0.28);
            petal.setAttribute('fill', color.hex);
            petal.setAttribute('transform', `rotate(${angle} ${cx} ${cy})`);
            g.appendChild(petal);
        }
        const center = document.createElementNS(NS, 'circle');
        center.setAttribute('cx', cx);
        center.setAttribute('cy', cy);
        center.setAttribute('r', size * 0.18);
        center.setAttribute('fill', color.center || '#7a4a1e');
        g.appendChild(center);
        return g;
    }

    // 6. Lotus (താമര) — elegant pointed sacred petals
    function drawLotusFlower(g, cx, cy, color, size) {
        const petalCount = 8;
        for (let i = 0; i < petalCount; i++) {
            const angle = (360 / petalCount) * i;
            const p = document.createElementNS(NS, 'path');
            const d = `M ${cx} ${cy} Q ${cx - size * 0.26} ${cy - size * 0.3} ${cx} ${cy - size * 0.54} Q ${cx + size * 0.26} ${cy - size * 0.3} ${cx} ${cy} Z`;
            p.setAttribute('d', d);
            p.setAttribute('fill', color.hex);
            p.setAttribute('stroke', color.border || '#e11d48');
            p.setAttribute('stroke-width', '0.6');
            p.setAttribute('transform', `rotate(${angle} ${cx} ${cy})`);
            g.appendChild(p);
        }
        // Center seed pod
        const pod = document.createElementNS(NS, 'circle');
        pod.setAttribute('cx', cx);
        pod.setAttribute('cy', cy);
        pod.setAttribute('r', size * 0.18);
        pod.setAttribute('fill', color.center || '#facc15');
        g.appendChild(pod);
        return g;
    }

    // 7. Chembarathi (ചെമ്പരത്തി) — 5 broad flared petals with central eye & stamen
    function drawChembarathiFlower(g, cx, cy, color, size) {
        const petalCount = 5;
        for (let i = 0; i < petalCount; i++) {
            const angle = (360 / petalCount) * i;
            const petal = document.createElementNS(NS, 'ellipse');
            petal.setAttribute('cx', cx);
            petal.setAttribute('cy', cy - size * 0.28);
            petal.setAttribute('rx', size * 0.28);
            petal.setAttribute('ry', size * 0.44);
            petal.setAttribute('fill', color.hex);
            petal.setAttribute('stroke', color.border || 'rgba(0,0,0,0.15)');
            petal.setAttribute('stroke-width', '0.6');
            petal.setAttribute('transform', `rotate(${angle} ${cx} ${cy})`);
            g.appendChild(petal);
        }
        // Central eye
        const eye = document.createElementNS(NS, 'circle');
        eye.setAttribute('cx', cx);
        eye.setAttribute('cy', cy);
        eye.setAttribute('r', size * 0.22);
        eye.setAttribute('fill', color.center || '#7f1d1d');
        g.appendChild(eye);

        // Stamen stalk dot
        const stamen = document.createElementNS(NS, 'circle');
        stamen.setAttribute('cx', cx + size * 0.12);
        stamen.setAttribute('cy', cy - size * 0.14);
        stamen.setAttribute('r', size * 0.08);
        stamen.setAttribute('fill', color.stamen || '#fbbf24');
        g.appendChild(stamen);
        return g;
    }

    function withinBounds(x, y) {
        return x >= 0 && x <= 400 && y >= 0 && y <= 400;
    }

    function flashOutOfBounds() {
        svg.classList.add('shake');
        setTimeout(() => svg.classList.remove('shake'), 200);
    }

    function svgPoint(evt) {
        const rect    = svg.getBoundingClientRect();
        const clientX = evt.touches ? evt.touches[0].clientX : evt.clientX;
        const clientY = evt.touches ? evt.touches[0].clientY : evt.clientY;
        const x       = ((clientX - rect.left) / rect.width)  * 400;
        const y       = ((clientY - rect.top)  / rect.height) * 400;
        return { x, y };
    }

    // ====================================================
    // STAMP HANDLER — region-aware
    // ====================================================
    function handleStamp(evt) {
        const { x, y } = svgPoint(evt);

        if (isImageTemplate) {
            // ----- Image template: constrain to detected borders -----
            if (!templateReady) {
                canvasHint.textContent = 'Template still loading — try again in a moment.';
                return;
            }

            const regionMask = floodFillRegion(x, y);

            if (!regionMask) {
                // Clicked on a border or background — shake and hint
                flashOutOfBounds();
                canvasHint.textContent = "That's a border line! Click inside an enclosed shape to fill it.";
                setTimeout(updateHint, 1800);
                return;
            }

            // Unlock this region (add to accumulated mask)
            commitRegion(regionMask);

            if (currentFlowerForm === 'cut') {
                // ✂️ CUT PETALS MODE: Fill the entire enclosed shape bounded by the borders!
                const shapeFill = fillRegionWithCutPetals(regionMask, currentFlower, currentColor);
                regionGroup.appendChild(shapeFill);
                placed.push(shapeFill);
                canvasHint.textContent = `✨ Filled shape with ${currentColor.name} ${currentFlower.nameEn} petals!`;
            } else {
                // 🌸 WHOLE FLOWER MODE: Stamp an intact whole flower at the clicked point
                const size   = SIZES[currentSizeKey];
                const flower = createFlower(x, y, currentFlower, currentColor, size);
                regionGroup.appendChild(flower);
                placed.push(flower);
                canvasHint.textContent = `🌸 Placed ${currentColor.name} ${currentFlower.nameEn} flower!`;
            }

        } else {
            // ----- Free draw or SVG template -----
            if (!withinBounds(x, y)) {
                flashOutOfBounds();
                return;
            }
            const size   = SIZES[currentSizeKey];
            const flower = createFlower(x, y, currentFlower, currentColor, size);
            petalLayer.appendChild(flower);
            placed.push(flower);
        }
    }

    svg.addEventListener('click', handleStamp);

    // ---------- Undo ----------
    document.getElementById('btnUndo').addEventListener('click', () => {
        const last = placed.pop();
        if (!last) return;
        if (last.type === 'vector-batch') {
            last.elements.forEach(el => el.remove());
        } else if (last.remove) {
            last.remove();
        }
    });

    // ---------- Clear ----------
    document.getElementById('btnClear').addEventListener('click', () => {
        if (vectorFillLayer) vectorFillLayer.innerHTML = '';
        if (isImageTemplate && regionGroup) {
            regionGroup.innerHTML = '';
            accumulatedMask.fill(0);
            regionCache.clear();
            const ctx = accumulatedCanvas.getContext('2d');
            ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
            svgMaskImgEl.setAttribute('href', '');
        } else {
            petalLayer.innerHTML = '';
        }
        placed = [];
    });

    // ---------- Download as PNG ----------
    document.getElementById('btnDownload').addEventListener('click', () => {
        const wasHidden = guideLayer.style.display;
        guideLayer.style.display = 'none';

        const serializer = new XMLSerializer();
        const svgString  = serializer.serializeToString(svg);
        guideLayer.style.display = wasHidden;

        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url     = URL.createObjectURL(svgBlob);
        const img     = new Image();

        img.onload = function () {
            const scale  = 2;
            const canvas = document.createElement('canvas');
            canvas.width  = 400 * scale;
            canvas.height = 400 * scale;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            URL.revokeObjectURL(url);

            canvas.toBlob(function (blob) {
                const link    = document.createElement('a');
                link.download = 'my-pookalam.png';
                link.href     = URL.createObjectURL(blob);
                link.click();
            });
        };
        img.src = url;
    });

    // ---------- Share Feature (Zero External APIs Required) ----------
    const sharePanel = document.getElementById('sharePanel');
    const shareHint  = document.getElementById('shareHint');
    const shareBtns  = document.getElementById('shareBtns');

    const PROJECT_URL = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '') + '/index.html';
    const SHARE_TEXT  = 'I just designed a festive Onam Pookalam! 🌸🪔 Create yours too:';

    // Toggle share panel visibility
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

    // Generate high-resolution PNG blob from current canvas state
    function generatePNG(callback) {
        try {
            const wasHidden = guideLayer.style.display;
            guideLayer.style.display = 'none';

            // Clone SVG and set explicit dimensions for robust image rendering
            const svgClone = svg.cloneNode(true);
            svgClone.setAttribute('width', '400');
            svgClone.setAttribute('height', '400');

            const serializer = new XMLSerializer();
            const svgString  = serializer.serializeToString(svgClone);
            guideLayer.style.display = wasHidden;

            const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
            const url     = URL.createObjectURL(svgBlob);
            const img     = new Image();

            img.onload = function () {
                const canvas = document.createElement('canvas');
                canvas.width  = 800;
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
        const link    = document.createElement('a');
        link.download = filename;
        link.href     = URL.createObjectURL(blob);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    }

    // 1. 🖼️ Share to Community Gallery
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

    // 2. 💬 WhatsApp Share (Web Intent)
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

    // 3. 𝕏 Post on Twitter/X (Web Intent)
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

    // 4. 📋 Copy Website Link
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