import React from 'react';
import { motion } from 'framer-motion';

export default function HomeView({ onNavigate }) {
    return (
        <motion.div
            className="onam-home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
        >

            {/* =====================================================
                BACKGROUND
            ====================================================== */}

            <img
                src="assets/onam-background.jpg"
                alt="Kerala landscape"
                className="onam-background"
            />

            {/* Soft warm overlay */}
            <div className="warm-overlay"></div>


            {/* =====================================================
                FALLING FLOWERS
            ====================================================== */}

            <FloatingPetal left="8%" delay="0s" duration="8s" />
            <FloatingPetal left="18%" delay="2s" duration="10s" />
            <FloatingPetal left="32%" delay="4s" duration="9s" />
            <FloatingPetal left="50%" delay="1s" duration="11s" />
            <FloatingPetal left="68%" delay="3s" duration="9s" />
            <FloatingPetal left="82%" delay="5s" duration="10s" />
            <FloatingPetal left="93%" delay="1s" duration="8s" />


            {/* =====================================================
                NAVIGATION
            ====================================================== */}

            <nav className="onam-navbar">

                <button
                    className="nav-link active"
                    onClick={() => onNavigate('home')}
                >
                    HOME
                </button>

                <button
                    className="nav-link"
                    onClick={() => onNavigate('design')}
                >
                    CREATE POOKALAM
                </button>

                <button
                    className="nav-link"
                    onClick={() => onNavigate('gallery')}
                >
                    GALLERY
                </button>

                <button
                    className="nav-link"
                    onClick={() => onNavigate('about')}
                >
                    ABOUT ONAM
                </button>

            </nav>


            {/* =====================================================
                HAPPY ONAM TITLE
            ====================================================== */}

            <motion.div
                className="onam-title"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                <div className="happy-text">
                    Happy
                </div>

                <div className="onam-text">
                    Onam
                </div>

                <div className="title-line"></div>

                <p>
                    Celebrate the spirit of Kerala
                </p>
            </motion.div>


            {/* =====================================================
                MAVELI — LEFT
            ====================================================== */}

            <motion.img
                src="assets/maveli.png"
                alt="King Mahabali"
                className="maveli-img"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
            />


            {/* =====================================================
                POOKALAM — CENTER
            ====================================================== */}

            <motion.img
                src="assets/pookalam.png"
                alt="Traditional Onam Pookalam"
                className="pookalam-img"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
            />


            {/* =====================================================
                KATHAKALI — RIGHT
            ====================================================== */}

            <motion.img
                src="assets/kathakali.png"
                alt="Kathakali performer"
                className="kathakali-img"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
            />


            {/* =====================================================
                SADYA — BOTTOM LEFT
            ====================================================== */}

            <motion.img
                src="assets/sadya.png"
                alt="Traditional Onam Sadya"
                className="sadya-img"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            />


            {/* =====================================================
                THIRUVATHIRA — BOTTOM CENTER
            ====================================================== */}

            <motion.img
                src="assets/thiruvathira.png"
                alt="Thiruvathira dancers"
                className="thiruvathira-img"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            />


            {/* =====================================================
                BOAT RACE — BOTTOM RIGHT
            ====================================================== */}

            <motion.img
                src="assets/boat.png"
                alt="Kerala snake boat race"
                className="boat-img"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
            />


            {/* =====================================================
                ACTION BUTTONS
            ====================================================== */}

            <motion.div
                className="home-buttons"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
            >

                <button
                    className="create-btn"
                    onClick={() => onNavigate('design')}
                >
                    Create Pookalam
                </button>

                <button
                    className="gallery-btn"
                    onClick={() => onNavigate('gallery')}
                >
                    Explore Gallery
                </button>

            </motion.div>

        </motion.div>
    );
}


/* ================================================================
   FALLING PETAL COMPONENT
================================================================ */

function FloatingPetal({ left, delay, duration }) {

    return (
        <motion.div
            className="falling-petal"
            initial={{
                y: '-10vh',
                opacity: 0
            }}
            animate={{
                y: '110vh',
                x: [0, 20, -15, 20, 0],
                rotate: [0, 90, 180, 270, 360],
                opacity: [0, 0.8, 0.8, 0.6, 0]
            }}
            transition={{
                duration: Number(duration.replace('s', '')),
                delay: Number(delay.replace('s', '')),
                repeat: Infinity,
                ease: 'linear'
            }}
            style={{
                left: left
            }}
        >
            🌸
        </motion.div>
    );
}