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
                        {VECTOR_TEMPLATES.map((tpl) => (
                            <button
                                key={tpl.id}
                                className="template-card-preview-container"
                                onClick={() => onSelectVector(tpl.id)}
                                type="button"
                                style={{ background: 'var(--white)', border: '1.5px solid #eee2cc', borderRadius: '18px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                            >
                                <VectorPreview templateId={tpl.id} />
                                <span className="template-name" style={{ fontSize: '14px', fontWeight: '700', textAlign: 'center' }}>
                                    {tpl.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Section B: Tracing Outlines */}
                <div>
                    <h2 className="template-section-divider">Section B: Classic Pookalam Tracing Outlines</h2>
                    <div className="templates-subgrid">
                        {PREDEFINED_TEMPLATES.circle.map((tpl) => (
                            <button
                                key={tpl.id}
                                className="template-card-preview-container"
                                onClick={() => onSelectImage(tpl)}
                                type="button"
                                style={{ background: 'var(--white)', border: '1.5px solid #eee2cc', borderRadius: '18px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                            >
                                <div className="template-card-preview" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <img
                                        src={tpl.img}
                                        alt={tpl.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        loading="lazy"
                                    />
                                </div>
                                <span className="template-name" style={{ fontSize: '14px', fontWeight: '700', textAlign: 'center' }}>
                                    {tpl.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </motion.section>
    );
}
