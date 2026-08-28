import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import HomeView from './components/HomeView';
import GalleryView from './components/GalleryView';
import AboutView from './components/AboutView';
import DesignerView from './components/Designer/DesignerView';
import './App.css';

export default function App() {
    const [view, setView] = useState('home');

    return (
        <div className="app-root">

            {/* Global Navigation — visible on every page */}
            <nav className="onam-navbar">
                <button
                    className={`nav-link${view === 'home' ? ' active' : ''}`}
                    onClick={() => setView('home')}
                >
                    HOME
                </button>
                <button
                    className={`nav-link${view === 'design' ? ' active' : ''}`}
                    onClick={() => setView('design')}
                >
                    CREATE POOKALAM
                </button>
                <button
                    className={`nav-link${view === 'gallery' ? ' active' : ''}`}
                    onClick={() => setView('gallery')}
                >
                    GALLERY
                </button>
                <button
                    className={`nav-link${view === 'about' ? ' active' : ''}`}
                    onClick={() => setView('about')}
                >
                    LEARN MORE ABOUT ONAM
                </button>
            </nav>

            {/* Page Router with Animated Cross-Fades */}
            <AnimatePresence mode="wait">
                {view === 'home' && (
                    <HomeView key="home" onNavigate={setView} />
                )}
                {view === 'design' && (
                    <DesignerView key="design" onNavigate={setView} />
                )}
                {view === 'gallery' && (
                    <GalleryView key="gallery" onNavigate={setView} />
                )}
                {view === 'about' && (
                    <AboutView key="about" onNavigate={setView} />
                )}
            </AnimatePresence>
        </div>
    );
}
