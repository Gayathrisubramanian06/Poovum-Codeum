import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

const LIKES_STORAGE_KEY = 'pookalam_gallery_likes';

export default function GalleryView({ onNavigate }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [likesMap, setLikesMap] = useState({});
    const [filter, setFilter] = useState('all');
    const [lightboxItem, setLightboxItem] = useState(null);

    // Fetch from Supabase on mount
    useEffect(() => {
        async function fetchGallery() {
            setLoading(true);
            setError(null);
            try {
                const { data, error: sbError } = await supabase
                    .from('gallery_items')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (sbError) throw sbError;
                setItems((data || []).map(item => ({ ...item, type: 'community' })));
            } catch (err) {
                console.error('Gallery fetch error:', err);
                setError('Could not load gallery. Check your Supabase credentials in .env.local.');
            } finally {
                setLoading(false);
            }
        }

        fetchGallery();

        // Load per-device likes from localStorage
        try {
            const rawLikes = localStorage.getItem(LIKES_STORAGE_KEY);
            setLikesMap(rawLikes ? JSON.parse(rawLikes) : {});
        } catch (e) {
            console.error('Failed to load likes:', e);
        }
    }, []);

    const filteredItems = items.filter(item => {
        if (filter === 'all') return true;
        if (filter === 'community') return item.type === 'community';
        return true;
    });

    const handleLike = (id, e) => {
        e.stopPropagation();
        const newLikes = { ...likesMap };
        if (newLikes[id]) {
            delete newLikes[id];
        } else {
            newLikes[id] = true;
        }
        setLikesMap(newLikes);
        localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(newLikes));
    };

    const handleDownload = (imgUrl, creator, e) => {
        if (e) e.stopPropagation();
        const link = document.createElement('a');
        link.download = `${(creator || 'pookalam').toLowerCase().replace(/[^a-z0-9]/g, '-')}-design.png`;
        link.href = imgUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col min-h-screen"
        >
            {/* Header */}
            <header className="app-header" style={{ position: 'sticky', background: 'var(--cream)', zIndex: 100 }}>
                <button
                    className="icon-btn"
                    onClick={() => onNavigate('home')}
                    aria-label="Go to Home"
                    type="button"
                >
                    ←
                </button>
                <span className="title">Community Gallery</span>
                <button
                    className="icon-btn"
                    onClick={() => onNavigate('design')}
                    title="Create Pookalam"
                    aria-label="Create Pookalam"
                    type="button"
                >
                    ✨
                </button>
            </header>

            <main className="page gallery-page">
                {/* Hero Banner */}
                <div className="gallery-hero-banner fade-in visible">
                    <div>
                        <h1>🌸 Community Pookalams</h1>
                        <p className="subtitle">Browse festive floral designs created and shared by the community!</p>
                    </div>
                    <button
                        onClick={() => onNavigate('design')}
                        className="hero-btn-solid gallery-create-btn"
                        type="button"
                    >
                        <span>🌸</span> Create Your Own
                    </button>
                </div>

                {/* Filter Tabs */}
                <div className="gallery-filter-bar fade-in visible" data-delay="1">
                    <div className="gallery-tabs" role="tablist">
                        <button
                            className={`gallery-tab ${filter === 'all' ? 'active' : ''}`}
                            onClick={() => setFilter('all')}
                            type="button"
                        >
                            All Designs
                        </button>
                        <button
                            className={`gallery-tab ${filter === 'community' ? 'active' : ''}`}
                            onClick={() => setFilter('community')}
                            type="button"
                        >
                            Community Uploads ✨
                        </button>
                    </div>
                    <span className="gallery-counter">
                        {loading ? 'Loading…' : `${filteredItems.length} ${filteredItems.length === 1 ? 'Design' : 'Designs'}`}
                    </span>
                </div>

                {/* Error Banner */}
                {error && (
                    <div style={{
                        margin: '16px 20px 0',
                        padding: '12px 16px',
                        background: '#fff3cd',
                        border: '1px solid #ffc107',
                        borderRadius: '10px',
                        color: '#856404',
                        fontSize: '13px',
                        fontFamily: 'inherit'
                    }}>
                        ⚠️ {error}
                    </div>
                )}

                {/* Loading Spinner */}
                {loading ? (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '80px 20px',
                        gap: '16px',
                        color: 'var(--text-muted, #888)'
                    }}>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                            style={{ fontSize: '36px', display: 'inline-block' }}
                        >
                            🌸
                        </motion.div>
                        <p style={{ margin: 0, fontSize: '14px' }}>Loading gallery…</p>
                    </div>
                ) : filteredItems.length === 0 ? (
                    /* Empty State */
                    <div className="empty-container fade-in visible">
                        <div className="empty-header">
                            <div className="empty-media">
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="empty-media-svg">
                                    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z"></path>
                                    <path d="m10 11-2 2 2 2"></path>
                                    <path d="m14 15 2-2-2-2"></path>
                                </svg>
                            </div>
                            <h3 className="empty-title">Gallery is Empty</h3>
                            <p className="empty-description">
                                No community designs have been shared yet. Be the first to create and publish your Onam Pookalam!
                            </p>
                        </div>
                        <div className="empty-content">
                            <button
                                onClick={() => onNavigate('design')}
                                className="hero-btn-solid"
                                type="button"
                            >
                                Create Pookalam 🌸
                            </button>
                            <button
                                onClick={() => onNavigate('design')}
                                className="ghost-btn empty-outline-btn"
                                type="button"
                            >
                                Import Outline 📥
                            </button>
                        </div>
                        <button
                            onClick={() => onNavigate('about')}
                            className="empty-link"
                            type="button"
                        >
                            Learn More About Onam Pookalams
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="empty-link-arrow">
                                <line x1="7" y1="17" x2="17" y2="7"></line>
                                <polyline points="7 7 17 7 17 17"></polyline>
                            </svg>
                        </button>
                    </div>
                ) : (
                    /* Gallery Grid */
                    <motion.div layout className="community-gallery-grid">
                        <AnimatePresence mode="popLayout">
                            {filteredItems.map((item) => {
                                const isLiked = !!likesMap[item.id];
                                const currentLikes = (item.likes || 0) + (isLiked ? 1 : 0);

                                return (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, y: 32 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: '-40px' }}
                                        exit={{ opacity: 0, scale: 0.92 }}
                                        transition={{ duration: 0.5, ease: 'easeOut' }}
                                        key={item.id}
                                        className="gallery-item-card community-created"
                                    >
                                        <div
                                            className="gallery-card-img-wrap"
                                            onClick={() => setLightboxItem(item)}
                                        >
                                            <img src={item.img_url} alt={item.title || 'Pookalam'} loading="lazy" />
                                            <span className="gallery-badge-new">Community ✨</span>
                                            <div className="gallery-card-overlay">
                                                <span>🔍 Click to Zoom</span>
                                            </div>
                                        </div>
                                        <div className="gallery-card-body">
                                            <div className="gallery-card-meta">
                                                <h3 className="gallery-card-creator">{item.creator || 'Anonymous Creator'}</h3>
                                                <p className="gallery-card-caption">{item.city || 'Happy Onam! 🌸'}</p>
                                            </div>
                                            <div className="gallery-card-actions">
                                                <button
                                                    className={`gallery-like-btn ${isLiked ? 'liked' : ''}`}
                                                    onClick={(e) => handleLike(item.id, e)}
                                                    title="Like this Pookalam"
                                                    type="button"
                                                >
                                                    <span className="like-heart">{isLiked ? '❤️' : '🤍'}</span>
                                                    <span className="like-count">{currentLikes}</span>
                                                </button>
                                                <button
                                                    className="gallery-download-btn"
                                                    onClick={(e) => handleDownload(item.img_url, item.creator, e)}
                                                    title="Download Pookalam"
                                                    type="button"
                                                >
                                                    <span>📥</span>
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* Lightbox Modal */}
                <AnimatePresence>
                    {lightboxItem && (
                        <div
                            className="modal-overlay show"
                            style={{ display: 'flex' }}
                            onClick={() => setLightboxItem(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="lightbox-card"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    className="lightbox-close"
                                    onClick={() => setLightboxItem(null)}
                                    aria-label="Close"
                                    type="button"
                                >
                                    ✕
                                </button>
                                <div className="lightbox-img-wrap">
                                    <img src={lightboxItem.img_url} alt="Pookalam Zoom" />
                                </div>
                                <div className="lightbox-info">
                                    <div>
                                        <h3>{lightboxItem.title || 'Onam Pookalam'}</h3>
                                        <p className="lightbox-meta">
                                            Created by {lightboxItem.creator || 'Community Artist'} • {lightboxItem.city || lightboxItem.date || 'Onam Celebration'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={(e) => handleDownload(lightboxItem.img_url, lightboxItem.creator, e)}
                                        className="hero-btn-solid animate-none"
                                        style={{ padding: '8px 18px', fontSize: '13px', minWidth: 'auto' }}
                                        type="button"
                                    >
                                        Download 📥
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </main>
        </motion.div>
    );
}
