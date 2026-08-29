// ====================================================
// COMPLETE DYNAMIC VECTOR MANDALA PATH GENERATORS
// ====================================================

const CENTER = 200;

export const VECTOR_TEMPLATES = [
    { id: 'surya-padma', name: 'Surya Padma (സൂര്യപത്മം)', badge: 'Mandala ✨' },
    { id: 'lotus-mandala', name: 'Sacred Lotus (അഷ്ടദള പത്മം)', badge: 'Mandala ✨' },
    { id: 'sunburst-12', name: 'Sunburst Star (സൂര്യകാന്തി)', badge: 'Mandala ✨' },
    { id: 'peacock-wheel', name: 'Peacock Wheel (മയിൽപ്പീലി)', badge: 'Mandala ✨' },
    { id: 'diamond-mandala', name: 'Diamond Star (വൈര നക്ഷത്രം)', badge: 'Mandala ✨' },
    { id: 'concentric-rings', name: 'Concentric Bloom (സഹസ്രദളം)', badge: 'Mandala ✨' },
    { id: 'heritage-8', name: 'Classic Heritage (പാരമ്പര്യ വലയം)', badge: 'Mandala ✨' },
    { id: 'festival-ring', name: 'Festival Floral Ring (ഉത്സവ വലയം)', badge: 'Mandala ✨' },
    { id: 'star-weave', name: 'Star Weave (നക്ഷത്ര ജാലകം)', badge: 'Mandala ✨' },
    { id: 'royal-core', name: 'Royal Core (രാജകീയ പത്മം)', badge: 'Mandala ✨' },
    { id: 'peacock-plume', name: 'Peacock Plumes (പീലി വിരിഞ്ഞത്)', badge: 'Mandala ✨' },
    { id: 'spiral-bloom', name: 'Spiral Vortex (സർപ്പിള പുഷ്പം)', badge: 'Mandala ✨' }
];

export const PREDEFINED_TEMPLATES = {
    circle: [
        { id: 'c3', name: 'Scalloped Mandala', img: 'assets/images/circle-3.jpg' },
        { id: 'c9', name: 'Intricate Web', img: 'assets/images/circle-9.jpg' },
        { id: 'c25', name: 'Surya Radiant', img: 'assets/images/circle-25.jpg' },
        { id: 'c26', name: 'Padmam Crown', img: 'assets/images/circle-26.jpg' },
        { id: 'c22', name: 'Swirling Petals', img: 'assets/images/circle-22.jpg' },
        { id: 'c23', name: 'Hexa Bloom', img: 'assets/images/circle-23.jpg' },
        { id: 'c12', name: 'Radiant Petals', img: 'assets/images/circle-12.jpg' },
        { id: 'c13', name: 'Layered Lotus', img: 'assets/images/circle-13.jpg' },
        { id: 'c24', name: 'Tiered Blossom', img: 'assets/images/circle-24.jpg' },
        { id: 'c16', name: 'Floral Mandala', img: 'assets/images/circle-16.jpg' },
        { id: 'c21', name: 'Festival Ring', img: 'assets/images/circle-21.jpg' },
        { id: 'c14', name: 'Peacock Wheel', img: 'assets/images/circle-14.jpg' },
        { id: 'c18', name: 'Heritage Pattern', img: 'assets/images/circle-18.jpg' },
        { id: 'c27', name: 'Daisy Wheel', img: 'assets/images/circle-27.jpg' },
        { id: 'c28', name: 'Layered Rosette', img: 'assets/images/circle-28.jpg' }
    ]
};

export function generateMandalaPaths(templateId) {
    const paths = [];

    const addCircleSegment = (r, groupKey) => {
        const d = `M ${CENTER} ${CENTER - r} A ${r} ${r} 0 1 1 ${CENTER} ${CENTER + r} A ${r} ${r} 0 1 1 ${CENTER} ${CENTER - r} Z`;
        paths.push({ d, groupKey });
    };

    const addPetalSegment = (dist, angleDeg, length, width, groupKey) => {
        const rad = (angleDeg - 90) * Math.PI / 180;
        const perp = rad + Math.PI / 2;

        const bx = CENTER + dist * Math.cos(rad);
        const by = CENTER + dist * Math.sin(rad);
        const tx = CENTER + (dist + length) * Math.cos(rad);
        const ty = CENTER + (dist + length) * Math.sin(rad);

        const mx1 = CENTER + (dist + length * 0.5) * Math.cos(rad) + (width * 0.5) * Math.cos(perp);
        const my1 = CENTER + (dist + length * 0.5) * Math.sin(rad) + (width * 0.5) * Math.sin(perp);
        const mx2 = CENTER + (dist + length * 0.5) * Math.cos(rad) - (width * 0.5) * Math.cos(perp);
        const my2 = CENTER + (dist + length * 0.5) * Math.sin(rad) - (width * 0.5) * Math.sin(perp);

        const d = `M ${bx} ${by} Q ${mx1} ${my1} ${tx} ${ty} Q ${mx2} ${my2} ${bx} ${by} Z`;
        paths.push({ d, groupKey });
    };

    const addAnnularArcSegment = (r1, r2, startDeg, endDeg, groupKey) => {
        const rad1 = (startDeg - 90) * Math.PI / 180;
        const rad2 = (endDeg - 90) * Math.PI / 180;

        const x1 = CENTER + r1 * Math.cos(rad1);
        const y1 = CENTER + r1 * Math.sin(rad1);
        const x2 = CENTER + r2 * Math.cos(rad1);
        const y2 = CENTER + r2 * Math.sin(rad1);
        const x3 = CENTER + r2 * Math.cos(rad2);
        const y3 = CENTER + r2 * Math.sin(rad2);
        const x4 = CENTER + r1 * Math.cos(rad2);
        const y4 = CENTER + r1 * Math.sin(rad2);

        const largeArc = (endDeg - startDeg) > 180 ? 1 : 0;
        const d = `M ${x1} ${y1} L ${x2} ${y2} A ${r2} ${r2} 0 ${largeArc} 1 ${x3} ${y3} L ${x4} ${y4} A ${r1} ${r1} 0 ${largeArc} 0 ${x1} ${y1} Z`;
        paths.push({ d, groupKey });
    };

    const addDiamondSegment = (dist, angleDeg, length, width, groupKey) => {
        const rad = (angleDeg - 90) * Math.PI / 180;
        const perp = rad + Math.PI / 2;

        const bx = CENTER + (dist - length * 0.5) * Math.cos(rad);
        const by = CENTER + (dist - length * 0.5) * Math.sin(rad);
        const tx = CENTER + (dist + length * 0.5) * Math.cos(rad);
        const ty = CENTER + (dist + length * 0.5) * Math.sin(rad);

        const mx1 = CENTER + dist * Math.cos(rad) + (width * 0.5) * Math.cos(perp);
        const my1 = CENTER + dist * Math.sin(rad) + (width * 0.5) * Math.sin(perp);
        const mx2 = CENTER + dist * Math.cos(rad) - (width * 0.5) * Math.cos(perp);
        const my2 = CENTER + dist * Math.sin(rad) - (width * 0.5) * Math.sin(perp);

        const d = `M ${bx} ${by} L ${mx1} ${my1} L ${tx} ${ty} L ${mx2} ${my2} Z`;
        paths.push({ d, groupKey });
    };

    const addRingBackdrops = (r1, r2, count, groupKey) => {
        const step = 360 / count;
        for (let i = 0; i < count; i++) {
            addAnnularArcSegment(r1, r2, i * step, (i + 1) * step, groupKey);
        }
    };

    switch (templateId) {
        case 'surya-padma':
            // 1. Surya Padma Mandala - Ring Backdrops for all white region gaps
            addRingBackdrops(18, 52, 16, 'surya-bg-inner');
            addRingBackdrops(52, 74, 16, 'surya-bg-mid');
            addRingBackdrops(74, 114, 16, 'surya-bg-outer');

            for (let i = 0; i < 16; i++) {
                addPetalSegment(152, i * 22.5, 38, 30, 'surya-outer-scallops');
            }
            for (let i = 0; i < 16; i++) {
                addAnnularArcSegment(138, 152, i * 22.5, (i + 1) * 22.5, 'surya-red-rim');
            }
            for (let i = 0; i < 16; i++) {
                addAnnularArcSegment(114, 138, i * 22.5, (i + 1) * 22.5, 'surya-green-ring');
            }
            for (let i = 0; i < 12; i++) {
                addAnnularArcSegment(100, 114, i * 30, (i + 1) * 30, 'surya-gap-1');
            }
            for (let i = 0; i < 12; i++) {
                addPetalSegment(74, i * 30 + 15, 48, 26, 'surya-orange-tier');
            }
            for (let i = 0; i < 12; i++) {
                addPetalSegment(74, i * 30, 48, 26, 'surya-yellow-tier');
            }
            for (let i = 0; i < 8; i++) {
                addAnnularArcSegment(52, 74, i * 45, (i + 1) * 45, 'surya-inner-backdrop');
            }
            for (let i = 0; i < 6; i++) {
                addPetalSegment(18, i * 60, 36, 20, 'surya-white-core');
            }
            addCircleSegment(18, 'surya-center-bindu');
            for (let i = 0; i < 16; i++) {
                addAnnularArcSegment(190, 199, i * 22.5, (i + 1) * 22.5, 'surya-outer-floor');
            }
            break;

        case 'lotus-mandala':
            // 2. Sacred Lotus Mandala - Backdrops
            addRingBackdrops(24, 69, 16, 'lotus-bg-inner');
            addRingBackdrops(69, 120, 16, 'lotus-bg-mid');
            addRingBackdrops(120, 155, 16, 'lotus-bg-outer');

            addCircleSegment(24, 'lotus-center');
            for (let i = 0; i < 8; i++) {
                addPetalSegment(24, i * 45, 45, 24, 'lotus-inner-8');
            }
            for (let i = 0; i < 16; i++) {
                addAnnularArcSegment(69, 76, i * 22.5, (i + 1) * 22.5, 'lotus-gap-1');
            }
            for (let i = 0; i < 8; i++) {
                addPetalSegment(65, i * 45 + 22.5, 60, 36, 'lotus-mid-8');
            }
            for (let i = 0; i < 16; i++) {
                addAnnularArcSegment(120, 125, i * 22.5, (i + 1) * 22.5, 'lotus-gap-2');
            }
            for (let i = 0; i < 16; i++) {
                addAnnularArcSegment(120, 155, i * 22.5, (i + 1) * 22.5, 'lotus-ring-16');
            }
            for (let i = 0; i < 16; i++) {
                addPetalSegment(155, i * 22.5 + 11.25, 38, 28, 'lotus-scallop-16');
            }
            for (let i = 0; i < 16; i++) {
                addAnnularArcSegment(190, 199, i * 22.5, (i + 1) * 22.5, 'lotus-outer-floor');
            }
            break;

        case 'sunburst-12':
            // 3. Sunburst 12-Ray Mandala - Backdrops
            addRingBackdrops(28, 76, 12, 'sun-bg-inner');
            addRingBackdrops(76, 128, 12, 'sun-bg-mid');
            addRingBackdrops(128, 162, 24, 'sun-bg-outer');

            addCircleSegment(28, 'sun-center');
            for (let i = 0; i < 12; i++) {
                addPetalSegment(28, i * 30, 48, 18, 'sun-rays-12');
            }
            for (let i = 0; i < 12; i++) {
                addDiamondSegment(100, i * 30 + 15, 52, 26, 'sun-diamonds-12');
            }
            for (let i = 0; i < 24; i++) {
                addAnnularArcSegment(128, 162, i * 15, (i + 1) * 15, 'sun-flutes-24');
            }
            for (let i = 0; i < 24; i++) {
                addPetalSegment(162, i * 15 + 7.5, 32, 18, 'sun-outer-24');
            }
            break;

        case 'peacock-wheel':
            // 4. Peacock Wheel Mandala - Backdrops
            addRingBackdrops(26, 78, 16, 'peacock-bg-inner');
            addRingBackdrops(78, 130, 16, 'peacock-bg-mid');
            addRingBackdrops(130, 162, 16, 'peacock-bg-outer');

            addCircleSegment(26, 'peacock-center');
            for (let i = 0; i < 8; i++) {
                addPetalSegment(26, i * 45, 52, 28, 'peacock-eyes-8');
            }
            for (let i = 0; i < 8; i++) {
                addDiamondSegment(102, i * 45 + 22.5, 58, 36, 'peacock-fans-8');
            }
            for (let i = 0; i < 16; i++) {
                addAnnularArcSegment(130, 162, i * 22.5, (i + 1) * 22.5, 'peacock-ring-16');
            }
            for (let i = 0; i < 16; i++) {
                addPetalSegment(162, i * 22.5 + 11.25, 34, 26, 'peacock-waves-16');
            }
            break;

        case 'diamond-mandala':
            // 5. Diamond Star Mandala - Backdrops
            addRingBackdrops(0, 52, 16, 'diamond-bg-core');
            addRingBackdrops(52, 98, 16, 'diamond-bg-mid');
            addRingBackdrops(98, 142, 16, 'diamond-bg-outer');

            addDiamondSegment(0, 0, 48, 48, 'diamond-core');
            for (let i = 0; i < 8; i++) {
                addDiamondSegment(52, i * 45, 48, 28, 'diamond-tier1');
            }
            for (let i = 0; i < 8; i++) {
                addDiamondSegment(98, i * 45 + 22.5, 62, 36, 'diamond-tier2');
            }
            for (let i = 0; i < 16; i++) {
                addDiamondSegment(142, i * 22.5, 46, 24, 'diamond-tier3');
            }
            for (let i = 0; i < 16; i++) {
                addPetalSegment(162, i * 22.5 + 11.25, 32, 24, 'diamond-chevrons');
            }
            break;

        case 'concentric-rings':
            // 6. Concentric Bloom Mandala - Backdrops
            addRingBackdrops(22, 62, 16, 'bloom-bg-inner');
            addRingBackdrops(62, 110, 16, 'bloom-bg-mid');
            addRingBackdrops(110, 158, 16, 'bloom-bg-outer');

            addCircleSegment(22, 'bloom-center');
            for (let i = 0; i < 8; i++) {
                addPetalSegment(22, i * 45, 42, 22, 'bloom-tier-8');
            }
            for (let i = 0; i < 12; i++) {
                addPetalSegment(62, i * 30 + 15, 52, 24, 'bloom-tier-12');
            }
            for (let i = 0; i < 16; i++) {
                addPetalSegment(110, i * 22.5, 54, 26, 'bloom-tier-16');
            }
            for (let i = 0; i < 24; i++) {
                addPetalSegment(158, i * 15 + 7.5, 36, 20, 'bloom-tier-24');
            }
            break;

        case 'heritage-8':
            // 7. Heritage 8-Petal Mandala - Backdrops
            addRingBackdrops(26, 82, 16, 'heritage-bg-inner');
            addRingBackdrops(82, 128, 16, 'heritage-bg-mid');
            addRingBackdrops(128, 160, 16, 'heritage-bg-outer');

            addCircleSegment(26, 'heritage-center');
            for (let i = 0; i < 8; i++) {
                addPetalSegment(26, i * 45, 56, 32, 'heritage-hearts-8');
            }
            for (let i = 0; i < 8; i++) {
                addDiamondSegment(102, i * 45 + 22.5, 60, 36, 'heritage-chevrons-8');
            }
            for (let i = 0; i < 16; i++) {
                addAnnularArcSegment(128, 160, i * 22.5, (i + 1) * 22.5, 'heritage-arcs-16');
            }
            for (let i = 0; i < 16; i++) {
                addPetalSegment(160, i * 22.5 + 11.25, 34, 26, 'heritage-shells-16');
            }
            break;

        case 'festival-ring':
            // 8. Festival Floral Ring Mandala
            addCircleSegment(22, 'fest-center');
            for (let i = 0; i < 8; i++) {
                addPetalSegment(22, i * 45, 46, 24, 'fest-tier1');
            }
            for (let i = 0; i < 16; i++) {
                addAnnularArcSegment(68, 96, i * 22.5, (i + 1) * 22.5, 'fest-ring1');
            }
            for (let i = 0; i < 16; i++) {
                addDiamondSegment(116, i * 22.5, 44, 22, 'fest-diamonds');
            }
            for (let i = 0; i < 16; i++) {
                addAnnularArcSegment(136, 158, i * 22.5, (i + 1) * 22.5, 'fest-ring2');
            }
            for (let i = 0; i < 16; i++) {
                addPetalSegment(158, i * 22.5 + 11.25, 34, 26, 'fest-outer');
            }
            break;

        case 'star-weave':
            // 9. Geometric Star Weave Mandala
            addDiamondSegment(0, 0, 42, 42, 'weave-core');
            for (let i = 0; i < 8; i++) {
                addDiamondSegment(46, i * 45, 52, 28, 'weave-star-tier1');
            }
            for (let i = 0; i < 8; i++) {
                addPetalSegment(80, i * 45 + 22.5, 48, 30, 'weave-star-tier2');
            }
            for (let i = 0; i < 16; i++) {
                addAnnularArcSegment(120, 150, i * 22.5, (i + 1) * 22.5, 'weave-ring');
            }
            for (let i = 0; i < 16; i++) {
                addDiamondSegment(162, i * 22.5, 34, 22, 'weave-outer-chevrons');
            }
            break;

        case 'royal-core':
            // 10. Royal Core Mandala
            addCircleSegment(26, 'royal-center');
            for (let i = 0; i < 8; i++) {
                addPetalSegment(26, i * 45, 54, 30, 'royal-inner-8');
            }
            for (let i = 0; i < 16; i++) {
                addAnnularArcSegment(80, 115, i * 22.5, (i + 1) * 22.5, 'royal-band');
            }
            for (let i = 0; i < 16; i++) {
                addDiamondSegment(134, i * 22.5 + 11.25, 42, 26, 'royal-diamonds');
            }
            for (let i = 0; i < 16; i++) {
                addPetalSegment(155, i * 22.5, 38, 28, 'royal-outer-arches');
            }
            break;

        case 'peacock-plume':
            // 11. Peacock Plumes Mandala
            addCircleSegment(24, 'plume-center');
            for (let i = 0; i < 8; i++) {
                addPetalSegment(24, i * 45, 54, 26, 'plume-fans');
            }
            for (let i = 0; i < 8; i++) {
                addDiamondSegment(94, i * 45 + 22.5, 48, 30, 'plume-eyes');
            }
            for (let i = 0; i < 16; i++) {
                addAnnularArcSegment(122, 156, i * 22.5, (i + 1) * 22.5, 'plume-arcs');
            }
            for (let i = 0; i < 16; i++) {
                addPetalSegment(156, i * 22.5 + 11.25, 36, 26, 'plume-crests');
            }
            break;

        case 'spiral-bloom':
            // 12. Spiral Vortex Bloom Mandala
            addCircleSegment(20, 'spiral-center');
            for (let i = 0; i < 8; i++) {
                addPetalSegment(20, i * 45 + 15, 48, 22, 'spiral-arm-inner');
            }
            for (let i = 0; i < 12; i++) {
                addPetalSegment(66, i * 30 + 15, 54, 26, 'spiral-arm-mid');
            }
            for (let i = 0; i < 16; i++) {
                addAnnularArcSegment(120, 155, i * 22.5, (i + 1) * 22.5, 'spiral-ring');
            }
            for (let i = 0; i < 16; i++) {
                addPetalSegment(155, i * 22.5 + 10, 36, 24, 'spiral-flares');
            }
            break;

        default:
            break;
    }

    return paths;
}

// Generate symmetric coordinates for 8-fold radial symmetry
export function getSymmetricPoints(cx, cy, x, y, folds = 8) {
    const points = [];
    const dx = x - cx;
    const dy = y - cy;
    const r = Math.sqrt(dx * dx + dy * dy);
    let startAngle = Math.atan2(dy, dx);

    for (let i = 0; i < folds; i++) {
        const angle = startAngle + (2 * Math.PI / folds) * i;
        points.push({
            x: cx + r * Math.cos(angle),
            y: cy + r * Math.sin(angle)
        });
    }
    return points;
}

export function generateCustomMandalaPaths(config) {
    const outerPaths = [];
    const ringPaths = [];
    const midPaths = [];
    const corePaths = [];

    // Helper functions targeting specific arrays
    const addPetalSegment = (arr, dist, angleDeg, length, width, groupKey) => {
        const rad = (angleDeg - 90) * Math.PI / 180;
        const perp = rad + Math.PI / 2;
        const bx = CENTER + dist * Math.cos(rad);
        const by = CENTER + dist * Math.sin(rad);
        const tx = CENTER + (dist + length) * Math.cos(rad);
        const ty = CENTER + (dist + length) * Math.sin(rad);
        const mx1 = CENTER + (dist + length * 0.5) * Math.cos(rad) + (width * 0.5) * Math.cos(perp);
        const my1 = CENTER + (dist + length * 0.5) * Math.sin(rad) + (width * 0.5) * Math.sin(perp);
        const mx2 = CENTER + (dist + length * 0.5) * Math.cos(rad) - (width * 0.5) * Math.cos(perp);
        const my2 = CENTER + (dist + length * 0.5) * Math.sin(rad) - (width * 0.5) * Math.sin(perp);
        const d = `M ${bx} ${by} Q ${mx1} ${my1} ${tx} ${ty} Q ${mx2} ${my2} ${bx} ${by} Z`;
        arr.push({ d, groupKey });
    };

    const addAnnularArcSegment = (arr, r1, r2, startDeg, endDeg, groupKey) => {
        const rad1 = (startDeg - 90) * Math.PI / 180;
        const rad2 = (endDeg - 90) * Math.PI / 180;
        const x1 = CENTER + r1 * Math.cos(rad1);
        const y1 = CENTER + r1 * Math.sin(rad1);
        const x2 = CENTER + r2 * Math.cos(rad1);
        const y2 = CENTER + r2 * Math.sin(rad1);
        const x3 = CENTER + r2 * Math.cos(rad2);
        const y3 = CENTER + r2 * Math.sin(rad2);
        const x4 = CENTER + r1 * Math.cos(rad2);
        const y4 = CENTER + r1 * Math.sin(rad2);
        const largeArc = (endDeg - startDeg) > 180 ? 1 : 0;
        const d = `M ${x1} ${y1} L ${x2} ${y2} A ${r2} ${r2} 0 ${largeArc} 1 ${x3} ${y3} L ${x4} ${y4} A ${r1} ${r1} 0 ${largeArc} 0 ${x1} ${y1} Z`;
        arr.push({ d, groupKey });
    };

    const addDiamondSegment = (arr, dist, angleDeg, length, width, groupKey) => {
        const rad = (angleDeg - 90) * Math.PI / 180;
        const perp = rad + Math.PI / 2;
        const bx = CENTER + (dist - length * 0.5) * Math.cos(rad);
        const by = CENTER + (dist - length * 0.5) * Math.sin(rad);
        const tx = CENTER + (dist + length * 0.5) * Math.cos(rad);
        const ty = CENTER + (dist + length * 0.5) * Math.sin(rad);
        const mx1 = CENTER + dist * Math.cos(rad) + (width * 0.5) * Math.cos(perp);
        const my1 = CENTER + dist * Math.sin(rad) + (width * 0.5) * Math.sin(perp);
        const mx2 = CENTER + dist * Math.cos(rad) - (width * 0.5) * Math.cos(perp);
        const my2 = CENTER + dist * Math.sin(rad) - (width * 0.5) * Math.sin(perp);
        const d = `M ${bx} ${by} L ${mx1} ${my1} L ${tx} ${ty} L ${mx2} ${my2} Z`;
        arr.push({ d, groupKey });
    };

    const addCircleSegment = (arr, r, groupKey) => {
        const d = `M ${CENTER} ${CENTER - r} A ${r} ${r} 0 1 1 ${CENTER} ${CENTER + r} A ${r} ${r} 0 1 1 ${CENTER} ${CENTER - r} Z`;
        arr.push({ d, groupKey });
    };

    const outerScale = config.outerScale || 1.0;
    const ringScale = config.ringScale || 1.0;
    const midScale = config.midScale || 1.0;
    const coreScale = config.coreScale || 1.0;

    const rOuter = Math.min(170, 138 * ringScale);
    const rInner = Math.max(90, 116 * ringScale);
    const outerDist = 140 + 14 * outerScale;
    const outerLen = 34 * outerScale;
    const outerWid = 28 * outerScale;

    // Annular ring backdrops using evenodd fill rule for precise donut-shaped ring filling
    const addAnnularRingSegment = (arr, r1, r2, groupKey) => {
        const rInner = Math.min(r1, r2);
        const rOuter = Math.max(r1, r2);
        if (rInner <= 2) {
            addCircleSegment(arr, rOuter, groupKey);
            return;
        }
        const d = `M ${CENTER} ${CENTER - rOuter} A ${rOuter} ${rOuter} 0 1 1 ${CENTER} ${CENTER + rOuter} A ${rOuter} ${rOuter} 0 1 1 ${CENTER} ${CENTER - rOuter} Z M ${CENTER} ${CENTER - rInner} A ${rInner} ${rInner} 0 1 0 ${CENTER} ${CENTER + rInner} A ${rInner} ${rInner} 0 1 0 ${CENTER} ${CENTER - rInner} Z`;
        arr.push({ d, groupKey, fillRule: 'evenodd' });
    };

    // Compute all exact concentric border radii
    const ringRadii = [44 * coreScale];
    if (config.rings === 'double-ring') {
        ringRadii.push(rInner);
        ringRadii.push(rInner + (rOuter - rInner) * 0.5);
        ringRadii.push(rOuter);
    } else if (config.rings === 'single-ring') {
        ringRadii.push(rInner + 4);
        ringRadii.push(rOuter);
    } else if (config.rings === 'fluted-ring') {
        ringRadii.push(rInner + 8);
        ringRadii.push(rOuter + 2);
    } else {
        ringRadii.push(rInner);
        ringRadii.push(rOuter);
    }
    ringRadii.push(outerDist + outerLen);

    const sortedRadii = Array.from(new Set(ringRadii.filter(r => r > 0))).sort((a, b) => a - b);

    // 0. Fill Center Core
    addAnnularRingSegment(outerPaths, 0, sortedRadii[0], 'cust-bg-center');

    // Annular ring fill bands matching every concentric border line exactly
    for (let i = 0; i < sortedRadii.length - 1; i++) {
        addAnnularRingSegment(outerPaths, sortedRadii[i], sortedRadii[i + 1], `cust-bg-ring-${i}`);
    }

    // 1. Outer Border Motifs
    if (config.outer === 'scallop-16') {
        for (let i = 0; i < 16; i++) {
            addPetalSegment(outerPaths, outerDist, i * 22.5, outerLen, outerWid, 'cust-outer-scallop');
        }
    } else if (config.outer === 'sunburst-24') {
        for (let i = 0; i < 24; i++) {
            addPetalSegment(outerPaths, outerDist + 4, i * 15 + 7.5, outerLen * 0.95, outerWid * 0.6, 'cust-outer-sunburst');
        }
    } else if (config.outer === 'diamond-chevron') {
        for (let i = 0; i < 16; i++) {
            addDiamondSegment(outerPaths, outerDist + 6, i * 22.5, outerLen * 1.05, outerWid * 0.8, 'cust-outer-chevrons');
        }
    } else if (config.outer === 'crest-waves') {
        for (let i = 0; i < 16; i++) {
            addPetalSegment(outerPaths, outerDist + 2, i * 22.5 + 11.25, outerLen, outerWid * 0.9, 'cust-outer-waves');
        }
    } else if (config.outer === 'plain-circle') {
        const rOut = Math.min(195, outerDist + 8);
        addCircleSegment(outerPaths, rOut, 'cust-outer-ring');
    }

    // 2. Concentric Rings Guide Strokes
    sortedRadii.forEach((r, idx) => {
        if (r > 0 && r < outerDist + outerLen) {
            addCircleSegment(ringPaths, r, `cust-ring-guide-${idx}`);
        }
    });

    // 3. Mid Petal / Star Pattern
    const midDist = 58 + 14 * coreScale;
    const midLen = 46 * midScale;
    const midWid = 26 * midScale;

    if (config.mid === 'pointed-12') {
        for (let i = 0; i < 12; i++) {
            addPetalSegment(midPaths, midDist, i * 30, midLen, midWid, 'cust-mid-pointed');
        }
    } else if (config.mid === 'dual-interlock') {
        for (let i = 0; i < 12; i++) {
            addPetalSegment(midPaths, midDist, i * 30 + 15, midLen, midWid, 'cust-mid-dual-1');
        }
        for (let i = 0; i < 12; i++) {
            addPetalSegment(midPaths, midDist, i * 30, midLen, midWid, 'cust-mid-dual-2');
        }
    } else if (config.mid === 'diamond-star') {
        for (let i = 0; i < 8; i++) {
            addDiamondSegment(midPaths, midDist + 22, i * 45 + 22.5, midLen * 1.2, midWid * 1.3, 'cust-mid-diamonds');
        }
    } else if (config.mid === 'heart-petals') {
        for (let i = 0; i < 8; i++) {
            addPetalSegment(midPaths, midDist - 16, i * 45, midLen * 1.2, midWid * 1.2, 'cust-mid-hearts');
        }
    } else if (config.mid === 'peacock-fan') {
        for (let i = 0; i < 8; i++) {
            addDiamondSegment(midPaths, midDist + 20, i * 45 + 22.5, midLen * 1.1, midWid * 1.3, 'cust-mid-fans');
        }
    }

    // 4. Sacred Center Core Motifs
    if (config.core === 'ganapathi') {
        addCircleSegment(corePaths, 44, 'cust-core-backdrop');
        corePaths.push({ d: `M ${CENTER - 10} ${CENTER - 16} L ${CENTER} ${CENTER - 32} L ${CENTER + 10} ${CENTER - 16} Z`, groupKey: 'cust-ganesh-crown' });
        corePaths.push({ d: `M ${CENTER - 8} ${CENTER - 10} C ${CENTER - 26} ${CENTER - 12} ${CENTER - 28} ${CENTER + 12} ${CENTER - 10} ${CENTER + 15} Z`, groupKey: 'cust-ganesh-left-ear' });
        corePaths.push({ d: `M ${CENTER + 8} ${CENTER - 10} C ${CENTER + 26} ${CENTER - 12} ${CENTER + 28} ${CENTER + 12} ${CENTER + 10} ${CENTER + 15} Z`, groupKey: 'cust-ganesh-right-ear' });
        corePaths.push({ d: `M ${CENTER - 4} ${CENTER - 6} C ${CENTER - 2} ${CENTER + 12} ${CENTER - 12} ${CENTER + 28} ${CENTER + 2} ${CENTER + 32} C ${CENTER + 14} ${CENTER + 34} ${CENTER + 20} ${CENTER + 22} ${CENTER + 16} ${CENTER + 15} C ${CENTER + 12} ${CENTER + 8} ${CENTER + 4} ${CENTER + 10} ${CENTER + 4} ${CENTER + 14} C ${CENTER + 4} ${CENTER + 18} ${CENTER + 10} ${CENTER + 18} ${CENTER + 10} ${CENTER + 14} C ${CENTER + 10} ${CENTER + 6} ${CENTER} ${CENTER - 2} ${CENTER + 2} ${CENTER - 6} Z`, groupKey: 'cust-ganesh-trunk' });
        const tY = CENTER - 14;
        corePaths.push({ d: `M ${CENTER} ${tY - 3} A 3 3 0 1 1 ${CENTER} ${tY + 3} A 3 3 0 1 1 ${CENTER} ${tY - 3} Z`, groupKey: 'cust-ganesh-tilak' });
    } else if (config.core === 'lotus') {
        addCircleSegment(corePaths, 44, 'cust-core-backdrop');
        for (let i = 0; i < 8; i++) {
            addPetalSegment(corePaths, 14, i * 45, 30, 18, 'cust-lotus-core-petals');
        }
        addCircleSegment(corePaths, 14, 'cust-lotus-core-bindu');
    } else if (config.core === 'nilavilakku') {
        addCircleSegment(corePaths, 44, 'cust-core-backdrop');
        corePaths.push({ d: `M ${CENTER} ${CENTER - 34} Q ${CENTER + 8} ${CENTER - 22} ${CENTER} ${CENTER - 14} Q ${CENTER - 8} ${CENTER - 22} ${CENTER} ${CENTER - 34} Z`, groupKey: 'cust-lamp-flame' });
        corePaths.push({ d: `M ${CENTER - 16} ${CENTER - 8} C ${CENTER - 16} ${CENTER + 4} ${CENTER + 16} ${CENTER + 4} ${CENTER + 16} ${CENTER - 8} Z`, groupKey: 'cust-lamp-bowl' });
        corePaths.push({ d: `M ${CENTER - 3} ${CENTER + 4} L ${CENTER + 3} ${CENTER + 4} L ${CENTER + 3} ${CENTER + 24} L ${CENTER - 3} ${CENTER + 24} Z`, groupKey: 'cust-lamp-stem' });
        corePaths.push({ d: `M ${CENTER - 18} ${CENTER + 32} C ${CENTER - 18} ${CENTER + 24} ${CENTER + 18} ${CENTER + 24} ${CENTER + 18} ${CENTER + 32} Z`, groupKey: 'cust-lamp-base' });
    } else if (config.core === 'peacock') {
        addCircleSegment(corePaths, 44, 'cust-core-backdrop');
        for (let i = 0; i < 6; i++) {
            addPetalSegment(corePaths, 14, i * 60, 28, 16, 'cust-peacock-plumes');
        }
        addCircleSegment(corePaths, 12, 'cust-peacock-eye');
    } else if (config.core === 'jasmine') {
        addCircleSegment(corePaths, 44, 'cust-core-backdrop');
        for (let i = 0; i < 6; i++) {
            addPetalSegment(corePaths, 16, i * 60, 28, 18, 'cust-core-jasmine');
        }
        addCircleSegment(corePaths, 16, 'cust-core-bindu');
    } else if (config.core === 'diamond') {
        addDiamondSegment(corePaths, 0, 0, 48, 48, 'cust-core-diamond');
        for (let i = 0; i < 8; i++) {
            addDiamondSegment(corePaths, 48, i * 45, 42, 24, 'cust-core-diamond-tier');
        }
    } else if (config.core === 'circle') {
        addCircleSegment(corePaths, 44, 'cust-core-outer-circle');
        addCircleSegment(corePaths, 24, 'cust-core-mid-circle');
        addCircleSegment(corePaths, 10, 'cust-core-inner-bindu');
    }

    return {
        outerPaths,
        ringPaths,
        midPaths,
        corePaths,
        coreScale
    };
}

