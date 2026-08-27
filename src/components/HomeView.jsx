import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const scenes = [
    'welcome',
    'pookalam',
    'maveli',
    'sadya',
    'thiruvathira',
    'kathakali',
    'boat',
    'final'
];

export default function HomeView({ onNavigate }) {
    const [scene, setScene] = useState('welcome');

    // Automatically move through the Onam story
    useEffect(() => {
        const interval = setInterval(() => {
            setScene(current => {
                const index = scenes.indexOf(current);
                return scenes[(index + 1) % scenes.length];
            });
        }, 3500);

        return () => clearInterval(interval);
    }, []);

    const sceneIndex = scenes.indexOf(scene);

    return (
        <motion.div
            className="onam-home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{
                width: '100vw',
                height: '100vh',
                position: 'relative',
                overflow: 'hidden',
                background: '#f5ead8'
            }}
        >

            {/* =====================================================
                BASE KERALA ENVIRONMENT
            ====================================================== */}

            <motion.img
                src="assets/images/hero-welcome.png"
                alt="Kerala Onam celebration"
                animate={{
                    scale: [1, 1.025, 1]
                }}
                transition={{
                    duration: 14,
                    repeat: Infinity,
                    ease: 'easeInOut'
                }}
                style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: 0
                }}
            />

            {/* Warm cinematic overlay */}
            <motion.div
                animate={{ opacity: [0.15, 0.27, 0.15] }}
                transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: 'easeInOut'
                }}
                style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                        'radial-gradient(circle at 50% 35%, rgba(255,220,130,.25), transparent 50%)',
                    pointerEvents: 'none',
                    zIndex: 1
                }}
            />

            {/* =====================================================
                FLOATING FLOWER PETALS
            ====================================================== */}

            <FloatingPetal left="8%" delay={0} duration={7} />
            <FloatingPetal left="18%" delay={2} duration={9} />
            <FloatingPetal left="32%" delay={4} duration={8} />
            <FloatingPetal left="67%" delay={1} duration={10} />
            <FloatingPetal left="82%" delay={3} duration={8} />
            <FloatingPetal left="92%" delay={5} duration={9} />

            {/* =====================================================
                NAVIGATION
            ====================================================== */}

            <div
                style={{
                    position: 'absolute',
                    top: '4%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 30,
                    display: 'flex',
                    gap: 'clamp(18px, 3vw, 55px)',
                    alignItems: 'center',
                    whiteSpace: 'nowrap'
                }}
            >
                <NavButton
                    text="HOME"
                    onClick={() => onNavigate('home')}
                    active
                />

                <NavButton
                    text="CREATE POOKALAM"
                    onClick={() => onNavigate('design')}
                />

                <NavButton
                    text="GALLERY"
                    onClick={() => onNavigate('gallery')}
                />

                <NavButton
                    text="ABOUT ONAM"
                    onClick={() => onNavigate('about')}
                />
            </div>

            {/* =====================================================
                WELCOME TEXT
            ====================================================== */}

            <AnimatePresence>
                {scene === 'welcome' && (
                    <motion.div
                        key="welcome"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -25 }}
                        transition={{ duration: 1 }}
                        style={{
                            position: 'absolute',
                            zIndex: 10,
                            left: '50%',
                            top: '27%',
                            transform: 'translateX(-50%)',
                            textAlign: 'center',
                            width: '90%'
                        }}
                    >
                        <div
                            style={{
                                fontFamily: 'Georgia, serif',
                                fontSize: 'clamp(42px, 6vw, 90px)',
                                letterSpacing: '8px',
                                color: '#8b641d',
                                fontWeight: 500
                            }}
                        >
                            ONAM
                        </div>

                        <div
                            style={{
                                fontFamily: 'Georgia, serif',
                                fontSize: 'clamp(18px, 2vw, 30px)',
                                letterSpacing: '6px',
                                color: '#493a29',
                                marginTop: '-5px'
                            }}
                        >
                            2026
                        </div>

                        <motion.p
                            animate={{ opacity: [0.45, 1, 0.45] }}
                            transition={{
                                duration: 2.5,
                                repeat: Infinity
                            }}
                            style={{
                                marginTop: '24px',
                                fontSize: 'clamp(14px, 1.3vw, 20px)',
                                color: '#594936',
                                letterSpacing: '2px'
                            }}
                        >
                            Welcome to the celebration
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* =====================================================
                POOKALAM
            ====================================================== */}

            <SceneImage
                show={scene === 'pookalam'}
                src="assets/pookalam.png"
                alt="Traditional Onam Pookalam"
                className="pookalam"
                style={{
                    width: 'clamp(240px, 32vw, 520px)',
                    left: '50%',
                    top: '52%'
                }}
                initial={{
                    scale: 0.1,
                    opacity: 0,
                    rotate: -25
                }}
                animate={{
                    scale: 1,
                    opacity: 1,
                    rotate: 0
                }}
            />

            {/* Pookalam caption */}
            <SceneCaption
                show={scene === 'pookalam'}
                title="THE BEAUTY OF ONAM"
                text="Where every flower becomes a celebration."
            />

            {/* =====================================================
                MAVELI
            ====================================================== */}

            <SceneImage
                show={scene === 'maveli'}
                src="assets/maveli.png"
                alt="King Mahabali"
                style={{
                    width: 'clamp(220px, 28vw, 430px)',
                    left: '50%',
                    top: '54%'
                }}
                initial={{
                    x: '-80vw',
                    opacity: 0,
                    rotate: -4
                }}
                animate={{
                    x: '-50%',
                    opacity: 1,
                    rotate: 0
                }}
            />

            <SceneCaption
                show={scene === 'maveli'}
                title="WELCOME, MAVELI"
                text="The beloved king returns to his people."
            />

            {/* =====================================================
                SADYA
            ====================================================== */}

            <SceneImage
                show={scene === 'sadya'}
                src="assets/sadya.png"
                alt="Traditional Onam Sadya"
                style={{
                    width: 'clamp(330px, 48vw, 760px)',
                    left: '50%',
                    top: '60%'
                }}
                initial={{
                    opacity: 0,
                    scale: 0.7,
                    y: 100
                }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0
                }}
            />

            <SceneCaption
                show={scene === 'sadya'}
                title="ONAM SADYA"
                text="A feast served with love, tradition and togetherness."
            />

            {/* =====================================================
                THIRUVATHIRA
            ====================================================== */}

            <SceneImage
                show={scene === 'thiruvathira'}
                src="assets/thiruvathira.png"
                alt="Thiruvathira dancers"
                style={{
                    width: 'clamp(350px, 55vw, 850px)',
                    left: '50%',
                    top: '58%'
                }}
                initial={{
                    opacity: 0,
                    scale: 0.85,
                    y: 70
                }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0
                }}
            />

            <motion.div
                animate={{
                    scale: [1, 1.08, 1],
                    opacity: [0.65, 1, 0.65]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity
                }}
                style={{
                    position: 'absolute',
                    left: '50%',
                    top: '64%',
                    width: '70px',
                    height: '70px',
                    transform: 'translate(-50%, -50%)',
                    borderRadius: '50%',
                    background:
                        'radial-gradient(circle, rgba(255,198,50,.4), transparent 65%)',
                    zIndex: 11,
                    pointerEvents: 'none'
                }}
            />

            <SceneCaption
                show={scene === 'thiruvathira'}
                title="THIRUVATHIRA"
                text="Grace, rhythm and tradition around the glowing lamp."
            />

            {/* =====================================================
                KATHAKALI
            ====================================================== */}

            <SceneImage
                show={scene === 'kathakali'}
                src="assets/kathakali.png"
                alt="Kathakali performer"
                style={{
                    width: 'clamp(200px, 28vw, 430px)',
                    left: '50%',
                    top: '55%'
                }}
                initial={{
                    opacity: 0,
                    scale: 0.6,
                    rotate: -8,
                    y: 80
                }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    rotate: [0, -2, 2, 0],
                    y: 0
                }}
                transition={{
                    duration: 1.2,
                    rotate: {
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }
                }}
            />

            <SceneCaption
                show={scene === 'kathakali'}
                title="THE SPIRIT OF KERALA"
                text="Colour, expression and stories come alive."
            />

            {/* =====================================================
                VALLAM KALI
            ====================================================== */}

            <AnimatePresence>
                {(scene === 'boat' || scene === 'final') && (
                    <motion.img
                        key="boat"
                        src="assets/boat.png"
                        alt="Kerala snake boat race"
                        initial={{
                            x: '-60vw',
                            opacity: 0
                        }}
                        animate={{
                            x: '0vw',
                            opacity: 1
                        }}
                        transition={{
                            duration: 2.5,
                            ease: 'easeOut'
                        }}
                        style={{
                            position: 'absolute',
                            width: 'clamp(350px, 62vw, 1000px)',
                            left: '50%',
                            top: '63%',
                            transform: 'translateX(-50%)',
                            zIndex: 12
                        }}
                    />
                )}
            </AnimatePresence>

            {scene === 'boat' && (
                <SceneCaption
                    show
                    title="VALLAM KALI"
                    text="The final celebration races across Kerala's backwaters."
                />
            )}

            {/* =====================================================
                FINAL MESSAGE
            ====================================================== */}

            <AnimatePresence>
                {scene === 'final' && (
                    <motion.div
                        key="final"
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2 }}
                        style={{
                            position: 'absolute',
                            left: '50%',
                            top: '22%',
                            transform: 'translateX(-50%)',
                            textAlign: 'center',
                            zIndex: 20,
                            width: '90%'
                        }}
                    >
                        <div
                            style={{
                                fontFamily: 'Georgia, serif',
                                fontSize: 'clamp(38px, 5vw, 76px)',
                                color: '#8c681f',
                                letterSpacing: '3px'
                            }}
                        >
                            Happy Onam
                        </div>

                        <div
                            style={{
                                marginTop: '15px',
                                fontSize: 'clamp(15px, 1.5vw, 22px)',
                                color: '#584938',
                                letterSpacing: '2px'
                            }}
                        >
                            May the spirit of Onam fill your heart with joy.
                        </div>

                        <motion.div
                            animate={{
                                y: [0, 8, 0],
                                opacity: [0.5, 1, 0.5]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity
                            }}
                            style={{
                                marginTop: '30px',
                                fontSize: '25px'
                            }}
                        >
                            🌸 🌼 🌺
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* =====================================================
                PROGRESS INDICATOR
            ====================================================== */}

            <div
                style={{
                    position: 'absolute',
                    bottom: '5%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 30,
                    display: 'flex',
                    gap: '8px'
                }}
            >
                {scenes.map((item, index) => (
                    <motion.div
                        key={item}
                        animate={{
                            scale: index === sceneIndex ? 1.5 : 1,
                            opacity: index === sceneIndex ? 1 : 0.35
                        }}
                        style={{
                            width: '7px',
                            height: '7px',
                            borderRadius: '50%',
                            background: '#8c681f'
                        }}
                    />
                ))}
            </div>

            {/* =====================================================
                MAIN BUTTONS
            ====================================================== */}

            <AnimatePresence>
                {scene === 'welcome' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 1, duration: 0.8 }}
                        style={{
                            position: 'absolute',
                            left: '50%',
                            bottom: '9%',
                            transform: 'translateX(-50%)',
                            zIndex: 25,
                            display: 'flex',
                            gap: '14px',
                            flexWrap: 'wrap',
                            justifyContent: 'center'
                        }}
                    >
                        <button
                            onClick={() => onNavigate('design')}
                            style={mainButtonStyle}
                        >
                            Create Pookalam
                        </button>

                        <button
                            onClick={() => onNavigate('gallery')}
                            style={secondaryButtonStyle}
                        >
                            Explore Gallery
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

        </motion.div>
    );
}


/* ================================================================
   REUSABLE COMPONENTS
================================================================ */

function SceneImage({
    show,
    src,
    alt,
    style,
    initial,
    animate
}) {
    return (
        <AnimatePresence>
            {show && (
                <motion.img
                    key={src}
                    src={src}
                    alt={alt}
                    initial={initial}
                    animate={animate}
                    exit={{
                        opacity: 0,
                        scale: 0.9,
                        transition: { duration: 0.6 }
                    }}
                    transition={{
                        duration: 1.1,
                        ease: 'easeOut'
                    }}
                    style={{
                        position: 'absolute',
                        transform: 'translateX(-50%)',
                        objectFit: 'contain',
                        zIndex: 12,
                        filter: 'drop-shadow(0 15px 20px rgba(0,0,0,.18))',
                        ...style
                    }}
                />
            )}
        </AnimatePresence>
    );
}


function SceneCaption({ show, title, text }) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{
                        duration: 0.8,
                        delay: 0.3
                    }}
                    style={{
                        position: 'absolute',
                        left: '50%',
                        top: '12%',
                        transform: 'translateX(-50%)',
                        textAlign: 'center',
                        width: '90%',
                        zIndex: 20,
                        pointerEvents: 'none'
                    }}
                >
                    <div
                        style={{
                            fontFamily: 'Georgia, serif',
                            fontSize: 'clamp(20px, 2vw, 30px)',
                            letterSpacing: '4px',
                            color: '#72541e'
                        }}
                    >
                        {title}
                    </div>

                    <div
                        style={{
                            marginTop: '10px',
                            fontSize: 'clamp(13px, 1.2vw, 18px)',
                            color: '#514538',
                            letterSpacing: '1px'
                        }}
                    >
                        {text}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}


function FloatingPetal({ left, delay, duration }) {
    return (
        <motion.div
            initial={{
                y: '110vh',
                x: 0,
                opacity: 0
            }}
            animate={{
                y: '-20vh',
                x: [0, 30, -20, 25, 0],
                opacity: [0, 0.8, 0.8, 0.5, 0]
            }}
            transition={{
                duration,
                delay,
                repeat: Infinity,
                ease: 'linear'
            }}
            style={{
                position: 'absolute',
                left,
                top: 0,
                zIndex: 5,
                fontSize: '18px',
                pointerEvents: 'none'
            }}
        >
            🌸
        </motion.div>
    );
}


function NavButton({ text, onClick, active }) {
    return (
        <button
            onClick={onClick}
            type="button"
            style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: active ? '#8a651f' : '#55483a',
                fontSize: 'clamp(10px, 0.8vw, 14px)',
                fontWeight: active ? 700 : 500,
                letterSpacing: '1.2px',
                padding: '8px 4px',
                fontFamily: 'Arial, sans-serif',
                transition: 'all .25s ease'
            }}
        >
            {text}
        </button>
    );
}


const mainButtonStyle = {
    border: 'none',
    borderRadius: '30px',
    padding: '13px 28px',
    background: '#8b651e',
    color: '#fffaf0',
    cursor: 'pointer',
    fontSize: '14px',
    letterSpacing: '1px',
    boxShadow: '0 8px 20px rgba(90,60,20,.2)'
};


const secondaryButtonStyle = {
    border: '1px solid rgba(110,80,30,.5)',
    borderRadius: '30px',
    padding: '13px 28px',
    background: 'rgba(255,250,238,.72)',
    color: '#684d21',
    cursor: 'pointer',
    fontSize: '14px',
    letterSpacing: '1px'
};