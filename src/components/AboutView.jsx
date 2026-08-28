import React from 'react';
import { motion } from 'framer-motion';
import SpecularButton from './SpecularButton';

/* —— About Onam Traditions Data —— */
const galleryItems = [
    {
        title: "Maveli comes home",
        category: "Culture",
        caption: "A bright celebration of Maveli and the spirit of Onam.",
        color: "leaf",
        image: "assets/maveli.png",
    },
    {
        title: "The boat song",
        category: "Traditions",
        caption: "Oars in rhythm across the Kerala backwaters.",
        color: "coral",
        image: "assets/boat.png",
    },
    {
        title: "A feast for everyone",
        category: "Food",
        caption: "A banana leaf filled with rice, curries and payasam.",
        color: "leaf",
        image: "assets/sadya.png",
    },
    {
        title: "Pookalam",
        category: "Rituals",
        caption: "Layers of colourful flowers arranged before sunrise.",
        color: "saffron",
        image: "assets/images/pookalam.png",
    },
];

export default function AboutView({ onNavigate }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="flex flex-col min-h-screen"
            style={{ position: 'relative' }}
        >
            {/* Background */}
            <img
                src="assets/onam-background.png"
                alt=""
                style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, pointerEvents: 'none' }}
            />
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(246,237,218,0.55)', zIndex: 1, pointerEvents: 'none' }} />

            {/* Main */}
            <main className="page" style={{ flex: 1, padding: '90px 20px 60px', maxWidth: '720px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 2 }}>

                {/* Hero intro */}
                <motion.section
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="about-hero-section"
                >
                    <div className="about-hero-card">
                        <h1 className="about-hero-title">What is Onam?</h1>
                        <p className="about-hero-subtitle">An ancient harvest celebration of joy, colour, and community.</p>

                        <div className="about-hero-divider" />

                        <div className="about-hero-paragraphs">
                            <p>
                                Onam is an annual harvest festival celebrated in the Indian state of Kerala.
                                It is the official festival of the state and includes a rich spectrum of
                                cultural events — from grand processions to intricate floral art.
                            </p>
                            <p>
                                According to legends, the festival commemorates <strong>King Mahabali</strong>,
                                whose spirit is said to visit Kerala at the time of Onam, blessing his beloved
                                people with prosperity.
                            </p>
                            <p>
                                One of its most iconic traditions is the <strong>Pookalam</strong> — a vibrant
                                floral carpet laid on doorsteps to welcome the King home.
                            </p>
                        </div>
                    </div>
                </motion.section>

                {/* 4 Traditions Cards & CTA */}
                <section className="about-gallery-section" id="about-gallery" style={{ marginTop: '32px' }}>
                    <div className="about-gallery-grid">
                        {galleryItems.map((item, i) => (
                            <motion.article
                                key={item.title}
                                className={`about-gallery-card ${item.color}`}
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35, delay: i * 0.08 }}
                                layout
                            >
                                <div className="about-gallery-visual">
                                    <img src={item.image} alt={item.title} />
                                    <div className="about-card-overlay" />
                                </div>
                                <div className="about-gallery-meta">
                                    <h3>{item.title}</h3>
                                    <p>{item.caption}</p>
                                    <span className="about-category">{item.category}</span>
                                </div>
                            </motion.article>
                        ))}
                    </div>

                    {/* Call To Action */}
                    <div className="about-gallery-cta" style={{ marginTop: '40px' }}>
                        <div>
                            <p className="about-eyebrow" style={{ color: '#f2c14e' }}>Make it yours</p>
                            <h3 className="about-cta-title">
                                Design your own <em>digital pookalam.</em>
                            </h3>
                        </div>
                        <SpecularButton
                            size="md"
                            radius={20}
                            tint="#d97706"
                            tintOpacity={0.25}
                            blur={6}
                            textColor="#ffffff"
                            lineColor="#fef08a"
                            baseColor="#92400e"
                            intensity={1.2}
                            shineSize={15}
                            shineFade={35}
                            thickness={1.5}
                            speed={0.4}
                            followMouse
                            proximity={250}
                            onClick={() => onNavigate('design')}
                            className="about-cta-btn"
                        >
                            Start designing <span>↗</span>
                        </SpecularButton>
                    </div>
                </section>
            </main>
        </motion.div>
    );
}
