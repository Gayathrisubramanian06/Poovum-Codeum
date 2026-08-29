import React from 'react';
import { motion } from 'framer-motion';
import SpecularButton from './SpecularButton';

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
                src="assets/pookalam.png"
                alt="Pookalam"
                className="pookalam-top-spin"
                style={{
                    x: '-50%',
                    y: '-58%',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            />



            {/* =====================================================
                HAPPY ONAM TITLE
            ====================================================== */}

            <motion.div
                className="onam-title"
                initial={{ opacity: 0, x: '-50%', y: -20 }}
                animate={{ opacity: 1, x: '-50%', y: 0 }}
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
                    <SpecularButton
                        size="lg"
                        radius={30}
                        tint="#8c681f"
                        tintOpacity={0.9}
                        blur={8}
                        textColor="#ffffff"
                        lineColor="#fef08a"
                        baseColor="#d97706"
                        intensity={1.5}
                        shineSize={18}
                        shineFade={35}
                        thickness={2}
                        speed={0.4}
                        followMouse
                        proximity={300}
                        autoAnimate={true}
                        onClick={() => onNavigate('design')}
                        className="create-btn"
                    >
                        Create Pookalam
                    </SpecularButton>

                    <SpecularButton
                        size="lg"
                        radius={30}
                        tint="#faf4e4"
                        tintOpacity={0.9}
                        blur={8}
                        textColor="#684f27"
                        lineColor="#ffffff"
                        baseColor="#b45309"
                        intensity={1.3}
                        shineSize={16}
                        shineFade={35}
                        thickness={1.8}
                        speed={0.35}
                        followMouse
                        proximity={300}
                        autoAnimate={true}
                        onClick={() => onNavigate('gallery')}
                        className="gallery-btn"
                    >
                        Explore Gallery
                    </SpecularButton>
                </div>
            </motion.div>






            {/* =====================================================
                KATHAKALI / MAVELI — RIGHT
            ====================================================== */}

            <motion.img
                src="assets/maveli.png"
                alt="King Maveli"
                className="kathakali-img"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{
                    opacity: 1,
                    y: [0, -8, 0, 5, 0],
                    rotate: [0, 1.2, 0, -1.2, 0],
                    scale: [1, 1.02, 1, 0.99, 1]
                }}
                transition={{
                    opacity: { duration: 1 },
                    y: { duration: 7, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" },
                    rotate: { duration: 8, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" },
                    scale: { duration: 6, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
                }}
                whileHover={{ scale: 1.05, rotate: -1, transition: { duration: 0.3 } }}
            />


            {/* =====================================================
                SADYA — PLACED TO THE LEFT OF MAVELI
            ====================================================== */}

            <motion.img
                src="assets/sadya.png"
                alt="Onam Sadya"
                className="sadya-img"
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{
                    opacity: 1,
                    y: [0, -6, 0, 4, 0],
                    rotate: [0, 1.2, 0, -1.2, 0],
                    scale: [1, 1.025, 1, 0.985, 1]
                }}
                transition={{
                    opacity: { duration: 1 },
                    y: { duration: 6, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" },
                    rotate: { duration: 7, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" },
                    scale: { duration: 8, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
                }}
                whileHover={{ scale: 1.06, rotate: 1, transition: { duration: 0.3 } }}
            />


            {/* =====================================================
                SNAKE BOAT — BEHIND THIRUVATHIRA
            ====================================================== */}

            <motion.img
                src="assets/boat.png"
                alt="Kerala Snake Boat"
                className="boat-img"
                style={{ x: '-50%' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                    opacity: 0.95,
                    y: [0, -7, 0, 5, 0],
                    rotate: [-1.5, 1, -0.8, 1.2, -1.5]
                }}
                transition={{
                    opacity: { duration: 1.2 },
                    y: { duration: 9, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" },
                    rotate: { duration: 11, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
                }}
                whileHover={{ scale: 1.04, transition: { duration: 0.3 } }}
            />


            {/* =====================================================
                THIRUVATHIRA — LEFT SIDE
            ====================================================== */}

            <motion.img
                src="assets/thiruvathira.png"
                alt="Thiruvathira dancers"
                className="thiruvathira-img"
                style={{ x: '-50%' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                    opacity: 1,
                    y: [0, -7, 0, -4, 0],
                    rotate: [0, 1.5, 0, -1.5, 0]
                }}
                transition={{
                    opacity: { duration: 1 },
                    y: { duration: 6.5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" },
                    rotate: { duration: 7, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
                }}
                whileHover={{ scale: 1.04, rotate: 1, transition: { duration: 0.3 } }}
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
            <svg viewBox="0 0 24 24" width="20" height="20" fill="#1b4332" opacity="0.9">
                <path d="M12 2C8 6 4 12 12 22C20 12 16 6 12 2Z" />
            </svg>
        </motion.div>
    );
}