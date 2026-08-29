import React from 'react';
import { motion } from 'framer-motion';
import { generateMandalaPaths, generateCustomMandalaPaths } from '../../utils/mandalas';

const DEFAULT_CUSTOM_CONFIG = {
    core: 'lotus-8',
    coreScale: 1.0,
    mid: 'star-12',
    midScale: 1.0,
    rings: 'double-ring',
    ringScale: 1.0,
    outer: 'diamond-chevron',
    outerScale: 1.0
};

export default function TemplateStep({ onSelectBrowse, onSelectUpload, onSelectCustom }) {
    const choosePaths = generateMandalaPaths('diamond-mandala');
    const { outerPaths, ringPaths, midPaths, corePaths, coreScale } = generateCustomMandalaPaths(DEFAULT_CUSTOM_CONFIG);
    const diyPaths = [...outerPaths, ...ringPaths, ...midPaths, ...corePaths];

    return (
        <motion.section
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.28 }}
            id="templateStep"
            className="w-full text-center"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '0 auto', textAlign: 'center', width: '100%' }}
        >
            <h1 style={{ textAlign: 'center', fontSize: 'clamp(1.6rem, 5vw, 2.4rem)', marginBottom: '8px', fontWeight: 800, color: 'var(--brown-dark, #5c3210)' }}>
                Design Your Pookalam
            </h1>
            <p className="subtitle" style={{ textAlign: 'center', margin: '0 auto 28px', fontSize: 'clamp(0.9rem, 2.5vw, 1.05rem)', color: '#684f27' }}>
                Select how you want to build your layout.
            </p>

            <div className="template-grid">
                {/* 1. Browse Templates */}
                <motion.button
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05, duration: 0.3 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="template-main-card"
                    onClick={onSelectBrowse}
                    type="button"
                >
                    <div className="template-card-icon-wrap">
                        <svg viewBox="0 0 400 400" className="template-card-svg">
                            {choosePaths.map((p, idx) => (
                                <path key={idx} d={p.d} fill="none" stroke="#7a4a1e" strokeWidth="2.5" />
                            ))}
                        </svg>
                    </div>
                    <div className="template-card-text">
                        <span className="template-card-title">
                            Browse Templates
                        </span>
                        <p className="template-card-desc">
                            Choose from authentic pre-made Pookalam mandalas &amp; floral outlines.
                        </p>
                    </div>
                </motion.button>

                {/* 2. Upload Photo */}
                <motion.button
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12, duration: 0.3 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="template-main-card"
                    onClick={onSelectUpload}
                    type="button"
                >
                    <div className="template-card-icon-wrap dashed">
                        <svg viewBox="0 0 24 24" width="46" height="46" fill="none" stroke="#7a4a1e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                        </svg>
                    </div>
                    <div className="template-card-text">
                        <span className="template-card-title">
                            Upload Photo
                        </span>
                        <p className="template-card-desc">
                            Upload any custom outline photo or line drawing to color automatically.
                        </p>
                    </div>
                </motion.button>

                {/* 3. Design Studio */}
                <motion.button
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18, duration: 0.3 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="template-main-card"
                    onClick={onSelectCustom}
                    type="button"
                >
                    <div className="template-card-icon-wrap">
                        <svg viewBox="0 0 400 400" className="template-card-svg">
                            {diyPaths.map((p, idx) => (
                                <path key={idx} d={p.d} fill="none" stroke="#7a4a1e" strokeWidth="2.5" />
                            ))}
                        </svg>
                    </div>
                    <div className="template-card-text">
                        <span className="template-card-title">
                            Design Studio
                        </span>
                        <p className="template-card-desc">
                            Mix and match core motifs, ring patterns, and outer petals to build your design.
                        </p>
                    </div>
                </motion.button>
            </div>
        </motion.section>
    );
}
