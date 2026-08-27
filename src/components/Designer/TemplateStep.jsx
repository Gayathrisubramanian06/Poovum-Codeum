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
        >
            <h1>Design Your Pookalam</h1>
            <p className="subtitle">Select how you want to build your layout.</p>

            <div className="template-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', maxWidth: '820px', margin: '0 auto' }}>
                <motion.button
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05, duration: 0.3 }}
                    whileHover={{ y: -6 }}
                    whileTap={{ scale: 0.98 }}
                    className="template-card-preview-container"
                    onClick={onSelectBrowse}
                    type="button"
                    style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}
                >
                    <div style={{ width: '130px', height: '130px', background: '#fbf8f0', borderRadius: '50%', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(122, 74, 30, 0.06)' }}>
                        <svg viewBox="0 0 400 400" style={{ width: '100%', height: '100%' }}>
                            {choosePaths.map((p, idx) => (
                                <path key={idx} d={p.d} fill="none" stroke="#7a4a1e" strokeWidth="2.5" />
                            ))}
                        </svg>
                    </div>
                    <span className="template-name" style={{ fontSize: '15px', fontWeight: '800', textTransform: 'uppercase' }}>
                        Browse Outlines
                    </span>
                </motion.button>

                <motion.button
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12, duration: 0.3 }}
                    whileHover={{ y: -6 }}
                    whileTap={{ scale: 0.98 }}
                    className="template-card-preview-container"
                    onClick={onSelectUpload}
                    type="button"
                    style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}
                >
                    <div style={{ width: '130px', height: '130px', background: '#fbf8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed rgba(122, 74, 30, 0.35)' }}>
                        <span style={{ fontSize: '38px' }}>📤</span>
                    </div>
                    <span className="template-name" style={{ fontSize: '15px', fontWeight: '800', textTransform: 'uppercase' }}>
                        Upload Photo
                    </span>
                </motion.button>

                <motion.button
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18, duration: 0.3 }}
                    whileHover={{ y: -6 }}
                    whileTap={{ scale: 0.98 }}
                    className="template-card-preview-container"
                    onClick={onSelectCustom}
                    type="button"
                    style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}
                >
                    <div style={{ width: '130px', height: '130px', background: '#fbf8f0', borderRadius: '50%', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(122, 74, 30, 0.06)' }}>
                        <svg viewBox="0 0 400 400" style={{ width: '100%', height: '100%' }}>
                            {diyPaths.map((p, idx) => (
                                <path key={idx} d={p.d} fill="none" stroke="#7a4a1e" strokeWidth="2.5" />
                            ))}
                        </svg>
                    </div>
                    <span className="template-name" style={{ fontSize: '15px', fontWeight: '800', textTransform: 'uppercase' }}>
                        Design Studio
                    </span>
                </motion.button>
            </div>
        </motion.section>
    );
}
