// ============================================
// Onam Pookalam Designer — Design Page Logic
// Step 1: pick a shape template
// Step 2: stamp flower petals onto the canvas
// ============================================

(function () {
    const templateStep = document.getElementById('templateStep');
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

    let currentShape = 'circle';
    let currentColor = COLORS[0];
    let currentSizeKey = 'medium';
    let placed = []; // stack of {el} for undo

    const NS = 'http://www.w3.org/2000/svg';

    // ---------- Step navigation ----------
    function goToCanvas(shape) {
        currentShape = shape;
        templateStep.hidden = true;
        canvasStep.hidden = false;
        btnBack.hidden = false;
        pageTitle.textContent = 'Design Your Pookalam';
        drawGuide();
        updateHint();
    }

    function goToTemplates() {
        canvasStep.hidden = true;
        templateStep.hidden = false;
        btnBack.hidden = true;
        pageTitle.textContent = 'Design Your Pookalam';
    }

    document.querySelectorAll('.template-card').forEach((card) => {
        card.addEventListener('click', () => goToCanvas(card.dataset.shape));
    });

    btnBack.addEventListener('click', goToTemplates);

    function updateHint() {
        if (currentShape === 'circle') {
            canvasHint.textContent = 'Tap inside the circle to place a flower.';
        } else if (currentShape === 'square') {
            canvasHint.textContent = 'Tap inside the square to place a flower.';
        } else {
            canvasHint.textContent = 'Tap anywhere to place a flower — no boundary, it\u2019s your design.';
        }
    }

    // ---------- Guide outline ----------
    function drawGuide() {
        guideLayer.innerHTML = '';
        if (currentShape === 'circle') {
            const c = document.createElementNS(NS, 'circle');
            c.setAttribute('cx', CENTER);
            c.setAttribute('cy', CENTER);
            c.setAttribute('r', CIRCLE_R);
            guideLayer.appendChild(c);
        } else if (currentShape === 'square') {
            const r = document.createElementNS(NS, 'rect');
            r.setAttribute('x', CENTER - SQUARE_HALF);
            r.setAttribute('y', CENTER - SQUARE_HALF);
            r.setAttribute('width', SQUARE_HALF * 2);
            r.setAttribute('height', SQUARE_HALF * 2);
            r.setAttribute('rx', 10);
            guideLayer.appendChild(r);
        }
        // freeform: no guide drawn
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