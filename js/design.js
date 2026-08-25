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
    // TRADITIONAL ONAM FLOWERS & COLOR VARIETIES
    // ====================================================
    const ONAM_FLOWERS = [
        {
            id: 'thumba',
            nameEn: 'Thumba',
            nameMl: 'തുമ്പ',
            icon: '🌿',
            description: 'Sacred white Onam flower',
            varieties: [
                { name: 'Pure White',      hex: '#ffffff', center: '#86efac', border: '#cbd5e1' },
                { name: 'Cream White',     hex: '#fefbf3', center: '#4ade80', border: '#e2e8f0' },
                { name: 'Dewdrop Pearl',   hex: '#f0fdf4', center: '#22c55e', border: '#bbf7d0' },
                { name: 'Pale Mint',       hex: '#dcfce7', center: '#16a34a', border: '#86efac' }
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
                { name: 'Coral Orange',    hex: '#ea580c', center: '#fed7aa', border: '#9a3412' },
                { name: 'Golden Yellow',   hex: '#facc15', center: '#854d0e', border: '#ca8a04' },
                { name: 'Flamingo Pink',   hex: '#ec4899', center: '#fbcfe8', border: '#be185d' },
                { name: 'Snow White',      hex: '#fafafa', center: '#fde047', border: '#e5e7eb' }
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
                { name: 'Warm Saffron',    hex: '#f97316', center: '#c2410c', border: '#7c2d12' },
                { name: 'Pure White',      hex: '#ffffff', center: '#facc15', border: '#cbd5e1' },
                { name: 'Maroon Burgundy', hex: '#881337', center: '#fde047', border: '#4c0519' },
                { name: 'Sunset Bronze',   hex: '#c2410c', center: '#431407', border: '#7c2d12' },
                { name: 'Soft Lilac',      hex: '#c084fc', center: '#fef08a', border: '#9333ea' }
            ]
        },
        {
            id: 'rose',
            nameEn: 'Rose',
            nameMl: 'റോസ് / പനിനീർ',
            icon: '🌹',
            description: 'Layered fragrant Rose petals',
            varieties: [
                { name: 'Kashmiri Crimson',hex: '#e11d48', center: '#881337', border: '#9f1239' },
                { name: 'Paneer Pink',     hex: '#f472b6', center: '#be185d', border: '#db2777' },
                { name: 'Bright Yellow',   hex: '#fde047', center: '#ca8a04', border: '#eab308' },
                { name: 'Pure White',      hex: '#ffffff', center: '#fef08a', border: '#cbd5e1' },
                { name: 'Sunset Coral',    hex: '#fb923c', center: '#c2410c', border: '#ea580c' },
                { name: 'Deep Velvet',     hex: '#4c0519', center: '#f43f5e', border: '#29030d' }
            ]
        },
        {
            id: 'marigold',
            nameEn: 'Marigold',
            nameMl: 'ചെണ്ടുമല്ലി',
            icon: '🏵️',
            description: 'Ruffled festive Tagetes pom-pom',
            varieties: [
                { name: 'Golden Orange',   hex: '#f97316', center: '#9a3412', border: '#c2410c' },
                { name: 'Sunshine Yellow', hex: '#eab308', center: '#854d0e', border: '#ca8a04' },
                { name: 'Deep Saffron',    hex: '#ea580c', center: '#7c2d12', border: '#9a3412' },
                { name: 'Lemon Yellow',    hex: '#fef08a', center: '#ca8a04', border: '#fde047' },
                { name: 'Rust Copper',     hex: '#b45309', center: '#451a03', border: '#78350f' }
            ]
        },
        {
            id: 'lotus',
            nameEn: 'Lotus',
            nameMl: 'താമര',
            icon: '🪷',
            description: 'Sacred pointed Lotus petals',
            varieties: [
                { name: 'Sacred Pink',     hex: '#fb7185', center: '#facc15', border: '#e11d48' },
                { name: 'Royal Magenta',   hex: '#db2777', center: '#fde047', border: '#9d174d' },
                { name: 'Pure White',      hex: '#ffffff', center: '#facc15', border: '#cbd5e1' },
                { name: 'Soft Lilac',      hex: '#e879f9', center: '#fde047', border: '#c026d3' },
                { name: 'Rose Bloom',      hex: '#f43f5e', center: '#fbbf24', border: '#be123c' }
            ]
        },
        {
            id: 'chembarathi',
            nameEn: 'Chembarathi',
            nameMl: 'ചെമ്പരത്തി',
            icon: '🌺',
            description: 'Classic 5-petal flared Hibiscus',
            varieties: [
                { name: 'Ruby Red',        hex: '#dc2626', center: '#7f1d1d', border: '#991b1b', stamen: '#fbbf24' },
                { name: 'Fuchsia Pink',    hex: '#ec4899', center: '#831843', border: '#be185d', stamen: '#fde047' },
                { name: 'Canary Yellow',   hex: '#facc15', center: '#854d0e', border: '#ca8a04', stamen: '#dc2626' },
                { name: 'Coral Orange',    hex: '#f97316', center: '#7c2d12', border: '#ea580c', stamen: '#fde047' },
                { name: 'Snow White',      hex: '#ffffff', center: '#cbd5e1', border: '#94a3b8', stamen: '#f59e0b' }
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
        if (subSubtitle) subSubtitle.textContent = 'Select a layout to use as your guide.';

        predefinedTemplates.hidden    = false;
        customTemplateUpload.hidden   = true;

        predefinedTemplates.innerHTML = '';
        PREDEFINED_TEMPLATES.circle.forEach(tpl => {
            const btn = document.createElement('button');
            btn.className = 'template-card';
            btn.innerHTML = `<img src="${tpl.img}" alt="${tpl.name}" loading="lazy" />`;
            btn.addEventListener('click', () => {
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

        // Reset canvas content and region state
        clearRegionState();
        petalLayer.innerHTML = '';
        placed = [];

        // Initialise region detection if an image template was chosen
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
                canvasHint.textContent = 'Click inside a bordered region to fill it. Each region snaps to its borders!';
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
    let currentFlowerForm = 'whole'; // 'whole' or 'cut'

    document.querySelectorAll('.form-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            currentFlowerForm = btn.dataset.form;
            document.querySelectorAll('.form-btn').forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
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

    // ---------- Cut / Shredded Petals (അരിഞ്ഞ ഇതളുകൾ) ----------
    // Realistic organic cluster of plucked/cut petal flakes for smooth pookalam filling
    function drawCutPetals(g, cx, cy, flowerType, color, size) {
        const flakeCount = size < 20 ? 5 : (size < 30 ? 8 : 12);
        const spread = size * 0.45;

        for (let i = 0; i < flakeCount; i++) {
            // Random scatter around the click center
            const angle = Math.random() * Math.PI * 2;
            const dist  = Math.random() * spread;
            const px    = cx + Math.cos(angle) * dist;
            const py    = cy + Math.sin(angle) * dist;
            const rot   = Math.random() * 360;

            const flake = document.createElementNS(NS, 'path');
            const flakeW = size * (0.18 + Math.random() * 0.12);
            const flakeH = size * (0.32 + Math.random() * 0.18);

            // Curved elongated petal shred
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
                canvasHint.textContent = 'That\'s a border! Click inside a coloured region.';
                setTimeout(updateHint, 1800);
                return;
            }

            // Unlock this region (add to accumulated mask)
            commitRegion(regionMask);

            // Place flower inside the masked group
            const size   = SIZES[currentSizeKey];
            const flower = createFlower(x, y, currentFlower, currentColor, size);
            regionGroup.appendChild(flower);
            placed.push(flower);

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
        if (last) last.remove();
    });

    // ---------- Clear ----------
    document.getElementById('btnClear').addEventListener('click', () => {
        if (isImageTemplate && regionGroup) {
            // Clear flowers but keep the masked group; reset the accumulated mask
            regionGroup.innerHTML = '';
            accumulatedMask.fill(0);
            regionCache.clear();
            const ctx    = accumulatedCanvas.getContext('2d');
            ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
            svgMaskImgEl.setAttribute('href', ''); // empty mask hides everything
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

    // 1. 𝕏 Post on Twitter/X (Web Intent)
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

    // 3. 📸 Instagram (Downloads image + guidance)
    const shareInstagramBtn = document.getElementById('shareInstagram');
    if (shareInstagramBtn) {
        shareInstagramBtn.addEventListener('click', () => {
            generatePNG((blob) => {
                triggerDownload(blob, 'my-onam-pookalam.png');
                if (shareHint) shareHint.textContent = '✅ Pookalam saved to your device! Open Instagram → Create Post/Story to share.';
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

    // 5. 📤 Native Web Share API (Mobile / Tablet)
    if (typeof navigator.share === 'function') {
        const nativeBtn = document.createElement('button');
        nativeBtn.className = 'share-btn share-native';
        nativeBtn.innerHTML = '<span>📤</span> More…';
        nativeBtn.title = 'Share with other apps';
        nativeBtn.addEventListener('click', () => {
            generatePNG((blob) => {
                if (blob && typeof navigator.canShare === 'function') {
                    const file = new File([blob], 'my-pookalam.png', { type: 'image/png' });
                    if (navigator.canShare({ files: [file] })) {
                        navigator.share({
                            title: 'My Onam Pookalam 🌸',
                            text:  SHARE_TEXT,
                            files: [file]
                        }).catch(() => {});
                        return;
                    }
                }
                navigator.share({
                    title: 'My Onam Pookalam 🌸',
                    text:  SHARE_TEXT,
                    url:   PROJECT_URL
                }).catch(() => {});
            });
        });
        if (shareBtns) shareBtns.appendChild(nativeBtn);
    }
})();