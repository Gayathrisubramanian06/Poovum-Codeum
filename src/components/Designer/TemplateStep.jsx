import React from 'react';
import { motion } from 'framer-motion';
import { generateMandalaPaths, generateCustomMandalaPaths } from '../../utils/mandalas';

const DEFAULT_CUSTOM_CONFIG = {
    core: 'ganapathi',
    coreScale: 1.0,
    mid: 'pointed-12',
    midScale: 1.0,
    rings: 'double-ring',
    ringScale: 1.0,
    outer: 'scallop-16',
    outerScale: 1.0
};

export default function TemplateStep({ onSelectBrowse, onSelectUpload, onSelectCustom }) {
    const choosePaths = generateMandalaPaths('surya-padma');
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
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '0 auto', textAlign: 'center' }}
        >
            <h1 style={{ textAlign: 'center', fontSize: '2.2rem', marginBottom: '8px' }}>Design Your Pookalam</h1>
            <p className="subtitle" style={{ textAlign: 'center', margin: '0 auto 36px', fontSize: '1.05rem', color: '#684f27' }}>Select how you want to build your layout.</p>

            <div className="template-grid">
                <motion.button
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05, duration: 0.3 }}
                    whileHover={{ y: -8, scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="template-card-preview-container"
                    onClick={onSelectBrowse}
                    type="button"
                    style={{ padding: '32px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', gap: '14px', flex: '1 1 0px', minWidth: 0, borderRadius: '24px' }}
                >
                    <div style={{ width: '150px', height: '150px', background: '#fbf8f0', borderRadius: '50%', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid rgba(122, 74, 30, 0.12)', flexShrink: 0, boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.02)' }}>
                        <svg viewBox="0 0 400 400" style={{ width: '100%', height: '100%', display: 'block' }}>
                            {choosePaths.map((p, idx) => (
                                <path key={idx} d={p.d} fill="none" stroke="#7a4a1e" strokeWidth="2.5" />
                            ))}
                        </svg>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <span className="template-name" style={{ fontSize: '16px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.03em', color: 'var(--brown-dark)' }}>
                            Browse Templates
                        </span>
                        <p style={{ fontSize: '12.5px', color: '#684f27', margin: 0, lineHeight: '1.4', fontWeight: '500', maxWidth: '240px' }}>
                            Choose from authentic pre-made Pookalam mandalas &amp; floral outlines.
                        </p>
                    </div>
                </motion.button>

                <motion.button
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12, duration: 0.3 }}
                    whileHover={{ y: -8, scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="template-card-preview-container"
                    onClick={onSelectUpload}
                    type="button"
                    style={{ padding: '32px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', gap: '14px', flex: '1 1 0px', minWidth: 0, borderRadius: '24px' }}
                >
                    <div style={{ width: '150px', height: '150px', background: '#fbf8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed rgba(122, 74, 30, 0.45)', flexShrink: 0, boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.02)' }}>
                        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#7a4a1e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                        </svg>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <span className="template-name" style={{ fontSize: '16px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.03em', color: 'var(--brown-dark)' }}>
                            Upload Photo
                        </span>
                        <p style={{ fontSize: '12.5px', color: '#684f27', margin: 0, lineHeight: '1.4', fontWeight: '500', maxWidth: '240px' }}>
                            Upload any custom outline photo or line drawing to color automatically.
                        </p>
                    </div>
                </motion.button>

                <motion.button
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18, duration: 0.3 }}
                    whileHover={{ y: -8, scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="template-card-preview-container"
                    onClick={onSelectCustom}
                    type="button"
                    style={{ padding: '32px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', gap: '14px', flex: '1 1 0px', minWidth: 0, borderRadius: '24px' }}
                >
                    <div style={{ width: '150px', height: '150px', background: '#fbf8f0', borderRadius: '50%', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid rgba(122, 74, 30, 0.12)', flexShrink: 0, boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.02)' }}>
                        <svg viewBox="0 0 400 400" style={{ width: '100%', height: '100%', display: 'block' }}>
                            {diyPaths.map((p, idx) => (
                                <path key={idx} d={p.d} fill="none" stroke="#7a4a1e" strokeWidth="2.5" />
                            ))}
                        </svg>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <span className="template-name" style={{ fontSize: '16px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.03em', color: 'var(--brown-dark)' }}>
                            Design Studio
                        </span>
                        <p style={{ fontSize: '12.5px', color: '#684f27', margin: 0, lineHeight: '1.4', fontWeight: '500', maxWidth: '240px' }}>
                            Mix and match core motifs, ring patterns, and outer petals to build your design.
                        </p>
                    </div>
                </motion.button>
            </div>
        </motion.section>
    );
}
