import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function UploadStep({ onStartColoring }) {
    const [previewSrc, setPreviewSrc] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            setPreviewSrc(event.target.result);
        };
        reader.readAsDataURL(file);
    };

    const triggerFileSelect = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setPreviewSrc(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <motion.section
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.28 }}
            className="w-full text-center"
            style={{ maxWidth: '600px', margin: '0 auto' }}
        >
            <h1>Upload Custom Template</h1>
            <p className="subtitle">Upload any outline sketch or reference image to trace and color as a Pookalam.</p>

            <div
                className="upload-dropzone"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={!previewSrc ? triggerFileSelect : undefined}
                style={{
                    background: 'rgba(255, 255, 255, 0.72)',
                    border: '2px dashed rgba(242, 193, 78, 0.5)',
                    borderRadius: '24px',
                    padding: '40px 20px',
                    textAlign: 'center',
                    cursor: !previewSrc ? 'pointer' : 'default',
                    minHeight: '260px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '16px',
                    boxShadow: '0 8px 32px rgba(122, 74, 30, 0.05)',
                    backdropFilter: 'blur(12px)'
                }}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                />

                {!previewSrc ? (
                    <>
                        <div style={{ fontSize: '48px' }}>📤</div>
                        <div>
                            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--brown-dark)' }}>
                                Drag &amp; Drop outline image here
                            </h3>
                            <p style={{ fontSize: '13.5px', color: 'var(--brown-mid)', marginTop: '4px' }}>
                                or click to browse files
                            </p>
                        </div>
                    </>
                ) : (
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px' }}>
                        <div
                            style={{
                                width: '180px',
                                height: '180px',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                border: '1.5px solid rgba(242, 193, 78, 0.3)',
                                background: '#faf6ee',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <img
                                src={previewSrc}
                                alt="Upload Preview"
                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                            />
                        </div>
                        
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={triggerFileSelect}
                                className="ghost-btn"
                                style={{ padding: '8px 18px', fontSize: '13px', minWidth: 'auto' }}
                                type="button"
                            >
                                Change Image 🔄
                            </button>
                            <button
                                onClick={() => onStartColoring(previewSrc)}
                                className="hero-btn-solid"
                                style={{ padding: '8px 24px', fontSize: '13.5px', minWidth: 'auto' }}
                                type="button"
                            >
                                Start Coloring 🌸
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </motion.section>
    );
}
