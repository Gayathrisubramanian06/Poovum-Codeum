// ============================================
// Onam Pookalam Designer — Shared JS
// All 4 interactivity features live here.
// ============================================

/* ------------------------------------------------
   HERO IMAGE SIZING (existing logic — unchanged)
   Keeps hero buttons pixel-perfect at every size.
   ------------------------------------------------ */
function sizeHero() {
    const wrap = document.getElementById('heroWrap');
    const img  = document.getElementById('heroImg');
    const btnStart   = document.getElementById('btnStart');
    const btnGallery = document.getElementById('btnGallery');
    if (!wrap || !img) return;

    const wrapW = wrap.clientWidth;
    const wrapH = wrap.clientHeight;

    img.style.width  = wrapW + 'px';
    img.style.height = wrapH + 'px';
    img.style.left   = '0px';
    img.style.top    = '0px';

    placeButton(btnStart,   0.365, 0.682, 0.258, 0.063, wrapW, wrapH);
    placeButton(btnGallery, 0.365, 0.764, 0.258, 0.068, wrapW, wrapH);
}

function placeButton(el, fx, fy, fw, fh, wrapW, wrapH) {
    if (!el) return;
    el.style.left   = (fx * wrapW) + 'px';
    el.style.top    = (fy * wrapH) + 'px';
    el.style.width  = (fw * wrapW) + 'px';
    el.style.height = (fh * wrapH) + 'px';
}

window.addEventListener('load',             sizeHero);
window.addEventListener('resize',           sizeHero);
window.addEventListener('orientationchange', sizeHero);


/* ------------------------------------------------
   FEATURE 1 — SCROLL FADE-IN
   Observes every .fade-in and .scale-in element.
   Triggers .visible when the element enters the viewport.
   Works on gallery cards, template cards, any content.
   ------------------------------------------------ */
function initScrollFadeIn() {
    const targets = document.querySelectorAll('.fade-in, .scale-in');
    if (!targets.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve after triggering — each element fades in only once
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    targets.forEach(el => observer.observe(el));
}


/* ------------------------------------------------
   FEATURE 2 — FALLING PETAL RAIN
   Only runs on the hero/index page (needs #heroWrap).
   Spawns 22 petals with randomised position, size,
   colour, duration and delay. All via CSS custom props.
   ------------------------------------------------ */
const PETAL_COLORS = [
    '#f97316', // marigold orange
    '#facc15', // golden yellow
    '#fb7185', // lotus pink
    '#dc2626', // thechi red
    '#ffffff',  // thumba white
    '#fde68a', // pale gold
    '#4ade80', // leaf green
    '#f472b6', // jasmine pink
];

function spawnPetals() {
    if (!document.getElementById('heroWrap')) return; // hero page only

    // Create the container if it doesn't exist
    let rain = document.getElementById('petalRain');
    if (!rain) {
        rain = document.createElement('div');
        rain.id = 'petalRain';
        document.body.appendChild(rain);
    }

    const COUNT = 22;
    for (let i = 0; i < COUNT; i++) {
        const petal = document.createElement('div');
        petal.className = 'falling-petal';

        const left     = Math.random() * 100;           // % across screen
        const dur      = 6 + Math.random() * 8;         // 6–14 s fall
        const delay    = -(Math.random() * dur);         // stagger start (negative = already mid-fall)
        const size     = 10 + Math.random() * 14;        // 10–24 px
        const color    = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
        const rotate   = Math.random() * 360;
        const opacity  = 0.55 + Math.random() * 0.35;

        petal.style.cssText = `
            left: ${left}%;
            width: ${size}px;
            height: ${size * 1.3}px;
            background: ${color};
            opacity: ${opacity};
            border-radius: ${Math.random() > 0.5 ? '50% 0 50% 0' : '0 50% 0 50%'};
            transform: rotate(${rotate}deg);
            --fall-dur: ${dur}s;
            --fall-delay: ${delay}s;
        `;

        rain.appendChild(petal);
    }
}


/* ------------------------------------------------
   FEATURE 3 — CLICK RIPPLE MICRO-INTERACTION
   Adds a golden ripple burst on any .hero-btn-solid,
   .ghost-btn, or .gallery-create-btn click.
   ------------------------------------------------ */
function initRipple() {
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.hero-btn-solid, .ghost-btn, .gallery-create-btn, .gallery-tab');
        if (!btn) return;

        // Don't add ripple if button already has one animating
        const existing = btn.querySelector('.ripple-fx');
        if (existing) existing.remove();

        const rect   = btn.getBoundingClientRect();
        const size   = Math.max(rect.width, rect.height) * 2;
        const x      = e.clientX - rect.left - size / 2;
        const y      = e.clientY - rect.top  - size / 2;

        const ripple = document.createElement('span');
        ripple.className = 'ripple-fx';
        ripple.style.cssText = `
            position: absolute;
            left: ${x}px; top: ${y}px;
            width: ${size}px; height: ${size}px;
            border-radius: 50%;
            background: rgba(242, 193, 78, 0.38);
            pointer-events: none;
            transform: scale(0);
            animation: rippleAnim 0.55s ease-out forwards;
        `;

        // Ensure the button is positioned relatively for overflow clipping
        const prevPos = btn.style.position;
        if (!prevPos || prevPos === 'static') btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.appendChild(ripple);

        ripple.addEventListener('animationend', () => ripple.remove());
    });

    // Inject the ripple keyframe once
    if (!document.getElementById('rippleStyle')) {
        const style = document.createElement('style');
        style.id = 'rippleStyle';
        style.textContent = `
            @keyframes rippleAnim {
                to { transform: scale(1); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}


/* ------------------------------------------------
   FEATURE 4 — PAGE TRANSITIONS (View Transitions API)
   Intercepts all <a> navigations within the same origin.
   Cross-fades between pages. Falls back to normal jump
   in Firefox or any browser without the API.
   ------------------------------------------------ */
function initPageTransitions() {
    if (!document.startViewTransition) return; // graceful no-op in Firefox

    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href]');
        if (!link) return;

        // Only intercept same-origin, same-page links (not #anchors, not external)
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
        if (link.target === '_blank') return;

        let dest;
        try {
            dest = new URL(href, window.location.href);
        } catch {
            return;
        }
        if (dest.origin !== window.location.origin) return;
        if (dest.href === window.location.href)      return;

        e.preventDefault();

        document.startViewTransition(() => {
            window.location.href = dest.href;
        });
    });
}


/* ------------------------------------------------
   AUTO-APPLY fade-in to gallery cards
   (gallery.js renders cards dynamically; we watch for
   DOM mutations and add .scale-in + delay as they appear)
   ------------------------------------------------ */
function watchGalleryCards() {
    const grid = document.getElementById('communityGalleryGrid');
    if (!grid) return;

    const mo = new MutationObserver((mutations) => {
        mutations.forEach(m => {
            m.addedNodes.forEach((node, idx) => {
                if (node.nodeType === 1 && node.classList.contains('gallery-card')) {
                    node.classList.add('scale-in');
                    node.dataset.delay = String(Math.min(6, (idx % 6) + 1));
                    // Tiny timeout so the browser paints opacity:0 before observer fires
                    setTimeout(() => {
                        if (!node.classList.contains('visible')) node.classList.add('visible');
                    }, 50);
                }
            });
        });
    });

    mo.observe(grid, { childList: true });
}


/* ------------------------------------------------
   BOOT — call everything on DOMContentLoaded
   ------------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
    initScrollFadeIn();
    spawnPetals();
    initRipple();
    initPageTransitions();
    watchGalleryCards();
});

console.log('Onam Pookalam Designer loaded ✨');