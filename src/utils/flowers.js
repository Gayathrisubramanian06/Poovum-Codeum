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
            { name: 'Pure White', hex: '#ffffff', center: '#16a34a', border: '#cbd5e1' }
        ]
    },
    {
        id: 'thechi',
        nameEn: 'Thechi',
        nameMl: 'തെച്ചി',
        icon: '🌺',
        description: 'Vibrant 4-petal Ixora flower',
        varieties: [
            { name: 'Scarlet Red', hex: '#dc2626', center: '#fca5a5', border: '#991b1b' },
            { name: 'Golden Yellow', hex: '#facc15', center: '#854d0e', border: '#ca8a04' },
            { name: 'Coral Orange', hex: '#ea580c', center: '#fed7aa', border: '#9a3412' }
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
            { name: 'Warm Orange', hex: '#f97316', center: '#c2410c', border: '#7c2d12' },
            { name: 'Pure White', hex: '#ffffff', center: '#facc15', border: '#cbd5e1' }
        ]
    },
    {
        id: 'rose',
        nameEn: 'Rose',
        nameMl: 'റോസ് / പനിനീർ',
        icon: '🌹',
        description: 'Layered fragrant Rose petals',
        varieties: [
            { name: 'Rose Red', hex: '#e11d48', center: '#881337', border: '#9f1239' },
            { name: 'Paneer Pink', hex: '#f472b6', center: '#be185d', border: '#db2777' }
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
            { name: 'Lotus Pink', hex: '#fb7185', center: '#facc15', border: '#e11d48' },
            { name: 'Sacred White', hex: '#ffffff', center: '#facc15', border: '#cbd5e1' }
        ]
    },
    {
        id: 'chembarathi',
        nameEn: 'Chembarathi',
        nameMl: 'ചെമ്പരത്തി',
        icon: '🌺',
        description: 'Classic 5-petal flared Hibiscus',
        varieties: [
            { name: 'Crimson Red', hex: '#dc2626', center: '#7f1d1d', border: '#991b1b', stamen: '#fbbf24' },
            { name: 'Bright Pink', hex: '#ec4899', center: '#831843', border: '#be185d', stamen: '#fde047' }
        ]
    },
    {
        id: 'pinwheel',
        nameEn: 'Pinwheel (Nanthyarvattom)',
        nameMl: 'നന്ത്യാർവട്ടം',
        icon: '💮',
        description: 'Fragrant 5-petal pinwheel Crape Jasmine',
        varieties: [
            { name: 'Pure White', hex: '#ffffff', center: '#facc15', border: '#cbd5e1' },
            { name: 'Soft Cream', hex: '#fef3c7', center: '#eab308', border: '#e2e8f0' }
        ]
    },
    {
        id: 'backdrops',
        nameEn: 'Leaves & Earth Tones',
        nameMl: 'ഇലകളും പശ്ചാത്തലവും',
        icon: '🍃',
        description: 'Plantain leaf green and earthy background tones',
        varieties: [
            { name: 'Tulsi Green', hex: '#14532d', center: '#22c55e', border: '#052e16' },
            { name: 'Forest Green', hex: '#1b4332', center: '#40916c', border: '#081c15' },
            { name: 'Earth Brown', hex: '#4e3620', center: '#8c6239', border: '#2b1d0c' },
            { name: 'Dark Clay', hex: '#382314', center: '#6f4e37', border: '#1f130b' },
            { name: 'Temple Ochre', hex: '#b45309', center: '#f59e0b', border: '#78350f' }
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
