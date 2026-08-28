import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import SpecularButton from './SpecularButton';

const LIKES_STORAGE_KEY = 'pookalam_gallery_likes';

export default function GalleryView({ onNavigate }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [likesMap, setLikesMap] = useState({});
    const [lightboxItem, setLightboxItem] = useState(null);

    // Fetch user published Pookalams on mount
    useEffect(() => {
        async function fetchGallery() {
            setLoading(true);
            setError(null);
            
            const hasSupabase = 
                import.meta.env.VITE_SUPABASE_URL && 
                import.meta.env.VITE_SUPABASE_ANON_KEY && 
                import.meta.env.VITE_SUPABASE_URL !== 'YOUR_SUPABASE_PROJECT_URL' && 
                import.meta.env.VITE_SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY';

            let communityData = [];

            // 1. Try fetching from Supabase
            if (hasSupabase) {
                try {
                    const { data, error: sbError } = await supabase
                        .from('gallery_items')
                        .select('*')
                        .order('created_at', { ascending: false });

                    if (!sbError && data) {
                        communityData = data.map(item => ({ ...item, type: 'community' }));
                    }
                } catch (err) {
                    console.error('Gallery Supabase fetch error:', err);
                }
            }

            // 2. Always merge LocalStorage published items
            try {
                const rawUploads = localStorage.getItem('pookalam_community_gallery');
                const localUploads = rawUploads ? JSON.parse(rawUploads) : [];
                
                localUploads.forEach(localItem => {
                    if (!communityData.some(item => item.id === localItem.id || item.img_url === localItem.img_url)) {
                        communityData.push({ ...localItem, type: 'community' });
                    }
                });
            } catch (e) {
                console.error('Failed to load local uploads:', e);
            }

            // Display ONLY user-uploaded/published Pookalam designs
            setItems(communityData);
            setLoading(false);
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
            style={{ position: 'relative' }}
        >
            {/* Background */}
            <img
                src="assets/onam-background.png"
                alt=""
                style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, pointerEvents: 'none' }}
            />
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(246,237,218,0.18)', zIndex: 1, pointerEvents: 'none' }} />

            <main className="page gallery-page" style={{ position: 'relative', zIndex: 2, paddingTop: '90px' }}>
                {/* Hero Banner */}
                <div className="gallery-hero-banner fade-in visible">
                    <div>
                        <h1>Community Pookalams</h1>
                        <p className="subtitle">Browse festive floral designs created and shared by the community!</p>
                    </div>
                </div>

                {/* Main Action Bar */}
                <div className="gallery-filter-bar fade-in visible" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px 0 28px' }}>
                    <SpecularButton
                        size="md"
                        radius={24}
                        tint="#d97706"
                        tintOpacity={0.9}
                        blur={6}
                        textColor="#ffffff"
                        lineColor="#fef08a"
                        baseColor="#92400e"
                        intensity={1.4}
                        shineSize={16}
                        shineFade={35}
                        thickness={1.8}
                        speed={0.4}
                        followMouse
                        proximity={300}
                        autoAnimate={true}
                        onClick={() => onNavigate('design')}
                        className="gallery-create-btn"
                    >
                        Create Your Own
                    </SpecularButton>
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
                        {error}
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
                            <svg viewBox="0 0 24 24" width="36" height="36" fill="#d97706"><path d="M12 2C8 6 4 12 12 22C20 12 16 6 12 2Z"/></svg>
                        </motion.div>
                        <p style={{ margin: 0, fontSize: '14px' }}>Loading community gallery…</p>
                    </div>
                ) : items.length === 0 ? (
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
                        <button
                            onClick={() => onNavigate('about')}
                            className="empty-link"
                            type="button"
                            style={{ marginTop: '20px' }}
                        >
                            Learn More About Onam Pookalams
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="empty-link-arrow">
                                <line x1="7" y1="17" x2="17" y2="7"></line>
                                <polyline points="7 7 17 7 17 17"></polyline>
                            </svg>
                        </button>
                    </div>
                ) : (
                    /* Community Gallery Grid */
                    <motion.div layout className="community-gallery-grid">
                        <AnimatePresence mode="popLayout">
                            {items.map((item) => {
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
                                            <span className="gallery-badge-new">Community</span>
                                            <div className="gallery-card-overlay">
                                                <span>Click to Zoom</span>
                                            </div>
                                        </div>
                                        <div className="gallery-card-body">
                                            <div className="gallery-card-meta">
                                                <h3 className="gallery-card-creator">{item.creator || 'Anonymous Creator'}</h3>
                                                <p className="gallery-card-caption">{item.city || 'Happy Onam!'}</p>
                                            </div>
                                            <div className="gallery-card-actions">
                                                <button
                                                    className={`gallery-like-btn ${isLiked ? 'liked' : ''}`}
                                                    onClick={(e) => handleLike(item.id, e)}
                                                    title="Like this Pookalam"
                                                    type="button"
                                                >
                                                    <span className="like-heart">
                                                        <svg fill={isLiked ? "#e74c3c" : "none"} stroke="#e74c3c" strokeWidth="2" viewBox="0 0 24 24" width="16" height="16"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                                                    </span>
                                                    <span className="like-count">{currentLikes}</span>
                                                </button>
                                                <button
                                                    className="gallery-download-btn"
                                                    onClick={(e) => handleDownload(item.img_url, item.creator, e)}
                                                    title="Download Pookalam"
                                                    type="button"
                                                >
                                                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
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
                                <div className="lightbox-info">
                                    <div className="lightbox-img-wrap">
                                        <img src={lightboxItem.img_url} alt="Pookalam Zoom" />
                                    </div>
                                    <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--brown-dark)' }}>{lightboxItem.title || 'Onam Pookalam'}</h3>
                                            <p className="lightbox-meta" style={{ margin: '4px 0 0', fontSize: '13px', color: '#666' }}>
                                                Created by {lightboxItem.creator || 'Community Artist'} • {lightboxItem.city || lightboxItem.date || 'Onam Celebration'}
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => handleDownload(lightboxItem.img_url, lightboxItem.creator, e)}
                                            className="hero-btn-solid animate-none"
                                            style={{ padding: '8px 18px', fontSize: '13px', minWidth: 'auto' }}
                                            type="button"
                                        >
                                            Download
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </main>
        </motion.div>
    );
}
