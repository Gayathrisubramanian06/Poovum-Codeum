import React from 'react';

// 🌹 Rose (Panineer) — 3-Tier Layered Spiral Rose Petals
export function Rose({ size, color }) {
    return (
        <>
            {/* Outer 5 heart-shaped cup petals */}
            {Array.from({ length: 5 }).map((_, i) => {
                const angle = (360 / 5) * i;
                const d = `M 0 0 C ${-size * 0.44} ${-size * 0.18} ${-size * 0.38} ${-size * 0.54} 0 ${-size * 0.48} C ${size * 0.38} ${-size * 0.54} ${size * 0.44} ${-size * 0.18} 0 0 Z`;
                return (
                    <path
                        key={`outer-${i}`}
                        d={d}
                        fill={color.hex}
                        stroke={color.border || '#9f1239'}
                        strokeWidth="0.7"
                        transform={`rotate(${angle})`}
                    />
                );
            })}
            {/* Mid 5 curved overlapping petals */}
            {Array.from({ length: 5 }).map((_, i) => {
                const angle = (360 / 5) * i + 36;
                const d = `M 0 0 C ${-size * 0.3} ${-size * 0.1} ${-size * 0.26} ${-size * 0.38} 0 ${-size * 0.34} C ${size * 0.26} ${-size * 0.38} ${size * 0.3} ${-size * 0.1} 0 0 Z`;
                return (
                    <path
                        key={`mid-${i}`}
                        d={d}
                        fill={color.center || '#be185d'}
                        stroke={color.border || '#9f1239'}
                        strokeWidth="0.5"
                        opacity="0.95"
                        transform={`rotate(${angle})`}
                    />
                );
            })}
            {/* Inner spiral rosebud core */}
            <circle cx="0" cy="0" r={size * 0.15} fill={color.center || '#881337'} />
            <path
                d={`M ${-size * 0.08} ${size * 0.04} C ${-size * 0.12} ${-size * 0.1} ${size * 0.1} ${-size * 0.1} ${size * 0.08} ${size * 0.04} C ${size * 0.04} ${size * 0.1} ${-size * 0.02} ${size * 0.08} ${-size * 0.02} 0 Z`}
                fill={color.hex}
            />
        </>
    );
}

// 🌼 Jamanthi (Chrysanthemum) — Radiating Florets with Golden Center
export function Jamanthi({ size, color }) {
    return (
        <>
            {/* Outer 12 rounded petals */}
            {Array.from({ length: 12 }).map((_, i) => {
                const angle = (360 / 12) * i;
                return (
                    <ellipse
                        key={`outer-${i}`}
                        cx="0"
                        cy={-size * 0.32}
                        rx={size * 0.13}
                        ry={size * 0.34}
                        fill={color.hex}
                        stroke={color.border || '#ca8a04'}
                        strokeWidth="0.6"
                        transform={`rotate(${angle})`}
                    />
                );
            })}
            {/* Inner 12 offset petals */}
            {Array.from({ length: 12 }).map((_, i) => {
                const angle = (360 / 12) * i + 15;
                return (
                    <ellipse
                        key={`inner-${i}`}
                        cx="0"
                        cy={-size * 0.22}
                        rx={size * 0.11}
                        ry={size * 0.24}
                        fill={color.hex}
                        stroke={color.border || '#ca8a04'}
                        strokeWidth="0.5"
                        transform={`rotate(${angle})`}
                    />
                );
            })}
            {/* Golden Center Disc */}
            <circle cx="0" cy="0" r={size * 0.22} fill={color.center || '#d97706'} stroke="#78350f" strokeWidth="0.6" />
            <circle cx="0" cy="0" r={size * 0.12} fill="#fbbf24" />
        </>
    );
}

// 🪷 Sacred Lotus (Thamarappoovu) — Pointed Lotus Bloom with Golden Seed Pod
export function Lotus({ size, color }) {
    return (
        <>
            {/* Outer 8 pointed lotus petals */}
            {Array.from({ length: 8 }).map((_, i) => {
                const angle = (360 / 8) * i;
                const d = `M 0 0 C ${-size * 0.32} ${-size * 0.15} ${-size * 0.22} ${-size * 0.52} 0 ${-size * 0.56} C ${size * 0.22} ${-size * 0.52} ${size * 0.32} ${-size * 0.15} 0 0 Z`;
                return (
                    <path
                        key={`outer-${i}`}
                        d={d}
                        fill={color.hex}
                        stroke={color.border || '#e11d48'}
                        strokeWidth="0.7"
                        transform={`rotate(${angle})`}
                    />
                );
            })}
            {/* Inner 6 layered petals */}
            {Array.from({ length: 6 }).map((_, i) => {
                const angle = (360 / 6) * i + 30;
                const d = `M 0 0 C ${-size * 0.22} ${-size * 0.1} ${-size * 0.16} ${-size * 0.36} 0 ${-size * 0.4} C ${size * 0.16} ${-size * 0.36} ${size * 0.22} ${-size * 0.1} 0 0 Z`;
                return (
                    <path
                        key={`inner-${i}`}
                        d={d}
                        fill={color.hex}
                        stroke={color.border || '#e11d48'}
                        strokeWidth="0.5"
                        transform={`rotate(${angle})`}
                    />
                );
            })}
            {/* Golden Seed Pod */}
            <circle cx="0" cy="0" r={size * 0.18} fill={color.center || '#facc15'} stroke="#ca8a04" strokeWidth="0.7" />
            {/* Seed dots */}
            {Array.from({ length: 5 }).map((_, s) => {
                const sAngle = (360 / 5) * s;
                const sRad = (sAngle * Math.PI) / 180;
                const sx = size * 0.08 * Math.cos(sRad);
                const sy = size * 0.08 * Math.sin(sRad);
                return (
                    <circle key={`seed-${s}`} cx={sx} cy={sy} r={size * 0.025} fill="#854d0e" />
                );
            })}
        </>
    );
}

// 🏵️ Marigold (Chendumalli) — Multi-Tier Ruffled Festive Pom-Pom
export function Marigold({ size, color }) {
    return (
        <>
            {/* Tier 1: Outer 12 ruffled scalloped petals */}
            {Array.from({ length: 12 }).map((_, i) => {
                const angle = (360 / 12) * i;
                return (
                    <ellipse
                        key={`t1-${i}`}
                        cx="0"
                        cy={-size * 0.34}
                        rx={size * 0.18}
                        ry={size * 0.36}
                        fill={color.hex}
                        stroke={color.border || '#c2410c'}
                        strokeWidth="0.6"
                        transform={`rotate(${angle})`}
                    />
                );
            })}
            {/* Tier 2: Mid 12 ruffled petals */}
            {Array.from({ length: 12 }).map((_, i) => {
                const angle = (360 / 12) * i + 15;
                return (
                    <ellipse
                        key={`t2-${i}`}
                        cx="0"
                        cy={-size * 0.22}
                        rx={size * 0.15}
                        ry={size * 0.26}
                        fill={color.hex}
                        stroke={color.border || '#c2410c'}
                        strokeWidth="0.5"
                        transform={`rotate(${angle})`}
                    />
                );
            })}
            {/* Tier 3: Inner 8 ruffled core petals */}
            {Array.from({ length: 8 }).map((_, i) => {
                const angle = (360 / 8) * i + 22.5;
                return (
                    <ellipse
                        key={`t3-${i}`}
                        cx="0"
                        cy={-size * 0.12}
                        rx={size * 0.12}
                        ry={size * 0.16}
                        fill={color.center || '#ea580c'}
                        transform={`rotate(${angle})`}
                    />
                );
            })}
            {/* Deep Amber Pom-Pom Center */}
            <circle cx="0" cy="0" r={size * 0.16} fill={color.center || '#7c2d12'} />
        </>
    );
}

// 🌺 Chembarathi (Hibiscus) — 5 Flared Petals with Stamen
export function Chembarathi({ size, color }) {
    return (
        <>
            {/* 5 Broad flared petals */}
            {Array.from({ length: 5 }).map((_, i) => {
                const angle = (360 / 5) * i;
                return (
                    <ellipse
                        key={`petal-${i}`}
                        cx="0"
                        cy={-size * 0.28}
                        rx={size * 0.3}
                        ry={size * 0.44}
                        fill={color.hex}
                        stroke={color.border || '#991b1b'}
                        strokeWidth="0.7"
                        transform={`rotate(${angle})`}
                    />
                );
            })}
            {/* Deep crimson center nectar star */}
            <circle cx="0" cy="0" r={size * 0.22} fill={color.center || '#7f1d1d'} />
            {/* Golden Stamen Column */}
            <line x1="0" y1="0" x2={size * 0.22} y2={-size * 0.26} stroke={color.stamen || '#fbbf24'} strokeWidth="2.5" strokeLinecap="round" />
            {/* Pollen dots */}
            {Array.from({ length: 4 }).map((_, p) => {
                const cx = size * (0.16 + p * 0.03);
                const cy = -size * (0.18 + p * 0.03);
                return (
                    <circle key={`pollen-${p}`} cx={cx} cy={cy} r={size * 0.04} fill="#fde047" />
                );
            })}
        </>
    );
}

// 💮 Pinwheel Crape Jasmine (Nanthyarvattom) — 5 Swirling Blade Petals
export function Pinwheel({ size, color }) {
    return (
        <>
            {Array.from({ length: 5 }).map((_, i) => {
                const angle = (360 / 5) * i;
                const d = `M 0 0 C ${size * 0.14} ${-size * 0.18} ${size * 0.44} ${-size * 0.32} ${size * 0.42} ${-size * 0.52} C ${size * 0.22} ${-size * 0.54} ${-size * 0.04} ${-size * 0.36} 0 0 Z`;
                return (
                    <path
                        key={`blade-${i}`}
                        d={d}
                        fill={color.hex}
                        stroke={color.border || '#cbd5e1'}
                        strokeWidth="0.7"
                        transform={`rotate(${angle})`}
                    />
                );
            })}
            <circle cx="0" cy="0" r={size * 0.12} fill={color.center || '#facc15'} />
        </>
    );
}

// 🌺 Thechi (Ixora) — 4 Cross Diamond Petals
export function Thechi({ size, color }) {
    return (
        <>
            {Array.from({ length: 4 }).map((_, i) => {
                const angle = (360 / 4) * i + 45;
                const pts = `0,0 ${-size * 0.24},${-size * 0.3} 0,${-size * 0.54} ${size * 0.24},${-size * 0.3}`;
                return (
                    <polygon
                        key={`ixora-${i}`}
                        points={pts}
                        fill={color.hex}
                        stroke={color.border || '#991b1b'}
                        strokeWidth="0.7"
                        transform={`rotate(${angle})`}
                    />
                );
            })}
            <circle cx="0" cy="0" r={size * 0.14} fill={color.center || '#fde047'} />
        </>
    );
}

// 🌿 Thumba (White Leucas) — Delicate 4-Petal Cluster
export function Thumba({ size, color }) {
    return (
        <>
            {Array.from({ length: 4 }).map((_, i) => {
                const angle = (360 / 4) * i;
                const d = `M 0 0 Q ${-size * 0.18} ${-size * 0.3} 0 ${-size * 0.52} Q ${size * 0.18} ${-size * 0.3} 0 0 Z`;
                return (
                    <path
                        key={`cluster-${i}`}
                        d={d}
                        fill={color.hex}
                        stroke={color.border || '#cbd5e1'}
                        strokeWidth="0.6"
                        transform={`rotate(${angle})`}
                    />
                );
            })}
            <circle cx="0" cy="0" r={size * 0.16} fill={color.center || '#16a34a'} />
        </>
    );
}

// 🍃 Leaves & Earth Flake
export function Leaf({ size, color }) {
    const d = `M 0 ${-size * 0.4} Q ${size * 0.3} 0 0 ${size * 0.4} Q ${-size * 0.3} 0 0 ${-size * 0.4} Z`;
    return (
        <path
            d={d}
            fill={color.hex}
            stroke={color.border || 'rgba(0,0,0,0.18)'}
            strokeWidth="0.6"
        />
    );
}

// Universal unified entry renderer
export function FlowerRenderer({ type, size, color, rotation }) {
    const rot = rotation || 0;
    
    const renderCore = () => {
        switch (type) {
            case 'rose':
                return <Rose size={size} color={color} />;
            case 'jamanthi':
                return <Jamanthi size={size} color={color} />;
            case 'lotus':
                return <Lotus size={size} color={color} />;
            case 'marigold':
                return <Marigold size={size} color={color} />;
            case 'chembarathi':
                return <Chembarathi size={size} color={color} />;
            case 'pinwheel':
                return <Pinwheel size={size} color={color} />;
            case 'thechi':
                return <Thechi size={size} color={color} />;
            case 'thumba':
                return <Thumba size={size} color={color} />;
            case 'backdrops':
                return <Leaf size={size} color={color} />;
            default:
                return <Marigold size={size} color={color} />;
        }
    };

    return (
        <g transform={`rotate(${rot})`}>
            {renderCore()}
        </g>
    );
}
