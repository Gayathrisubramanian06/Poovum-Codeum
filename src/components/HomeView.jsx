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
                src="assets/onam-background.png"
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
                POOKALAM — TOP CENTER (half visible, spinning)
            ====================================================== */}

            <motion.img
                src="assets/pookalam.png.png"
                alt="Pookalam"
                className="pookalam-top-spin"
                style={{
                    // translateX(-50%) centers it; translateY(-50%) hides the top half
                    x: '-50%',
                    y: '-52%',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            />



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
                    Digital
                </div>

                <div className="onam-text">
                    Pookalam
                </div>

                <div className="title-line"></div>

                <p>
                    Design your Digital Pookalam now!
                </p>

                <div className="home-buttons">
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
                </div>
            </motion.div>






            {/* =====================================================
                KATHAKALI / MAVELI — RIGHT
            ====================================================== */}

            <motion.img
                src="assets/maveli.png"
                alt="King Maveli"
                className="kathakali-img"
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
            />


            {/* =====================================================
                SADYA — PLACED TO THE LEFT OF MAVELI
            ====================================================== */}

            <motion.img
                src="assets/sadya.png"
                alt="Onam Sadya"
                className="sadya-img"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            />


            {/* =====================================================
                SNAKE BOAT — BEHIND THIRUVATHIRA
            ====================================================== */}

            <motion.img
                src="assets/boat.png"
                alt="Kerala Snake Boat"
                className="boat-img"
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 0.95, x: 0 }}
                transition={{ duration: 1.2 }}
            />


            {/* =====================================================
                THIRUVATHIRA — LEFT SIDE
            ====================================================== */}

            <motion.img
                src="assets/thiruvathira.png"
                alt="Thiruvathira dancers"
                className="thiruvathira-img"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            />


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