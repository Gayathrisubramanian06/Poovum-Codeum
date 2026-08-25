// ============================================
// Onam Pookalam Designer — Design Page Logic
// Step 1: pick a shape template
// Step 1.5: pick a sub-template or upload custom
// Step 2: stamp flower petals onto the canvas
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
    const guideLayer = document.getElementById('guideLayer');
    const petalLayer = document.getElementById('petalLayer');

    const CENTER = 200;
    const CIRCLE_R = 160;
    const SQUARE_HALF = 130;

    const SIZES = { small: 16, medium: 26, large: 38 };

    const COLORS = [
        { name: 'Marigold', hex: '#f2c14e', center: '#7a4a1e' },
        { name: 'Saffron', hex: '#f2994a', center: '#7a4a1e' },
        { name: 'Rose', hex: '#e0577b', center: '#7a4a1e' },
        { name: 'Magenta', hex: '#c2419a', center: '#fbf3e3' },
        { name: 'Crimson', hex: '#c0392b', center: '#fbf3e3' },
        { name: 'Leaf', hex: '#4e8c4a', center: '#fbf3e3' },
        { name: 'Ivory', hex: '#fdf6e3', center: '#f2c14e' },
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
    let currentColor = COLORS[0];
    let currentSizeKey = 'medium';
    let placed = []; // stack of {el} for undo

    const NS = 'http://www.w3.org/2000/svg';

    // ---------- Step navigation ----------
    function goToHome() {
        canvasStep.hidden = true;
        if (subTemplateStep) subTemplateStep.hidden = true;
        templateStep.hidden = false;
        btnBack.hidden = true;
        pageTitle.textContent = 'Design Your Pookalam';
    }

    function goToBrowseTemplates() {
        templateStep.hidden = true;
        canvasStep.hidden = true;
        if (subTemplateStep) subTemplateStep.hidden = false;
        btnBack.hidden = false;
        pageTitle.textContent = 'Pick a Design';

        const subTitle = document.getElementById('subTemplateTitle');
        const subSubtitle = document.getElementById('subTemplateSubtitle');
        if (subTitle) subTitle.textContent = 'Pick a design';
        if (subSubtitle) subSubtitle.textContent = 'Select a layout to use as your guide.';

        predefinedTemplates.hidden = false;
        customTemplateUpload.hidden = true;

        predefinedTemplates.innerHTML = '';
        // Show all templates from the circle array
        PREDEFINED_TEMPLATES.circle.forEach(tpl => {
            const btn = document.createElement('button');
            btn.className = 'template-card';
            btn.innerHTML = `<img src="${tpl.img}" alt="${tpl.name}" loading="lazy" />`;
            btn.addEventListener('click', () => {
                currentSubTemplate = `<image href="${tpl.img}" x="0" y="0" width="400" height="400" opacity="0.3" preserveAspectRatio="xMidYMid meet" />`;
                goToCanvas();
            });
            predefinedTemplates.appendChild(btn);
        });
    }

    function goToUploadOwn() {
        templateStep.hidden = true;
        canvasStep.hidden = true;
        if (subTemplateStep) subTemplateStep.hidden = false;
        btnBack.hidden = false;
        pageTitle.textContent = 'Upload Your Template';

        // Hide the image grid completely — only the upload box should show
        predefinedTemplates.innerHTML = '';
        predefinedTemplates.hidden = true;
        customTemplateUpload.hidden = false;

        const subTitle = document.getElementById('subTemplateTitle');
        const subSubtitle = document.getElementById('subTemplateSubtitle');
        if (subTitle) subTitle.textContent = 'Upload Your Own';
        if (subSubtitle) subSubtitle.textContent = 'Use your own image as a tracing guide.';
    }

    function goToCanvas() {
        if (subTemplateStep) subTemplateStep.hidden = true;
        templateStep.hidden = true;
        canvasStep.hidden = false;
        btnBack.hidden = false;
        pageTitle.textContent = 'Design Your Pookalam';
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
        canvasHint.textContent = currentSubTemplate
            ? 'Tap on the design to place a flower.'
            : 'Tap anywhere to place a flower — no boundary, it’s your design.';
    }

    // ---------- Guide outline ----------
    function drawGuide() {
        guideLayer.innerHTML = '';
        if (currentSubTemplate) {
            guideLayer.innerHTML = currentSubTemplate;
        }
        // no sub-template means blank canvas (custom free-draw)
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
        const g = document.createElementNS(NS, 'g');
        const rotation = Math.random() * 72;
        g.setAttribute('transform', `rotate(${rotation} ${cx} ${cy})`);

        const petalCount = 5;
        for (let i = 0; i < petalCount; i++) {
            const angle = (360 / petalCount) * i;
            const petal = document.createElementNS(NS, 'ellipse');
            const dist = size * 0.45;
            petal.setAttribute('cx', cx);
            petal.setAttribute('cy', cy - dist);
            petal.setAttribute('rx', size * 0.28);
            petal.setAttribute('ry', size * 0.5);
            petal.setAttribute('fill', color.hex);
            petal.setAttribute('transform', `rotate(${angle} ${cx} ${cy})`);
            g.appendChild(petal);
        }

        const centerDot = document.createElementNS(NS, 'circle');
        centerDot.setAttribute('cx', cx);
        centerDot.setAttribute('cy', cy);
        centerDot.setAttribute('r', size * 0.2);
        centerDot.setAttribute('fill', color.center);
        g.appendChild(centerDot);

        return g;
    }

    function withinBounds(x, y) {
        if (currentShape === 'circle') {
            const dx = x - CENTER;
            const dy = y - CENTER;
            return Math.sqrt(dx * dx + dy * dy) <= CIRCLE_R;
        }
        if (currentShape === 'square') {
            return (
                x >= CENTER - SQUARE_HALF &&
                x <= CENTER + SQUARE_HALF &&
                y >= CENTER - SQUARE_HALF &&
                y <= CENTER + SQUARE_HALF
            );
        }
        return x >= 0 && x <= 400 && y >= 0 && y <= 400;
    }

    function flashOutOfBounds() {
        svg.classList.add('shake');
        setTimeout(() => svg.classList.remove('shake'), 200);
    }

    function svgPoint(evt) {
        const rect = svg.getBoundingClientRect();
        const clientX = evt.touches ? evt.touches[0].clientX : evt.clientX;
        const clientY = evt.touches ? evt.touches[0].clientY : evt.clientY;
        const x = ((clientX - rect.left) / rect.width) * 400;
        const y = ((clientY - rect.top) / rect.height) * 400;
        return { x, y };
    }

    function handleStamp(evt) {
        const { x, y } = svgPoint(evt);
        if (!withinBounds(x, y)) {
            flashOutOfBounds();
            return;
        }
        const size = SIZES[currentSizeKey];
        const flower = createFlower(x, y, currentColor, size);
        petalLayer.appendChild(flower);
        placed.push(flower);
    }

    svg.addEventListener('click', handleStamp);

    // ---------- Undo / Clear ----------
    document.getElementById('btnUndo').addEventListener('click', () => {
        const last = placed.pop();
        if (last) last.remove();
    });

    document.getElementById('btnClear').addEventListener('click', () => {
        petalLayer.innerHTML = '';
        placed = [];
    });

    // ---------- Download as PNG ----------
    document.getElementById('btnDownload').addEventListener('click', () => {
        const wasHidden = guideLayer.style.display;
        guideLayer.style.display = 'none';

        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svg);
        guideLayer.style.display = wasHidden;

        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        const img = new Image();

        img.onload = function () {
            const scale = 2;
            const canvas = document.createElement('canvas');
            canvas.width = 400 * scale;
            canvas.height = 400 * scale;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            URL.revokeObjectURL(url);

            canvas.toBlob(function (blob) {
                const link = document.createElement('a');
                link.download = 'my-pookalam.png';
                link.href = URL.createObjectURL(blob);
                link.click();
            });
        };
        img.src = url;
    });
})();