import React from 'react';
import { motion } from 'framer-motion';

export default function HomeView({ onNavigate }) {
    return (
        <div className="onam-home">

            {/* =====================================================
                BASE BACKGROUND
            ====================================================== */}

            <img
                src="assets/images/hero-welcome.png"
                alt="Kerala Onam celebration"
                className="onam-background"
            />

            {/* Soft cinematic overlay */}
            <div className="warm-overlay" />


            {/* =====================================================
                NAVIGATION
            ====================================================== */}

            <nav className="onam-nav">

                <button
                    onClick={() => onNavigate('home')}
                    className="nav-item active"
                >
                    HOME
                </button>

                <button
                    onClick={() => onNavigate('design')}
                    className="nav-item"
                >
                    CREATE POOKALAM
                </button>

                <button
                    onClick={() => onNavigate('gallery')}
                    className="nav-item"
                >
                    GALLERY
                </button>

                <button
                    onClick={() => onNavigate('about')}
                    className="nav-item"
                >
                    ABOUT ONAM
                </button>

            </nav>


            {/* =====================================================
                TITLE
            ====================================================== */}

            <motion.div
                className="onam-title"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2 }}
            >
                <div className="title-main">
                    ONAM
                </div>

                <div className="title-year">
                    2026
                </div>

                <div className="title-sub">
                    Welcome to the celebration
                </div>
            </motion.div>


            {/* =====================================================
                MAVELI
            ====================================================== */}

            <motion.img
                src="assets/maveli.png"
                alt="Maveli"
                className="maveli-character"
                initial={{ opacity: 0, x: -80 }}
                animate={{
                    opacity: 1,
                    x: 0,
                    y: [0, -5, 0]
                }}
                transition={{
                    opacity: { duration: 1 },
                    x: { duration: 1 },
                    y: {
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }
                }}
            />


            {/* =====================================================
                KATHAKALI
            ====================================================== */}

            <motion.img
                src="assets/kathakali.png"
                alt="Kathakali performer"
                className="kathakali-character"
                initial={{ opacity: 0, x: 80 }}
                animate={{
                    opacity: 1,
                    x: 0,
                    rotate: [0, -1.5, 1.5, 0]
                }}
                transition={{
                    opacity: { duration: 1 },
                    x: { duration: 1 },
                    rotate: {
                        duration: 5,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }
                }}
            />


            {/* =====================================================
                POOKALAM
            ====================================================== */}

            <motion.img
                src="assets/pookalam.png"
                alt="Onam Pookalam"
                className="pookalam-center"
                initial={{
                    opacity: 0,
                    scale: 0.65
                }}
                animate={{
                    opacity: 1,
                    scale: [1, 1.025, 1]
                }}
                transition={{
                    opacity: { duration: 1.2 },
                    scale: {
                        duration: 5,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }
                }}
            />


            {/* =====================================================
                THIRUVATHIRA
            ====================================================== */}

            <motion.img
                src="assets/thiruvathira.png"
                alt="Thiruvathira dancers"
                className="thiruvathira-group"
                initial={{
                    opacity: 0,
                    y: 50
                }}
                animate={{
                    opacity: 1,
                    y: [0, -4, 0]
                }}
                transition={{
                    opacity: { duration: 1.2 },
                    y: {
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }
                }}
            />


            {/* =====================================================
                SADYA
            ====================================================== */}

            <motion.img
                src="assets/sadya.png"
                alt="Traditional Onam Sadya"
                className="sadya-plate"
                initial={{
                    opacity: 0,
                    scale: 0.8
                }}
                animate={{
                    opacity: 1,
                    scale: [1, 1.015, 1]
                }}
                transition={{
                    opacity: { duration: 1.2 },
                    scale: {
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }
                }}
            />


            {/* =====================================================
                BOAT
            ====================================================== */}

            <motion.img
                src="assets/boat.png"
                alt="Kerala snake boat race"
                className="snake-boat"
                initial={{
                    opacity: 0,
                    x: '-20vw'
                }}
                animate={{
                    opacity: 1,
                    x: ['-2vw', '2vw', '-2vw']
                }}
                transition={{
                    opacity: {
                        duration: 1
                    },
                    x: {
                        duration: 7,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }
                }}
            />


            {/* =====================================================
                FLOATING FLOWER PETALS
            ====================================================== */}

            <FloatingPetal left="8%" delay="0s" duration="8s" />
            <FloatingPetal left="18%" delay="2s" duration="9s" />
            <FloatingPetal left="31%" delay="4s" duration="7s" />
            <FloatingPetal left="48%" delay="1s" duration="10s" />
            <FloatingPetal left="64%" delay="3s" duration="8s" />
            <FloatingPetal left="79%" delay="0s" duration="9s" />
            <FloatingPetal left="91%" delay="5s" duration="7s" />


            {/* =====================================================
                BUTTONS
            ====================================================== */}

            <motion.div
                className="onam-buttons"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 1,
                    delay: 1
                }}
            >

                <motion.button
                    className="create-button"
                    onClick={() => onNavigate('design')}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                    Create Pookalam
                </motion.button>

                <motion.button
                    className="gallery-button"
                    onClick={() => onNavigate('gallery')}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                    Explore Gallery
                </motion.button>

            </motion.div>


            {/* =====================================================
                SCROLL INDICATOR
            ====================================================== */}

            <motion.div
                className="scroll-indicator"
                animate={{
                    y: [0, 8, 0],
                    opacity: [0.5, 1, 0.5]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity
                }}
            >
                ↓
            </motion.div>

        </div>
    );
}


/* ================================================================
   FLOWER PETAL COMPONENT
================================================================ */

function FloatingPetal({ left, delay, duration }) {

    return (
        <motion.div
            className="floating-petal"
            style={{
                left: left
            }}
            initial={{
                y: '-10vh',
                opacity: 0,
                rotate: 0
            }}
            animate={{
                y: '110vh',
                opacity: [0, 0.9, 0.8, 0],
                x: [0, 25, -20, 20, 0],
                rotate: [0, 90, 180, 270, 360]
            }}
            transition={{
                duration: Number(duration.replace('s', '')),
                delay: Number(delay.replace('s', '')),
                repeat: Infinity,
                ease: 'linear'
            }}
        >
            🌸
        </motion.div>
    );
}