import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { generateCustomMandalaPaths } from '../../utils/mandalas';

const CENTER = 200;

function MotifPreview({ category, shape }) {
    const config = {
        core: category === 'core' ? shape : 'none',
        coreScale: 1.0,
        mid: category === 'mid' ? shape : 'none',
        midScale: 1.0,
        rings: category === 'rings' ? shape : 'none',
        ringScale: 1.0,
        outer: category === 'outer' ? shape : 'none',
        outerScale: 1.0
    };

    const { outerPaths, ringPaths, midPaths, corePaths } = generateCustomMandalaPaths(config);

    let viewBox = "0 0 400 400";
    let paths = [];

    if (category === 'core') {
        viewBox = "136 136 128 128";
        paths = corePaths;
    } else if (category === 'mid') {
        viewBox = "90 90 220 220";
        paths = midPaths;
    } else if (category === 'rings') {
        viewBox = "80 80 240 240";
        paths = ringPaths;
    } else if (category === 'outer') {
        viewBox = "40 40 320 320";
        paths = outerPaths;
    }

    if (shape === 'none') {
        return (
            <svg viewBox="0 0 100 100" className="shape-mini-svg" style={{ width: '38px', height: '38px', display: 'block' }}>
                <circle cx="50" cy="50" r="40" fill="none" stroke="#7a4a1e" strokeWidth="6" opacity="0.3" />
                <line x1="20" y1="20" x2="80" y2="80" stroke="#7a4a1e" strokeWidth="6" opacity="0.6" />
            </svg>
        );
    }

    return (
        <svg viewBox={viewBox} className="shape-mini-svg" style={{ width: '38px', height: '38px', display: 'block' }}>
            {paths.map((p, idx) => (
                <path
                    key={idx}
                    d={p.d}
                    fill="none"
                    stroke="#7a4a1e"
                    strokeWidth="3.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            ))}
        </svg>
    );
}

const BUILDER_LAYERS = {
    core: { key: 'core', scaleKey: 'coreScale', name: 'Center Sacred Motif', min: 0.55, max: 1.55 },
    mid: { key: 'mid', scaleKey: 'midScale', name: 'Mid Petals & Stars', min: 0.55, max: 1.55 },
    rings: { key: 'rings', scaleKey: 'ringScale', name: 'Backdrop Rings', min: 0.60, max: 1.45 },
    outer: { key: 'outer', scaleKey: 'outerScale', name: 'Outer Border Motifs', min: 0.60, max: 1.55 }
};

export default function CustomStep({ config, onChangeConfig, onStartColoring }) {
    const svgRef = useRef(null);
    const [hoveredLayer, setHoveredLayer] = useState(null);
    const [draggingState, setDraggingState] = useState(null); // { layer, startDist, startScale }
    const [tooltip, setTooltip] = useState({ show: false, text: '' });

    // Generate paths dynamically
    const { outerPaths, ringPaths, midPaths, corePaths, coreScale } = generateCustomMandalaPaths(config);

    // Compute preview radii for rendering guidelines and handles
    const coreR = 44 * config.coreScale;
    const midR = 58 + 14 * config.coreScale + 46 * config.midScale * 0.5;
    const ringR = Math.min(175, 138 * config.ringScale);
    const outerR = Math.min(195, 140 + 14 * config.outerScale + 34 * config.outerScale * 0.85);

    const getSvgPoint = (e) => {
        const svg = svgRef.current;
        if (!svg) return { x: 200, y: 200 };
        const rect = svg.getBoundingClientRect();
        return {
            x: ((e.clientX - rect.left) / (rect.width || 1)) * 400,
            y: ((e.clientY - rect.top) / (rect.height || 1)) * 400
        };
    };

    const getLayerFromDistance = (dist) => {
        if (dist <= coreR + 14) return 'core';
        if (dist <= (midR + ringR) * 0.5 - 6) return 'mid';
        if (dist <= (ringR + outerR) * 0.5 - 6) return 'rings';
        return 'outer';
    };

    const handlePointerDown = (e) => {
        const pt = getSvgPoint(e);
        const dx = pt.x - CENTER;
        const dy = pt.y - CENTER;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let targetLayer = e.target.closest('.drag-handle-group')?.getAttribute('data-layer');
        if (!targetLayer) {
            targetLayer = getLayerFromDistance(dist);
        }

        if (!targetLayer) return;

        const layerObj = BUILDER_LAYERS[targetLayer];
        setDraggingState({
            layer: targetLayer,
            startDist: Math.max(25, dist),
            startScale: config[layerObj.scaleKey] || 1.0
        });

        svgRef.current.setPointerCapture(e.pointerId);

        setTooltip({
            show: true,
            text: `✨ ${layerObj.name}: ${(config[layerObj.scaleKey] || 1.0).toFixed(2)}×`
        });
    };

    const handlePointerMove = (e) => {
        const pt = getSvgPoint(e);
        const dx = pt.x - CENTER;
        const dy = pt.y - CENTER;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (draggingState) {
            const { layer, startDist, startScale } = draggingState;
            const layerObj = BUILDER_LAYERS[layer];

            const deltaDist = dist - startDist;
            let newScale = startScale + deltaDist * 0.012;
            newScale = Math.max(layerObj.min, Math.min(layerObj.max, newScale));
            newScale = Math.round(newScale * 100) / 100;

            onChangeConfig(prev => ({
                ...prev,
                [layerObj.scaleKey]: newScale
            }));

            setTooltip({
                show: true,
                text: `✨ ${layerObj.name}: ${newScale.toFixed(2)}×`
            });
        } else {
            // Highlight guides on hover
            const hover = getLayerFromDistance(dist);
            setHoveredLayer(hover);
        }
    };

    const handlePointerUp = () => {
        if (!draggingState) return;
        setDraggingState(null);
        setHoveredLayer(null);
        setTimeout(() => setTooltip(prev => ({ ...prev, show: false })), 800);
    };

    const handleReset = () => {
        onChangeConfig({
            core: config.core,
            coreScale: 1.0,
            mid: config.mid,
            midScale: 1.0,
            rings: config.rings,
            ringScale: 1.0,
            outer: config.outer,
            outerScale: 1.0
        });
        setTooltip({ show: true, text: '✨ Reset all sizes to 1.0×' });
        setTimeout(() => setTooltip(prev => ({ ...prev, show: false })), 1200);
    };

    // Diagonal handle rendering helpers
    const getHandleCoords = (radius) => {
        const rad = (-45 * Math.PI) / 180;
        return {
            x: CENTER + radius * Math.cos(rad),
            y: CENTER + radius * Math.sin(rad)
        };
    };

    const coreH = getHandleCoords(coreR);
    const midH = getHandleCoords(midR);
    const ringH = getHandleCoords(ringR);
    const outerH = getHandleCoords(outerR);

    return (
        <motion.section
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.28 }}
            id="customBuilderStep"
            className="w-full"
            style={{ display: 'block' }}
        >
            <div className="custom-builder-header">
                <h1>Design My Own Template</h1>
                <p className="subtitle">Select your favourite shapes and drag directly on the template to adjust sizes in real time.</p>
            </div>

            <div className="custom-builder-container">
                {/* Left: Shape Pickers */}
                <div className="custom-builder-controls">
                    {/* 1. Center Sacred Motif */}
                    <div className="builder-group">
                        <label className="builder-label" style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--brown-dark)', marginBottom: '6px' }}>1. Center Sacred Motif</label>
                        <div className="builder-options visual-shape-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                            {['ganapathi', 'lotus', 'nilavilakku', 'peacock', 'jasmine', 'diamond', 'circle'].map(shape => (
                                <button
                                    key={shape}
                                    className={`builder-shape-card ${config.core === shape ? 'active' : ''}`}
                                    onClick={() => onChangeConfig(prev => ({ ...prev, core: shape }))}
                                    title={shape}
                                    type="button"
                                >
                                    <MotifPreview category="core" shape={shape} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 2. Mid Ring Motifs */}
                    <div className="builder-group">
                        <label className="builder-label" style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--brown-dark)', marginBottom: '6px', marginTop: '14px' }}>2. Mid Petal / Star Pattern</label>
                        <div className="builder-options visual-shape-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                            {['pointed-12', 'dual-interlock', 'diamond-star', 'heart-petals', 'peacock-fan'].map(shape => (
                                <button
                                    key={shape}
                                    className={`builder-shape-card ${config.mid === shape ? 'active' : ''}`}
                                    onClick={() => onChangeConfig(prev => ({ ...prev, mid: shape }))}
                                    title={shape}
                                    type="button"
                                >
                                    <MotifPreview category="mid" shape={shape} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 3. Rings */}
                    <div className="builder-group">
                        <label className="builder-label" style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--brown-dark)', marginBottom: '6px', marginTop: '14px' }}>3. Concentric Rings</label>
                        <div className="builder-options visual-shape-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                            {['double-ring', 'single-ring', 'fluted-ring', 'none'].map(shape => (
                                <button
                                    key={shape}
                                    className={`builder-shape-card ${config.rings === shape ? 'active' : ''}`}
                                    onClick={() => onChangeConfig(prev => ({ ...prev, rings: shape }))}
                                    title={shape}
                                    type="button"
                                >
                                    <MotifPreview category="rings" shape={shape} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 4. Outer Border */}
                    <div className="builder-group">
                        <label className="builder-label" style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--brown-dark)', marginBottom: '6px', marginTop: '14px' }}>4. Outer Border Motifs</label>
                        <div className="builder-options visual-shape-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                            {['scallop-16', 'sunburst-24', 'diamond-chevron', 'crest-waves', 'plain-circle'].map(shape => (
                                <button
                                    key={shape}
                                    className={`builder-shape-card ${config.outer === shape ? 'active' : ''}`}
                                    onClick={() => onChangeConfig(prev => ({ ...prev, outer: shape }))}
                                    title={shape}
                                    type="button"
                                >
                                    <MotifPreview category="outer" shape={shape} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Live Interactive SVG Viewport */}
                <div className="custom-builder-preview-box">
                    <div className="preview-header-bar">
                        <span className="preview-label">Live Interactive Template Studio</span>
                        <button
                            type="button"
                            onClick={handleReset}
                            className="builder-reset-btn"
                            title="Reset all ring sizes back to default"
                        >
                            ↺ Reset Sizes
                        </button>
                    </div>

                    <div className="drag-instruction-pill">
                        <span>🖐️</span> <strong>Click &amp; Drag</strong> outward to enlarge, inward to shrink
                    </div>

                    <div
                        className={`custom-preview-svg-wrapper large-canvas-preview ${draggingState ? 'is-dragging' : ''}`}
                        id="customBuilderWrapper"
                    >
                        {/* Interactive Drag Tooltip */}
                        <div className={`builder-drag-tooltip ${tooltip.show ? 'show' : ''}`}>
                            {tooltip.text}
                        </div>

                        <svg
                            ref={svgRef}
                            id="customBuilderPreviewSvg"
                            viewBox="0 0 400 400"
                            width="500"
                            height="500"
                            onPointerDown={handlePointerDown}
                            onPointerMove={handlePointerMove}
                            onPointerUp={handlePointerUp}
                            onPointerCancel={handlePointerUp}
                            style={{ touchAction: 'none' }}
                        >
                            {/* Layer 1: Outer Border */}
                            {outerPaths.map((p, idx) => (
                                <path key={`outer-${idx}`} d={p.d} fill="none" stroke="#7a4a1e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            ))}

                            {/* Layer 2: Concentric Rings */}
                            {ringPaths.map((p, idx) => (
                                <path key={`ring-${idx}`} d={p.d} fill="none" stroke="#7a4a1e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            ))}

                            {/* Layer 3: Mid Petal / Star Pattern */}
                            {midPaths.map((p, idx) => (
                                <path key={`mid-${idx}`} d={p.d} fill="none" stroke="#7a4a1e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            ))}

                            {/* Layer 4: Center Core Motif (Scalable Core Group) */}
                            <g transform={`translate(${CENTER}, ${CENTER}) scale(${coreScale}) translate(-${CENTER}, -${CENTER})`}>
                                {corePaths.map((p, idx) => (
                                    <path key={`core-${idx}`} d={p.d} fill="none" stroke="#7a4a1e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                ))}
                            </g>

                            {/* Guideline Overlay Circles */}
                            <circle cx={CENTER} cy={CENTER} r={coreR} className={`drag-guide-ring ${draggingState?.layer === 'core' ? 'active' : hoveredLayer === 'core' ? 'hovered' : ''}`} />
                            <circle cx={CENTER} cy={CENTER} r={midR} className={`drag-guide-ring ${draggingState?.layer === 'mid' ? 'active' : hoveredLayer === 'mid' ? 'hovered' : ''}`} />
                            <circle cx={CENTER} cy={CENTER} r={ringR} className={`drag-guide-ring ${draggingState?.layer === 'rings' ? 'active' : hoveredLayer === 'rings' ? 'hovered' : ''}`} />
                            <circle cx={CENTER} cy={CENTER} r={outerR} className={`drag-guide-ring ${draggingState?.layer === 'outer' ? 'active' : hoveredLayer === 'outer' ? 'hovered' : ''}`} />

                            {/* Drag Handles (top-right diagonal) */}
                            {/* Core Handle */}
                            <g className={`drag-handle-group ${draggingState?.layer === 'core' ? 'active' : ''}`} data-layer="core" transform={`translate(${coreH.x}, ${coreH.y})`}>
                                <circle r="8.5" className="drag-handle-outer" />
                                <circle r="3.5" className="drag-handle-inner" />
                            </g>
                            {/* Mid Handle */}
                            <g className={`drag-handle-group ${draggingState?.layer === 'mid' ? 'active' : ''}`} data-layer="mid" transform={`translate(${midH.x}, ${midH.y})`}>
                                <circle r="8.5" className="drag-handle-outer" />
                                <circle r="3.5" className="drag-handle-inner" />
                            </g>
                            {/* Rings Handle */}
                            <g className={`drag-handle-group ${draggingState?.layer === 'rings' ? 'active' : ''}`} data-layer="rings" transform={`translate(${ringH.x}, ${ringH.y})`}>
                                <circle r="8.5" className="drag-handle-outer" />
                                <circle r="3.5" className="drag-handle-inner" />
                            </g>
                            {/* Outer Handle */}
                            <g className={`drag-handle-group ${draggingState?.layer === 'outer' ? 'active' : ''}`} data-layer="outer" transform={`translate(${outerH.x}, ${outerH.y})`}>
                                <circle r="8.5" className="drag-handle-outer" />
                                <circle r="3.5" className="drag-handle-inner" />
                            </g>
                        </svg>
                    </div>

                    <p className="preview-hint">✨ Drag any ring or handle to adjust. Everything stays 100% symmetrically fillable.</p>
                    <button
                        type="button"
                        onClick={onStartColoring}
                        className="hero-btn-solid start-designing-btn"
                    >
                        ✨ Start Coloring This Template
                    </button>
                </div>
            </div>
        </motion.section>
    );
}
