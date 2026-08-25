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

    const COLORS = [
        { name: 'Marigold', hex: '#f2c14e', center: '#7a4a1e' },
        { name: 'Saffron',  hex: '#f2994a', center: '#7a4a1e' },
        { name: 'Rose',     hex: '#e0577b', center: '#7a4a1e' },
        { name: 'Magenta',  hex: '#c2419a', center: '#fbf3e3' },
        { name: 'Crimson',  hex: '#c0392b', center: '#fbf3e3' },
        { name: 'Leaf',     hex: '#4e8c4a', center: '#fbf3e3' },
        { name: 'Ivory',    hex: '#fdf6e3', center: '#f2c14e' },
    ];

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
    let currentColor       = COLORS[0];
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

    document.getElementById('btnChooseTemplate').addEventListener('click', goToBrowseTemplates);
    document.getElementById('btnUploadOwn').addEventListener('click', goToUploadOwn);

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

    btnBack.addEventListener('click', () => {
        if (!canvasStep.hidden) {
            goToBrowseTemplates();
        } else if (subTemplateStep && !subTemplateStep.hidden) {
            goToHome();
        }
    });

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

    // ---------- Colour palette ----------
    const paletteEl = document.getElementById('colorPalette');
    COLORS.forEach((color, i) => {
        const btn = document.createElement('button');
        btn.className = 'color-swatch' + (i === 0 ? ' active' : '');
        btn.style.background = color.hex;
        btn.setAttribute('aria-label', color.name);
        btn.addEventListener('click', () => {
            currentColor = color;
            paletteEl.querySelectorAll('.color-swatch').forEach((s) => s.classList.remove('active'));
            btn.classList.add('active');
        });
        paletteEl.appendChild(btn);
    });

    // ---------- Size buttons ----------
    document.querySelectorAll('.size-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            currentSizeKey = btn.dataset.size;
            document.querySelectorAll('.size-btn').forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // ---------- Flower stamp ----------
    function createFlower(cx, cy, color, size) {
        const g        = document.createElementNS(NS, 'g');
        const rotation = Math.random() * 72;
        g.setAttribute('transform', `rotate(${rotation} ${cx} ${cy})`);

        const petalCount = 5;
        for (let i = 0; i < petalCount; i++) {
            const angle = (360 / petalCount) * i;
            const petal = document.createElementNS(NS, 'ellipse');
            const dist  = size * 0.45;
            petal.setAttribute('cx',        cx);
            petal.setAttribute('cy',        cy - dist);
            petal.setAttribute('rx',        size * 0.28);
            petal.setAttribute('ry',        size * 0.5);
            petal.setAttribute('fill',      color.hex);
            petal.setAttribute('transform', `rotate(${angle} ${cx} ${cy})`);
            g.appendChild(petal);
        }

        const centerDot = document.createElementNS(NS, 'circle');
        centerDot.setAttribute('cx',   cx);
        centerDot.setAttribute('cy',   cy);
        centerDot.setAttribute('r',    size * 0.2);
        centerDot.setAttribute('fill', color.center);
        g.appendChild(centerDot);

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
            const flower = createFlower(x, y, currentColor, size);
            regionGroup.appendChild(flower);
            placed.push(flower);

        } else {
            // ----- Free draw or SVG template -----
            if (!withinBounds(x, y)) {
                flashOutOfBounds();
                return;
            }
            const size   = SIZES[currentSizeKey];
            const flower = createFlower(x, y, currentColor, size);
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

    // ---------- Share ----------
    const sharePanel = document.getElementById('sharePanel');
    const shareHint  = document.getElementById('shareHint');
    const shareBtns  = document.getElementById('shareBtns');

    const PROJECT_URL  = 'https://gayathrisubramanian06.github.io/Poovum-Codeum/';
    const SHARE_TEXT   = 'I just made my Onam Pookalam! 🌸🪔 Design yours too! #Onam #Pookalam #OnamCelebrations';

    // Toggle share panel visibility
    document.getElementById('btnShare').addEventListener('click', () => {
        sharePanel.hidden = !sharePanel.hidden;
        shareHint.textContent = '';
    });

    // Generate a 800×800 PNG blob from the current canvas state
    function generatePNG(callback) {
        const wasHidden = guideLayer.style.display;
        guideLayer.style.display = 'none';
        const serializer = new XMLSerializer();
        const svgString  = serializer.serializeToString(svg);
        guideLayer.style.display = wasHidden;

        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url     = URL.createObjectURL(svgBlob);
        const img     = new Image();
        img.onload = function () {
            const canvas = document.createElement('canvas');
            canvas.width  = 800;
            canvas.height = 800;
            canvas.getContext('2d').drawImage(img, 0, 0, 800, 800);
            URL.revokeObjectURL(url);
            canvas.toBlob(callback, 'image/png');
        };
        img.src = url;
    }

    function triggerDownload(blob, filename) {
        const link    = document.createElement('a');
        link.download = filename;
        link.href     = URL.createObjectURL(blob);
        link.click();
    }

    // X / Twitter — opens intent URL + auto-downloads image to attach
    document.getElementById('shareTwitter').addEventListener('click', () => {
        const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(PROJECT_URL)}`;
        window.open(tweetUrl, '_blank', 'noopener');
        generatePNG((blob) => {
            triggerDownload(blob, 'my-pookalam.png');
            shareHint.textContent = '✅ Twitter opened & image saved! Attach the image to your tweet.';
        });
    });

    // Instagram — no web API, so download + guide
    document.getElementById('shareInstagram').addEventListener('click', () => {
        generatePNG((blob) => {
            triggerDownload(blob, 'my-pookalam.png');
            shareHint.textContent = '✅ Image saved! Open Instagram → Create post → pick from your gallery.';
        });
    });

    // Web Share API — mobile native share sheet (includes Instagram, WhatsApp etc.)
    if (navigator.canShare) {
        const nativeBtn = document.createElement('button');
        nativeBtn.className = 'share-btn share-native';
        nativeBtn.innerHTML = '<span>📤</span> Share…';
        nativeBtn.addEventListener('click', () => {
            generatePNG((blob) => {
                const file = new File([blob], 'my-pookalam.png', { type: 'image/png' });
                if (navigator.canShare({ files: [file] })) {
                    navigator.share({
                        title: 'My Onam Pookalam 🌸',
                        text:  SHARE_TEXT,
                        files: [file]
                    }).catch(() => {});
                } else {
                    navigator.share({ title: 'My Onam Pookalam 🌸', text: SHARE_TEXT, url: PROJECT_URL }).catch(() => {});
                }
            });
        });
        shareBtns.appendChild(nativeBtn);
    }
})();