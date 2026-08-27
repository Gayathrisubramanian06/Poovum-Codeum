import React, { useRef } from 'react';
import { motion } from 'framer-motion';

export default function TemplateStep({ onSelectBrowse, onSelectUpload, onSelectCustom }) {
    const fileInputRef = useRef(null);

    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            onSelectUpload(event.target.result);
        };
        reader.readAsDataURL(file);
    };

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
            <p className="subtitle">How would you like to start your design?</p>

            <div className="template-grid">
                <button
                    className="template-card fade-in visible"
                    onClick={onSelectBrowse}
                    type="button"
                >
                    <div className="template-info">
                        <span className="template-name">CHOOSE A TEMPLATE</span>
                        <span className="template-desc">Pick from curated traditional &amp; geometric floral patterns</span>
                    </div>
                </button>

                {/* Hidden File Input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                />

                <button
                    className="template-card fade-in visible"
                    onClick={handleUploadClick}
                    type="button"
                >
                    <div className="template-info">
                        <span className="template-name">UPLOAD YOUR OWN</span>
                        <span className="template-desc">Upload a photo or sketch to use as your tracing guide</span>
                    </div>
                </button>

                <button
                    className="template-card fade-in visible"
                    onClick={onSelectCustom}
                    type="button"
                >
                    <div className="template-info">
                        <span className="template-name">DESIGN YOUR OWN TEMPLATE</span>
                        <span className="template-desc">Build a custom layout using sacred motifs, rings, and petals</span>
                    </div>
                </button>
            </div>
        </motion.section>
    );
}
