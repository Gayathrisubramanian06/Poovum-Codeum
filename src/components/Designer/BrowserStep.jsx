import React from 'react';
import { motion } from 'framer-motion';
import { VECTOR_TEMPLATES, PREDEFINED_TEMPLATES, generateMandalaPaths } from '../../utils/mandalas';

function VectorPreview({ templateId }) {
    const paths = generateMandalaPaths(templateId);
    return (
        <svg viewBox="0 0 400 400" className="template-card-preview">
            {paths.map((p, idx) => (
                <path
                    key={idx}
                    d={p.d}
                    fill="none"
                    stroke="#7a4a1e"
                    strokeWidth="2.2"
                />
            ))}
        </svg>
    );
}

export default function BrowserStep({ onSelectVector, onSelectImage }) {
    return (
        <motion.section
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.28 }}
            id="subTemplateStep"
            className="w-full"
            style={{ display: 'block' }}
        >
            <h1>Pick a design</h1>
            <p className="subtitle">Select a layout to use as your guide.</p>

            <div className="template-grid" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {/* Section A: Vector Mandalas */}
                <div>
                    <h2 className="template-section-divider">Section A: Interactive Vector Mandalas</h2>
                    <div className="templates-subgrid">
                        {VECTOR_TEMPLATES.map((tpl, idx) => (
                            <motion.button
                                key={tpl.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: Math.min(5, idx) * 0.04, duration: 0.25 }}
                                className="template-card-preview-container"
                                onClick={() => onSelectVector(tpl.id)}
                                type="button"
                            >
                                <VectorPreview templateId={tpl.id} />
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Section B: Tracing Outlines */}
                <div>
                    <h2 className="template-section-divider">Section B: Classic Pookalam Tracing Outlines</h2>
                    <div className="templates-subgrid">
                        {PREDEFINED_TEMPLATES.circle.map((tpl, idx) => (
                            <motion.button
                                key={tpl.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: Math.min(5, idx) * 0.04, duration: 0.25 }}
                                className="template-card-preview-container"
                                onClick={() => onSelectImage(tpl)}
                                type="button"
                            >
                                <div className="template-card-preview">
                                    <img
                                        src={tpl.img}
                                        alt={tpl.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }}
                                        loading="lazy"
                                    />
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>
        </motion.section>
    );
}
