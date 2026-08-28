// ====================================================
// TRADITIONAL ONAM FLOWERS & AUTHENTIC PALETTES
// ====================================================

export const ONAM_FLOWERS = [
    {
        id: 'thumba',
        nameEn: 'Thumba',
        nameMl: 'തുമ്പ',
        icon: '🌿',
        description: 'Sacred white Onam flower',
        varieties: [
            { name: 'Pure White', hex: '#f8fafc', center: '#16a34a', border: '#94a3b8' }
        ]
    },
    {
        id: 'thechi',
        nameEn: 'Thechi',
        nameMl: 'തെച്ചി',
        icon: '🌺',
        description: 'Vibrant 4-petal Ixora flower',
        varieties: [
            { name: 'Scarlet Red', hex: '#dc2626', center: '#fca5a5', border: '#991b1b' }
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
            { name: 'Pure White', hex: '#f8fafc', center: '#facc15', border: '#cbd5e1' }
        ]
    },
    {
        id: 'rose',
        nameEn: 'Rose',
        nameMl: 'റോസ് / പനിനീർ',
        icon: '🌹',
        description: 'Layered fragrant Rose petals',
        varieties: [
            { name: 'Rose Pink', hex: '#f472b6', center: '#be185d', border: '#db2777' }
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
            { name: 'Lotus Pink', hex: '#fb7185', center: '#facc15', border: '#e11d48' }
        ]
    },
    {
        id: 'chembarathi',
        nameEn: 'Chembarathi',
        nameMl: 'ചെമ്പരത്തി',
        icon: '🌺',
        description: 'Classic 5-petal flared Hibiscus',
        varieties: [
            { name: 'Crimson Red', hex: '#c0392b', center: '#7f1d1d', border: '#922b21', stamen: '#fbbf24' }
        ]
    },
    {
        id: 'pinwheel',
        nameEn: 'Nanthyarvattom',
        nameMl: 'നന്ത്യാർവട്ടം',
        icon: '💮',
        description: 'Fragrant 5-petal pinwheel Crape Jasmine',
        varieties: [
            { name: 'Creamy White', hex: '#fef9ee', center: '#facc15', border: '#e2d9c4' }
        ]
    },
    {
        id: 'backdrops',
        nameEn: 'Leaf Green',
        nameMl: 'ഇലപ്പച്ച',
        icon: '🍃',
        description: 'Plantain leaf green backdrop',
        varieties: [
            { name: 'Leaf Green', hex: '#16a34a', center: '#22c55e', border: '#052e16' }
        ]
    }
];

export function hexToRgb(hex) {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255
    };
}
