// ============================================
// Onam Pookalam Designer — Shared JS
// ============================================

// Nothing fancy needed yet — the hero buttons on index.html
// are plain <a> tags, so they navigate on their own.
// This file is here so every page already includes a script
// tag, ready for you to add real interactivity later
// (e.g. background music toggle, undo/redo on the design page).

// Fills the screen edge-to-edge with the hero image (like object-fit: cover)
// while keeping the buttons mathematically glued to their exact spot
// on the image, on every screen size — phone included.
function sizeHero() {
    const wrap = document.getElementById('heroWrap');
    const img = document.getElementById('heroImg');
    const btnStart = document.getElementById('btnStart');
    const btnGallery = document.getElementById('btnGallery');
    if (!wrap || !img) return; // not on this page, skip

    const IMG_W = 1672;
    const IMG_H = 941;

    const wrapW = wrap.clientWidth;
    const wrapH = wrap.clientHeight;

    // Stretch the image to perfectly fit the screen dimensions
    img.style.width = wrapW + 'px';
    img.style.height = wrapH + 'px';
    img.style.left = '0px';
    img.style.top = '0px';

    // Button positions as fractions of the ORIGINAL image (0 to 1),
    // measured from your poster. Adjust these 4 numbers per button
    // if a button ever looks slightly off.
    placeButton(btnStart, 0.365, 0.682, 0.258, 0.063, wrapW, wrapH);
    placeButton(btnGallery, 0.365, 0.764, 0.258, 0.068, wrapW, wrapH);
}

function placeButton(el, fx, fy, fw, fh, wrapW, wrapH) {
    if (!el) return;
    el.style.left = (fx * wrapW) + 'px';
    el.style.top = (fy * wrapH) + 'px';
    el.style.width = (fw * wrapW) + 'px';
    el.style.height = (fh * wrapH) + 'px';
}

window.addEventListener('load', sizeHero);
window.addEventListener('resize', sizeHero);
window.addEventListener('orientationchange', sizeHero);

console.log("Onam Pookalam Designer loaded ✨");