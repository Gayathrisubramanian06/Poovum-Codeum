import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TemplateStep from './TemplateStep';
import BrowserStep from './BrowserStep';
import CustomStep from './CustomStep';
import CanvasStep from './CanvasStep';
import UploadStep from './UploadStep';

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

export default function DesignerView({ onNavigate }) {
    const [step, setStep] = useState('template'); // 'template' | 'browser' | 'custom' | 'canvas' | 'upload'
    const [previousStep, setPreviousStep] = useState('browse'); // 'browse' | 'upload' | 'custom'
    const [selectedTemplate, setSelectedTemplate] = useState(null); // id of vector template, or full template object
    const [isImageTemplate, setIsImageTemplate] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);
    const [customConfig, setCustomConfig] = useState(DEFAULT_CUSTOM_CONFIG);

    const handleBack = () => {
        if (step === 'canvas') {
            if (previousStep === 'custom') {
                setStep('custom');
            } else if (previousStep === 'upload') {
                setStep('upload'); // Go back to upload step instead of start!
            } else {
                setStep('browser');
            }
        } else if (step === 'browser' || step === 'custom' || step === 'upload') {
            setStep('template');
        } else {
            onNavigate('home');
        }
    };

    const getPageTitle = () => {
        if (step === 'canvas') return 'Color Your Pookalam';
        if (step === 'browser') return 'Choose a Template';
        if (step === 'custom') return 'Design Your Template';
        if (step === 'upload') return 'Upload Outline';
        return 'Design Your Pookalam';
    };

    return (
        <div className="flex flex-col min-h-screen" style={{ position: 'relative' }}>
            {/* Background */}
            <img
                src="assets/onam-background.png"
                alt=""
                style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, pointerEvents: 'none' }}
            />
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(246,237,218,0.18)', zIndex: 1, pointerEvents: 'none' }} />

            {/* Common Header */}
            <header className="app-header" style={{ position: 'sticky', background: 'var(--cream)', zIndex: 10 }}>
                <button
                    className="icon-btn"
                    onClick={handleBack}
                    aria-label="Back"
                    type="button"
                >
                    ←
                </button>
                <span className="title" id="pageTitle">{getPageTitle()}</span>
                <button className="icon-btn" aria-label="Profile" type="button">👤</button>
            </header>

            <main className="page flex-1 w-full" style={{ padding: '24px 20px 40px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
                <AnimatePresence mode="wait">
                    {step === 'template' && (
                        <TemplateStep
                            key="template"
                            onSelectBrowse={() => {
                                setStep('browser');
                                setPreviousStep('browse');
                            }}
                            onSelectUpload={() => {
                                setStep('upload');
                            }}
                            onSelectCustom={() => {
                                setStep('custom');
                                setPreviousStep('custom');
                            }}
                        />
                    )}

                    {step === 'upload' && (
                        <UploadStep
                            key="upload"
                            onStartColoring={(src) => {
                                setIsImageTemplate(true);
                                setImageSrc(src);
                                setSelectedTemplate({ id: 'upload', name: 'Uploaded Outline', img: src });
                                setPreviousStep('upload');
                                setStep('canvas');
                            }}
                            onBack={() => setStep('template')}
                        />
                    )}

                    {step === 'browser' && (
                        <BrowserStep
                            key="browser"
                            onSelectVector={(tplId) => {
                                setIsImageTemplate(false);
                                setSelectedTemplate(tplId);
                                setStep('canvas');
                            }}
                            onSelectImage={(tpl) => {
                                setIsImageTemplate(true);
                                setImageSrc(tpl.img);
                                setSelectedTemplate(tpl);
                                setStep('canvas');
                            }}
                        />
                    )}

                    {step === 'custom' && (
                        <CustomStep
                            key="custom"
                            config={customConfig}
                            onChangeConfig={setCustomConfig}
                            onStartColoring={() => {
                                setIsImageTemplate(false);
                                setSelectedTemplate('custom-diy');
                                setStep('canvas');
                            }}
                        />
                    )}

                    {step === 'canvas' && (
                        <CanvasStep
                            key="canvas"
                            selectedTemplate={selectedTemplate}
                            isImageTemplate={isImageTemplate}
                            imageSrc={imageSrc}
                            customConfig={customConfig}
                            onNavigate={onNavigate}
                        />
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
