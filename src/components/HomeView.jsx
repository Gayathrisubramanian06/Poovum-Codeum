import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function HomeView({ onNavigate }) {
    const wrapRef = useRef(null);
    const [size, setSize] = useState({ w: 1920, h: 1080 });

    useEffect(() => {
        const updateSize = () => {
            if (wrapRef.current) {
                setSize({
                    w: wrapRef.current.clientWidth,
                    h: wrapRef.current.clientHeight
                });
            }
        };

        updateSize();
        // Delay slightly to ensure browser has computed client dimensions
        const timer = setTimeout(updateSize, 100);

        window.addEventListener('resize', updateSize);
        window.addEventListener('orientationchange', updateSize);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', updateSize);
            window.removeEventListener('orientationchange', updateSize);
        };
    }, []);

    const getBtnStyle = (fx, fy, fw, fh) => {
        return {
            position: 'absolute',
            left: `${fx * size.w}px`,
            top: `${fy * size.h}px`,
            width: `${fw * size.w}px`,
            height: `${fh * size.h}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
        };
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="hero-wrap"
            ref={wrapRef}
            id="heroWrap"
        >
            <img
                src="assets/images/hero-welcome.png"
                alt="Celebrate the Spirit of Onam — welcome illustration with Onam figures and floral garlands"
                className="hero-bg"
                id="heroImg"
                style={{
                    width: `${size.w}px`,
                    height: `${size.h}px`,
                    left: '0px',
                    top: '0px'
                }}
            />

            {/* Glowing Golden Light Leak */}
            <motion.div
                animate={{ opacity: [0.14, 0.28, 0.14] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(circle at 12% 20%, rgba(242, 193, 78, 0.28) 0%, transparent 40%)',
                    pointerEvents: 'none',
                    zIndex: 1
                }}
            />

            {/* Glowing Rose Light Leak */}
            <motion.div
                animate={{ opacity: [0.16, 0.32, 0.16] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(circle at 88% 80%, rgba(225, 29, 72, 0.2) 0%, transparent 42%)',
                    pointerEvents: 'none',
                    zIndex: 1
                }}
            />

            {/* Floating flower ornaments */}
            <motion.div
                animate={{ y: [0, -16, 0], rotate: [0, 8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                    position: 'absolute',
                    left: '4%',
                    top: '25%',
                    fontSize: '28px',
                    opacity: 0.65,
                    pointerEvents: 'none',
                    zIndex: 2
                }}
            >
                🌸
            </motion.div>

            <motion.div
                animate={{ y: [0, 14, 0], rotate: [0, -12, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                    position: 'absolute',
                    right: '5%',
                    top: '42%',
                    fontSize: '32px',
                    opacity: 0.6,
                    pointerEvents: 'none',
                    zIndex: 2
                }}
            >
                🌼
            </motion.div>

            {/* Top Nav Bar Clickable Areas — calibrated to hero-welcome.png */}
            <button
                onClick={() => onNavigate('home')}
                className="hero-btn"
                style={getBtnStyle(0.17, 0.02, 0.09, 0.08)}
                aria-label="Home"
                type="button"
            />
            <button
                onClick={() => onNavigate('design')}
                className="hero-btn"
                style={getBtnStyle(0.26, 0.02, 0.13, 0.08)}
                aria-label="Create Pookalam"
                type="button"
            />
            <button
                onClick={() => onNavigate('gallery')}
                className="hero-btn"
                style={getBtnStyle(0.35, 0.02, 0.08, 0.08)}
                aria-label="Gallery"
                type="button"
            />
            <button
                onClick={() => onNavigate('about')}
                className="hero-btn"
                style={getBtnStyle(0.43, 0.02, 0.1, 0.08)}
                aria-label="About Onam"
                type="button"
            />

            {/* Main Action Buttons — calibrated to hero-welcome.png */}
            <button
                onClick={() => onNavigate('design')}
                className="hero-btn btn-start"
                id="btnStart"
                style={getBtnStyle(0.365, 0.682, 0.258, 0.063)}
                aria-label="Start Designing"
                type="button"
            >
                Start Designing
            </button>
            <button
                onClick={() => onNavigate('gallery')}
                className="hero-btn btn-gallery"
                id="btnGallery"
                style={getBtnStyle(0.365, 0.764, 0.258, 0.068)}
                aria-label="Explore Gallery"
                type="button"
            >
                Explore Gallery
            </button>
        </motion.div>
    );
}
