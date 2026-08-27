import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import HomeView from './components/HomeView';
import GalleryView from './components/GalleryView';
import AboutView from './components/AboutView';
import DesignerView from './components/Designer/DesignerView';
import './App.css';

const LOCAL_AUDIO_SRC = 'assets/audio/onam-music.mp3';
const FALLBACK_AUDIO_SRC = 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Mohanam_varnam.ogg';
const MUSIC_MUTE_KEY = 'pookalam_music_muted';

export default function App() {
    const [view, setView] = useState('home');
    const [isMuted, setIsMuted] = useState(() => sessionStorage.getItem(MUSIC_MUTE_KEY) === 'true');
    const audioRef = useRef(null);
    const [musicPulse, setMusicPulse] = useState(false);

    // Initial Audio Player configuration
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.loop = true;
        audio.volume = 0.35;
        audio.muted = isMuted;

        const startPlayback = () => {
            audio.play().catch(() => {
                // Autoplay blocked — wait for user interaction to unlock
                const unlock = () => {
                    audio.play().catch(() => {});
                    document.removeEventListener('click', unlock);
                    document.removeEventListener('keydown', unlock);
                    document.removeEventListener('touchstart', unlock);
                };
                document.addEventListener('click', unlock);
                document.addEventListener('keydown', unlock);
                document.addEventListener('touchstart', unlock);
            });
        };

        // Try local source first
        audio.src = LOCAL_AUDIO_SRC;
        audio.load();
        
        audio.play()
            .then(() => {
                // Local file success
            })
            .catch(() => {
                // Local file missing/unsupported, use fallback
                audio.src = FALLBACK_AUDIO_SRC;
                audio.load();
                startPlayback();
            });
    }, []);

    // Toggle mute state
    const handleToggleMute = () => {
        const nextMuted = !isMuted;
        setIsMuted(nextMuted);
        sessionStorage.setItem(MUSIC_MUTE_KEY, String(nextMuted));
        
        if (audioRef.current) {
            audioRef.current.muted = nextMuted;
            if (!nextMuted && audioRef.current.paused) {
                audioRef.current.play().catch(() => {});
            }
        }

        // Trigger brief click pulse animation
        setMusicPulse(true);
        setTimeout(() => setMusicPulse(false), 500);
    };

    return (
        <div className="app-root">
            {/* Unified Ambient Music Player */}
            <audio ref={audioRef} />

            {/* Mute toggle button */}
            <button
                id="musicToggleBtn"
                onClick={handleToggleMute}
                className={musicPulse ? 'music-pulse' : ''}
                aria-label={isMuted ? 'Unmute music' : 'Mute music'}
                title={isMuted ? 'Unmute music' : 'Mute music'}
                type="button"
            >
                {isMuted ? '🔇' : '🎵'}
            </button>

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
                    ABOUT ONAM
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
