import React, { useState } from 'react';
import { motion } from 'framer-motion';

/* â”€â”€ Gallery data â”€â”€ */
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
        image: "assets/pookalam.png",
    },
];

/* â”€â”€ Filter list â”€â”€ */
const FILTERS = ["All", "Traditions", "Food", "Culture", "Rituals"];

export default function AboutView({ onNavigate }) {
    const [filter, setFilter] = useState("All");

    const visibleItems =
        filter === "All"
            ? galleryItems
            : galleryItems.filter((item) => item.category === filter);

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

            {/* â”€â”€ Header â”€â”€ */}
            <header className="app-header" style={{ position: 'sticky', background: 'rgba(251,243,227,0.92)', backdropFilter: 'blur(12px)', zIndex: 10, borderBottom: '1px solid rgba(194,112,62,0.18)' }}>
                <button
                    className="icon-btn"
                    onClick={() => onNavigate('home')}
                    aria-label="Back"
                    type="button"
                >
                    â†
                </button>
                <span className="title" style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.06em' }}>About Onam</span>
                <button className="icon-btn" aria-label="Profile" type="button">ðŸ‘¤</button>
            </header>

            {/* â”€â”€ Main â”€â”€ */}
            <main className="page" style={{ flex: 1, padding: '32px 20px 60px', maxWidth: '720px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 2 }}>

                {/* â”€â”€ Hero intro â”€â”€ */}
                <motion.section
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="about-hero-section"
                >
                    {/* Decorative floral row */}
                    <div className="about-floral-row" aria-hidden="true">
                        ðŸŒ¸&nbsp;ðŸŒ¼&nbsp;ðŸŒº&nbsp;ðŸŒ»&nbsp;ðŸŒ¼&nbsp;ðŸŒ¸&nbsp;ðŸŒ·&nbsp;ðŸŒ¸&nbsp;ðŸŒ¼&nbsp;ðŸŒº
                    </div>

                    <div className="about-hero-card">
                        <div className="about-hero-tag">âœ¦ Festival of Kerala âœ¦</div>
                        <h1 className="about-hero-title">What is Onam?</h1>
                        <p className="about-hero-subtitle">An ancient harvest celebration of joy, colour, and community.</p>

                        <div className="about-hero-divider" />

                        <div className="about-hero-paragraphs">
                            <p>
                                Onam is an annual harvest festival celebrated in the Indian state of Kerala.
                                It is the official festival of the state and includes a rich spectrum of
                                cultural events â€” from grand processions to intricate floral art.
                            </p>
                            <p>
                                According to legends, the festival commemorates <strong>King Mahabali</strong>,
                                whose spirit is said to visit Kerala at the time of Onam, blessing his beloved
                                people with prosperity.
                            </p>
                            <p>
                                One of its most iconic traditions is the <strong>Pookalam</strong> â€” a vibrant
                                floral carpet laid on doorsteps to welcome the King home.
                            </p>
                        </div>

                        {/* Fact chips */}
                        <div className="about-fact-chips">
                            <span className="about-chip">ðŸ—“ 10-Day Festival</span>
                            <span className="about-chip">ðŸŒ¾ Harvest Season</span>
                            <span className="about-chip">ðŸ‘‘ King Mahabali</span>
                            <span className="about-chip">ðŸŒº Pookalam</span>
                        </div>
                    </div>
                </motion.section>

                {/* â”€â”€ Gallery section â”€â”€ */}
                <section className="about-gallery-section" id="about-gallery">

                    {/* Header + filters */}
                    <div className="about-gallery-header">
                        <div>
                            <p className="about-eyebrow">Community creations</p>
                            <h2 className="about-gallery-title">
                                Designs shared <em>by you.</em>
                            </h2>
                        </div>

                        <div className="about-filters" aria-label="Filter gallery">
                            {FILTERS.map((f) => (
                                <button
                                    key={f}
                                    type="button"
                                    className={`about-filter-btn${filter === f ? ' active' : ''}`}
                                    onClick={() => setFilter(f)}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Cards */}
                    <div className="about-gallery-grid">
                        {visibleItems.map((item, i) => (
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

                    {/* CTA */}
                    <div className="about-gallery-cta">
                        <div>
                            <p className="about-eyebrow" style={{ color: '#f2c14e' }}>Make it yours</p>
                            <h3 className="about-cta-title">
                                Design your own <em>digital pookalam.</em>
                            </h3>
                        </div>
                        <button
                            className="about-cta-btn"
                            type="button"
                            onClick={() => onNavigate('design')}
                        >
                            Start designing <span>â†—</span>
                        </button>
                    </div>

                </section>
            </main>
        </motion.div>
    );
}
