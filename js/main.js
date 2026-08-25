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

    const IMG_W = 2245;
    const IMG_H = 1587;

    const wrapW = wrap.clientWidth;
    const wrapH = wrap.clientHeight;

    // scale needed so the image fully covers the screen (may overflow/crop)
    const scale = Math.max(wrapW / IMG_W, wrapH / IMG_H);

    const scaledW = IMG_W * scale;
    const scaledH = IMG_H * scale;
    const offsetX = (wrapW - scaledW) / 2; // negative = cropped on sides
    const offsetY = (wrapH - scaledH) / 2;

    img.style.width = scaledW + 'px';
    img.style.height = scaledH + 'px';
    img.style.left = offsetX + 'px';
    img.style.top = offsetY + 'px';

    // Button positions as fractions of the ORIGINAL image (0 to 1),
    // measured from your poster. Adjust these 4 numbers per button
    // if a button ever looks slightly off.
    placeButton(btnStart, 0.32, 0.635, 0.35, 0.063, offsetX, offsetY, scale, IMG_W, IMG_H);
    placeButton(btnGallery, 0.32, 0.73, 0.35, 0.06, offsetX, offsetY, scale, IMG_W, IMG_H);
}

function placeButton(el, fx, fy, fw, fh, offsetX, offsetY, scale, IMG_W, IMG_H) {
    if (!el) return;
    el.style.left = (offsetX + fx * IMG_W * scale) + 'px';
    el.style.top = (offsetY + fy * IMG_H * scale) + 'px';
    el.style.width = (fw * IMG_W * scale) + 'px';
    el.style.height = (fh * IMG_H * scale) + 'px';
}

window.addEventListener('load', sizeHero);
window.addEventListener('resize', sizeHero);
window.addEventListener('orientationchange', sizeHero);

console.log("Onam Pookalam Designer loaded ✨");