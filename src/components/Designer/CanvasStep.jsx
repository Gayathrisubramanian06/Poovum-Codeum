import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ONAM_FLOWERS } from '../../utils/flowers';
import { generateMandalaPaths, generateCustomMandalaPaths, getSymmetricPoints } from '../../utils/mandalas';
import { ImageTemplateEngine } from '../../utils/floodFill';
import { FlowerRenderer } from '../FlowerRenderer';

const CENTER = 200;
const CANVAS_SIZE = 400;
const SIZES = { small: 14, medium: 24, large: 36 };

export default function CanvasStep({ selectedTemplate, isImageTemplate, imageSrc, customConfig, onNavigate }) {
    // Designer States
    const [currentFlower, setCurrentFlower] = useState(ONAM_FLOWERS[4]); // Default: Marigold
    const [currentColor, setCurrentColor] = useState(ONAM_FLOWERS[4].varieties[0]); // Default: Bright Orange
    const [currentMode, setCurrentMode] = useState('shredded'); // 'shredded' (color fill) or 'whole' (stamp)
    const [isSymmetryActive, setIsSymmetryActive] = useState(true);
    const [symmetryFolds, setSymmetryFolds] = useState(8);
    const [currentSizeKey, setCurrentSizeKey] = useState('medium');

    // Drawing State stacks
    const [vectorFills, setVectorFills] = useState([]);
    const [stamps, setStamps] = useState([]);
    const [imageFillSrc, setImageFillSrc] = useState(null);
    const [placedHistory, setPlacedHistory] = useState([]); // Undo history metadata

    // Image Flood-Fill references
    const engineRef = useRef(null);
    const svgRef = useRef(null);
    const [imageReady, setImageReady] = useState(false);
    const [hoveredGroup, setHoveredGroup] = useState(null);
    const [canvasHint, setCanvasHint] = useState('Tap inside any bordered shape to color it!');

    // Modal state for publishing
    const [showPublish, setShowPublish] = useState(false);
    const [creatorName, setCreatorName] = useState('');
    const [pookalamTitle, setPookalamTitle] = useState('');
    const [creatorCity, setCreatorCity] = useState('');
    const [shareMessage, setShareMessage] = useState('');

    // Load template paths
    let paths = [];
    if (!isImageTemplate) {
        if (selectedTemplate === 'custom-diy') {
            const { outerPaths, ringPaths, midPaths, corePaths, coreScale } = generateCustomMandalaPaths(customConfig);
            // Combine vector paths, adding a scale property for core motif paths
            paths = [
                ...outerPaths.map(p => ({ ...p, layer: 'outer' })),
                ...ringPaths.map(p => ({ ...p, layer: 'rings' })),
                ...midPaths.map(p => ({ ...p, layer: 'mid' })),
                ...corePaths.map(p => ({ ...p, layer: 'core', scale: coreScale }))
            ];
        } else {
            paths = generateMandalaPaths(selectedTemplate);
        }
    }

    // Initialize fills list
    useEffect(() => {
        if (!isImageTemplate && paths.length > 0) {
            setVectorFills(Array(paths.length).fill(null));
        }
    }, [selectedTemplate, isImageTemplate]);

    // Initialize Image Template Engine if outline image loaded
    useEffect(() => {
        if (isImageTemplate && imageSrc) {
            const engine = new ImageTemplateEngine(CANVAS_SIZE);
            engineRef.current = engine;
            engine.init(imageSrc)
                .then((fillDataUrl) => {
                    setImageFillSrc(fillDataUrl);
                    setImageReady(true);
                })
                .catch((e) => {
                    console.error('Failed to binarize outline:', e);
                });
        }
    }, [isImageTemplate, imageSrc]);

    // Get SVG coordinate from click/pointer event
    const getSvgCoordinates = (e) => {
        const svg = svgRef.current;
        if (!svg) return { x: 200, y: 200 };
        const rect = svg.getBoundingClientRect();
        return {
            x: ((e.clientX - rect.left) / (rect.width || 1)) * CANVAS_SIZE,
            y: ((e.clientY - rect.top) / (rect.height || 1)) * CANVAS_SIZE
        };
    };

    // Vector Path click filling
    const handleVectorPathClick = (e, index, groupKey) => {
        e.stopPropagation();

        if (currentMode === 'whole') {
            // Stamp instead of fill
            const pt = getSvgCoordinates(e);
            stampFlowersAt(pt.x, pt.y);
            return;
        }

        // Fill path
        const nextFills = [...vectorFills];
        const nextHistory = [...placedHistory];

        if (isSymmetryActive && groupKey) {
            // Find all indices sharing same groupKey
            const affectedIndices = [];
            const prevColors = [];
            paths.forEach((p, idx) => {
                if (p.groupKey === groupKey) {
                    affectedIndices.push(idx);
                    prevColors.push(nextFills[idx]);
                    nextFills[idx] = currentColor.hex;
                }
            });

            setVectorFills(nextFills);
            nextHistory.push({
                type: 'vector-fill',
                indices: affectedIndices,
                prevColors,
                nextColor: currentColor.hex
            });
            setCanvasHint(`✨ Filled ${affectedIndices.length} shapes with ${currentColor.name}!`);
        } else {
            const prevColor = nextFills[index];
            nextFills[index] = currentColor.hex;
            setVectorFills(nextFills);
            nextHistory.push({
                type: 'vector-fill',
                indices: [index],
                prevColors: [prevColor],
                nextColor: currentColor.hex
            });
            setCanvasHint(`✨ Colored shape with ${currentColor.name}!`);
        }

        setPlacedHistory(nextHistory);
    };

    // stamp petal drawing
    const stampFlowersAt = (x, y) => {
        const size = SIZES[currentSizeKey];
        const randomRot = Math.random() * 360;
        const newStamps = [...stamps];
        const batchIds = [];

        if (isSymmetryActive) {
            const symPoints = getSymmetricPoints(CENTER, CENTER, x, y, symmetryFolds);
            symPoints.forEach((pt, idx) => {
                const id = `stamp-${Date.now()}-${idx}-${Math.random()}`;
                batchIds.push(id);
                // Radial rotation alignment
                const baseRot = (idx * (360 / symmetryFolds)) + randomRot;
                newStamps.push({
                    id,
                    cx: pt.x,
                    cy: pt.y,
                    rotation: baseRot,
                    type: currentFlower.id,
                    color: currentColor,
                    size
                });
            });
            setCanvasHint(`🌸 Symmetrically stamped ${symmetryFolds} ${currentFlower.nameEn} blooms!`);
        } else {
            const id = `stamp-${Date.now()}-${Math.random()}`;
            batchIds.push(id);
            newStamps.push({
                id,
                cx: x,
                cy: y,
                rotation: randomRot,
                type: currentFlower.id,
                color: currentColor,
                size
            });
            setCanvasHint(`🌸 Stamped ${currentFlower.nameEn} bloom!`);
        }

        setStamps(newStamps);
        setPlacedHistory(prev => [...prev, { type: 'stamp-batch', ids: batchIds }]);
    };

    // Canvas image template flood filling
    const handleCanvasPointerDown = (e) => {
        const pt = getSvgCoordinates(e);

        if (currentMode === 'whole') {
            stampFlowersAt(pt.x, pt.y);
            return;
        }

        if (isImageTemplate && engineRef.current && imageReady) {
            const engine = engineRef.current;
            const prevSnapshot = engine.getFillState();
            const masks = [];
            const designCenter = engine.getCenterOfDesign();

            if (isSymmetryActive) {
                const symPoints = getSymmetricPoints(designCenter.x, designCenter.y, pt.x, pt.y, symmetryFolds);
                symPoints.forEach(p => {
                    const mask = engine.floodFill(p.x, p.y);
                    if (mask) masks.push(mask);
                });
            } else {
                const mask = engine.floodFill(pt.x, pt.y);
                if (mask) masks.push(mask);
            }

            if (masks.length > 0) {
                const nextUrl = engine.applyFills(masks, currentColor.hex);
                setImageFillSrc(nextUrl);
                setPlacedHistory(prev => [...prev, { type: 'image-fill', snapshot: prevSnapshot }]);
                setCanvasHint(`✨ Filled outline region with ${currentColor.name}!`);
            } else {
                // Shake canvas or hint out of bounds
                setCanvasHint(`⚠️ Click closer to the white outline area!`);
            }
        }
    };

    // Undo action
    const handleUndo = () => {
        if (placedHistory.length === 0) return;
        const nextHistory = [...placedHistory];
        const lastAction = nextHistory.pop();
        setPlacedHistory(nextHistory);

        if (lastAction.type === 'vector-fill') {
            const nextFills = [...vectorFills];
            lastAction.indices.forEach((idx, i) => {
                nextFills[idx] = lastAction.prevColors[i];
            });
            setVectorFills(nextFills);
            setCanvasHint(`↩️ Undid shape fill.`);
        } else if (lastAction.type === 'stamp-batch') {
            setStamps(prev => prev.filter(s => !lastAction.ids.includes(s.id)));
            setCanvasHint(`↩️ Undid flower stamp.`);
        } else if (lastAction.type === 'image-fill' && engineRef.current) {
            const engine = engineRef.current;
            const restoredUrl = engine.restoreState(lastAction.snapshot);
            setImageFillSrc(restoredUrl);
            setCanvasHint(`↩️ Undid outline fill.`);
        }
    };

    // Clear all actions
    const handleClear = () => {
        setPlacedHistory([]);
        setStamps([]);
        if (!isImageTemplate) {
            setVectorFills(Array(paths.length).fill(null));
        } else if (engineRef.current) {
            setImageFillSrc(engineRef.current.clear());
        }
        setCanvasHint(`🗑️ Cleared coloring board!`);
    };

    // Convert SVG to dataURL and download PNG
    const handleDownload = () => {
        const svgEl = svgRef.current;
        if (!svgEl) return;

        // XML Serializer
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgEl);
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const URL = window.URL || window.webkitURL || window;
        const blobURL = URL.createObjectURL(svgBlob);

        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 800;
            canvas.height = 800;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, 800, 800);

            const pngUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = 'my-pookalam-design.png';
            link.href = pngUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobURL);
        };
        img.src = blobURL;
    };

    // Helper to generate PNG blob and trigger custom actions
    const generatePNGAndAction = (actionCallback) => {
        const svgEl = svgRef.current;
        if (!svgEl) return;

        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgEl);
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const URL = window.URL || window.webkitURL || window;
        const blobURL = URL.createObjectURL(svgBlob);

        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 600;
            canvas.height = 600;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, 600, 600);

            canvas.toBlob((blob) => {
                actionCallback(blob, canvas.toDataURL('image/png'));
                URL.revokeObjectURL(blobURL);
            }, 'image/png');
        };
        img.src = blobURL;
    };

    // Publish to local community gallery
    const handlePublish = () => {
        setShareMessage('⏳ Publishing to Gallery...');
        generatePNGAndAction((blob, dataUrl) => {
            try {
                const raw = localStorage.getItem('pookalam_community_gallery');
                const list = raw ? JSON.parse(raw) : [];
                const newItem = {
                    id: `comm-${Date.now()}-${Math.random()}`,
                    title: pookalamTitle || 'Onam Rangoli',
                    creator: creatorName || 'Festive Designer',
                    city: creatorCity ? `${creatorCity} 🪔` : 'Kerala 🌸',
                    date: 'Aug 2026',
                    img: dataUrl,
                    likes: 0
                };
                list.unshift(newItem);
                localStorage.setItem('pookalam_community_gallery', JSON.stringify(list));

                setShareMessage('✨ Published to Community Gallery successfully!');
                setTimeout(() => {
                    setShowPublish(false);
                    onNavigate('gallery');
                    setShareMessage('');
                }, 1500);
            } catch (err) {
                console.error(err);
                setShareMessage('⚠️ Failed to save to local storage.');
            }
        });
    };

    // Copy PNG Image to clipboard
    const handleCopyImage = () => {
        setShareMessage('⏳ Copying image to clipboard...');
        generatePNGAndAction((blob) => {
            try {
                navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': blob })
                ]).then(() => {
                    setShareMessage('📋 Image copied directly to clipboard! You can paste (Ctrl+V) it in chat apps.');
                    setTimeout(() => setShareMessage(''), 4000);
                }).catch(e => {
                    console.error(e);
                    setShareMessage('⚠️ Browser blocked clipboard paste. Try downloading instead.');
                });
            } catch (err) {
                console.error(err);
                setShareMessage('⚠️ Copy to clipboard is not supported on this browser. Try downloading.');
            }
        });
    };

    // Share text and copy image to clipboard, then open WhatsApp Web/App link
    const handleWhatsApp = () => {
        setShareMessage('⏳ Preparing WhatsApp share...');
        // Open the window IMMEDIATELY on the click thread to avoid popup blocker!
        const whatsappWindow = window.open('', '_blank');
        if (whatsappWindow) {
            whatsappWindow.document.write('<p style="font-family:sans-serif;text-align:center;margin-top:40px;color:#7a4a1e;">Opening WhatsApp... Please wait 🪔</p>');
        }

        generatePNGAndAction((blob) => {
            const shareText = "Check out this Onam Pookalam I designed! 🪔🌸 Created using Onam Pookalam Designer.";
            
            // Native Share tray (perfect on mobile)
            if (navigator.share && navigator.canShare) {
                const file = new File([blob], 'my-pookalam.png', { type: 'image/png' });
                if (navigator.canShare({ files: [file] })) {
                    // Close the popup window since we are opening native share sheet
                    if (whatsappWindow) whatsappWindow.close();

                    navigator.share({
                        files: [file],
                        title: 'My Onam Pookalam',
                        text: shareText
                    })
                    .then(() => {
                        setShareMessage('✨ Shared successfully via WhatsApp!');
                        setTimeout(() => setShareMessage(''), 2500);
                    })
                    .catch(err => {
                        console.log('Native share failed/cancelled:', err);
                        // Re-open/update fallback
                        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
                        copyToClipboardFallback(blob);
                    });
                    return;
                }
            }

            // Fallback for desktop: update the open window location
            if (whatsappWindow) {
                whatsappWindow.location.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
            }
            copyToClipboardFallback(blob);
        });
    };

    const copyToClipboardFallback = (blob) => {
        try {
            navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
            ]).then(() => {
                setShareMessage('📋 Image copied directly to clipboard! You can paste (Ctrl+V) it in the chat.');
                setTimeout(() => setShareMessage(''), 4000);
            }).catch(() => {
                setShareMessage('');
            });
        } catch (e) {
            setShareMessage('');
        }
    };

    // Share text to Twitter/X
    const handleTwitter = () => {
        setShareMessage('⏳ Preparing Twitter share...');
        // Open the window IMMEDIATELY on the click thread to avoid popup blocker!
        const twitterWindow = window.open('', '_blank');
        if (twitterWindow) {
            twitterWindow.document.write('<p style="font-family:sans-serif;text-align:center;margin-top:40px;color:#7a4a1e;">Opening Twitter / X... Please wait 🪔</p>');
        }

        generatePNGAndAction((blob) => {
            const shareText = "Check out this Onam Pookalam I designed! 🪔🌸 #Onam #Pookalam #Kerala";
            const tweetUrl = "https://github.com/Gayathrisubramanian06/Poovum-Codeum";
            
            try {
                navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': blob })
                ]).catch(() => {});
            } catch (e) {}

            const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(tweetUrl)}`;
            if (twitterWindow) {
                twitterWindow.location.href = url;
            }
            setShareMessage('');
        });
    };

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            id="canvasStep"
            style={{ display: 'block' }}
        >
            <div className="designer-workspace">
                {/* Left: Flower Palette Sidebar */}
                <aside className="flower-sidebar">
                    <div className="sidebar-header">
                        <span className="sidebar-icon">🌸</span>
                        <div>
                            <h2 className="sidebar-title">Flower Palette</h2>
                            <span className="sidebar-subtitle">പൂക്കൾ തിരഞ്ഞെടുക്കുക</span>
                        </div>
                    </div>

                    <div className="active-flower-banner">
                        <div className="active-flower-indicator" style={{ backgroundColor: currentColor.hex }}></div>
                        <div className="active-flower-info">
                            <span className="active-flower-type">{currentFlower.icon} {currentFlower.nameEn} ({currentFlower.nameMl})</span>
                            <span className="active-flower-color">{currentColor.name}</span>
                        </div>
                    </div>

                    <div className="flower-categories">
                        {ONAM_FLOWERS.map(flower => (
                            <div
                                key={flower.id}
                                className={`flower-category-card ${flower.id === currentFlower.id ? 'selected' : ''}`}
                            >
                                <div className="flower-category-header">
                                    <span className="flower-category-icon">{flower.icon}</span>
                                    <div className="flower-category-names">
                                        <span className="flower-name-en">{flower.nameEn}</span>
                                        <span className="flower-name-ml">{flower.nameMl}</span>
                                    </div>
                                </div>

                                <div className="flower-swatches-grid">
                                    {flower.varieties.map(v => (
                                        <motion.button
                                            key={v.name}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.92 }}
                                            className={`flower-swatch-item ${currentColor.name === v.name && flower.id === currentFlower.id ? 'active' : ''}`}
                                            onClick={() => {
                                                setCurrentFlower(flower);
                                                setCurrentColor(v);
                                            }}
                                            type="button"
                                        >
                                            <div
                                                className="flower-swatch-circle"
                                                style={{
                                                    backgroundColor: v.hex,
                                                    borderColor: v.border || '#cbd5e1'
                                                }}
                                            />
                                            <span className="flower-swatch-name">{v.name}</span>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Right: Main Canvas coloring board */}
                <div className="canvas-workspace">
                    <div className="canvas-top-controls">
                        {/* Drawing mode */}
                        <div className="control-group">
                            <span className="control-label">Flower Form:</span>
                            <div className="form-row">
                                <button
                                    className={`form-btn ${currentMode === 'shredded' ? 'active' : ''}`}
                                    onClick={() => setCurrentMode('shredded')}
                                    type="button"
                                >
                                    ✂️ Shredded (Color Fill)
                                </button>
                                <button
                                    className={`form-btn ${currentMode === 'whole' ? 'active' : ''}`}
                                    onClick={() => setCurrentMode('whole')}
                                    type="button"
                                >
                                    🌸 Whole Flower
                                </button>
                            </div>
                        </div>

                        {/* Shadcn UI Switch Toggle for Symmetry */}
                        <div className="control-group switch-group">
                            <span className="switch-label" id="symmetryLabel">
                                {isSymmetryActive ? '✨ Symmetry: ON' : 'Symmetry: OFF'}
                            </span>
                            <label className="switch-container">
                                <input
                                    type="checkbox"
                                    id="btnSymmetry"
                                    className="switch-input"
                                    checked={isSymmetryActive}
                                    onChange={(e) => setIsSymmetryActive(e.target.checked)}
                                />
                                <span className="switch-track">
                                    <span className="switch-thumb" />
                                </span>
                            </label>
                        </div>

                        {/* Symmetry Folds selector */}
                        {isSymmetryActive && (
                            <div className="control-group" style={{ minWidth: '150px' }}>
                                <span className="control-label">Symmetry Folds:</span>
                                <div className="size-row" style={{ display: 'flex', gap: '3px' }}>
                                    {[4, 6, 8, 12, 16, 24].map(folds => (
                                        <button
                                            key={folds}
                                            className={`size-btn ${symmetryFolds === folds ? 'active' : ''}`}
                                            onClick={() => setSymmetryFolds(folds)}
                                            style={{ padding: '3px 5px', fontSize: '10.5px', minWidth: '26px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            type="button"
                                        >
                                            {folds}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Size controller */}
                        <div className="control-group">
                            <span className="control-label">Flower Size:</span>
                            <div className="size-row">
                                {['small', 'medium', 'large'].map(sz => (
                                    <button
                                        key={sz}
                                        className={`size-btn ${currentSizeKey === sz ? 'active' : ''}`}
                                        onClick={() => setCurrentSizeKey(sz)}
                                        type="button"
                                    >
                                        {sz.charAt(0).toUpperCase() + sz.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* SVG Canvas Board */}
                    <div className="canvas-shell">
                        <svg
                            ref={svgRef}
                            id="pookalamCanvas"
                            viewBox="0 0 400 400"
                            width="400"
                            height="400"
                            onPointerDown={handleCanvasPointerDown}
                            style={{ touchAction: 'none' }}
                        >
                            <defs>
                                <radialGradient id="floorGradient" cx="50%" cy="45%" r="70%">
                                    <stop offset="0%" stopColor="#fffaf0" />
                                    <stop offset="100%" stopColor="#f3e6c8" />
                                </radialGradient>
                            </defs>
                            <rect id="canvasBgRect" width="400" height="400" fill="url(#floorGradient)" />

                            {/* 1. Vector Fills Layer */}
                            {!isImageTemplate && (
                                <g id="vectorFillLayer">
                                    {paths.map((p, idx) => (
                                        <path
                                            key={`fill-${idx}`}
                                            d={p.d}
                                            fill={vectorFills[idx] || 'rgba(0,0,0,0)'}
                                            stroke="none"
                                            transform={p.scale ? `translate(${CENTER}, ${CENTER}) scale(${p.scale}) translate(-${CENTER}, -${CENTER})` : undefined}
                                        />
                                    ))}
                                </g>
                            )}

                            {/* 2. Image Fill layer (dataURL from engine) */}
                            {isImageTemplate && imageFillSrc && (
                                <g id="imageFillLayer">
                                    <image href={imageFillSrc} x="0" y="0" width="400" height="400" />
                                </g>
                            )}

                            {/* 3. Guide/Outline Layer (Image Outline overlay or Vector Outline paths) */}
                            <g id="guideLayer">
                                {!isImageTemplate ? (
                                    paths.map((p, idx) => (
                                        <path
                                            key={`border-${idx}`}
                                            d={p.d}
                                            className={`pookalam-segment ${hoveredGroup === p.groupKey ? 'symm-highlight' : ''}`}
                                            fill="rgba(255,255,255,0.01)"
                                            stroke="#2a1608"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            transform={p.scale ? `translate(${CENTER}, ${CENTER}) scale(${p.scale}) translate(-${CENTER}, -${CENTER})` : undefined}
                                            onMouseEnter={() => setHoveredGroup(p.groupKey)}
                                            onMouseLeave={() => setHoveredGroup(null)}
                                            onClick={(e) => handleVectorPathClick(e, idx, p.groupKey)}
                                        />
                                    ))
                                ) : (
                                    /* Multiply outline blending so shapes stand out above fills */
                                    <image href={imageSrc} x="0" y="0" width="400" height="400" opacity="0.32" style={{ mixBlendMode: 'multiply' }} />
                                )}
                            </g>

                            {/* 4. Flower Stamp Petals Layer */}
                            <g id="petalLayer">
                                {stamps.map(stamp => (
                                    <g
                                        key={stamp.id}
                                        transform={`translate(${stamp.cx}, ${stamp.cy})`}
                                    >
                                        <FlowerRenderer
                                            type={stamp.type}
                                            size={stamp.size}
                                            color={stamp.color}
                                            rotation={stamp.rotation}
                                        />
                                    </g>
                                ))}
                            </g>
                        </svg>

                        <p className="canvas-hint" id="canvasHint">{canvasHint}</p>
                    </div>

                    {/* Coloring board buttons */}
                    <div className="canvas-actions">
                        <button className="ghost-btn" onClick={handleUndo} title="Undo last action" type="button">
                            Undo ↩
                        </button>
                        <button className="ghost-btn" onClick={handleClear} title="Clear coloring board" type="button">
                            Clear 🗑
                        </button>
                        <button className="hero-btn-solid" onClick={handleDownload} title="Download PNG image" type="button">
                            Download 📥
                        </button>
                        <button className="ghost-btn" onClick={() => setShowPublish(true)} title="Publish to Gallery" type="button">
                            Share 🔗
                        </button>
                    </div>
                </div>
            </div>

            {/* Share & Publish Modal Dialog */}
            <AnimatePresence>
                {showPublish && (
                    <div className="modal-overlay show" style={{ display: 'flex' }} onClick={() => setShowPublish(false)}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="modal-card"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="modal-header">
                                <span className="modal-icon">🪔</span>
                                <div>
                                    <h3 className="modal-title">Share Your Pookalam</h3>
                                    <span className="modal-subtitle">Publish to showcase or share on social media!</span>
                                </div>
                            </div>

                            <div className="modal-form">
                                <div className="form-field">
                                    <label>Your Name <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        placeholder="Creator name"
                                        value={creatorName}
                                        onChange={e => setCreatorName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-field">
                                    <label>Pookalam Title</label>
                                    <input
                                        type="text"
                                        placeholder="Title (e.g. Royal Harvest)"
                                        value={pookalamTitle}
                                        onChange={e => setPookalamTitle(e.target.value)}
                                    />
                                </div>
                                <div className="form-field">
                                    <label>Your City / Location</label>
                                    <input
                                        type="text"
                                        placeholder="City (e.g. Kochi)"
                                        value={creatorCity}
                                        onChange={e => setCreatorCity(e.target.value)}
                                    />
                                </div>

                                <div className="modal-actions" style={{ marginTop: '16px' }}>
                                    <button
                                        className="ghost-btn"
                                        onClick={() => setShowPublish(false)}
                                        style={{ flex: 1 }}
                                        type="button"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="hero-btn-solid"
                                        onClick={handlePublish}
                                        style={{ flex: 1.5 }}
                                        type="button"
                                        disabled={!creatorName}
                                    >
                                        Publish to Gallery ✨
                                    </button>
                                </div>

                                <div style={{ borderTop: '1px solid rgba(122,74,30,0.08)', margin: '20px 0 16px', position: 'relative', textAlign: 'center' }}>
                                    <span style={{ background: '#ffffff', padding: '0 10px', fontSize: '11px', color: 'var(--brown-mid)', fontWeight: '600', position: 'relative', top: '-10px' }}>
                                        OR SHARE ON SOCIALS
                                    </span>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                                    <button
                                        type="button"
                                        className="ghost-btn"
                                        onClick={handleWhatsApp}
                                        style={{ padding: '10px 0', fontSize: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', borderColor: '#25D366', color: '#128C7E', borderRadius: '12px' }}
                                    >
                                        <span style={{ fontSize: '20px' }}>💬</span>
                                        <strong>WhatsApp</strong>
                                    </button>
                                    <button
                                        type="button"
                                        className="ghost-btn"
                                        onClick={handleTwitter}
                                        style={{ padding: '10px 0', fontSize: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', borderColor: '#1DA1F2', color: '#1A8CD8', borderRadius: '12px' }}
                                    >
                                        <span style={{ fontSize: '20px' }}>🐦</span>
                                        <strong>Twitter / X</strong>
                                    </button>
                                    <button
                                        type="button"
                                        className="ghost-btn"
                                        onClick={handleCopyImage}
                                        style={{ padding: '10px 0', fontSize: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', borderColor: '#dfc698', color: '#7a4a1e', borderRadius: '12px' }}
                                    >
                                        <span style={{ fontSize: '20px' }}>📋</span>
                                        <strong>Copy Image</strong>
                                    </button>
                                </div>

                                {shareMessage && (
                                    <p className="share-hint" style={{ marginTop: '14px', fontSize: '11.5px', color: 'var(--brown-mid)', textAlign: 'center', padding: '8px', background: 'rgba(242,193,78,0.08)', borderRadius: '8px', border: '1px solid rgba(242,193,78,0.18)' }}>
                                        {shareMessage}
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.section>
    );
}
