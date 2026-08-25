// ============================================
// Onam Pookalam Designer — Community Gallery Logic
// Manages community creations from localStorage + curated festive showcases
// ============================================

(function () {
    const STORAGE_KEY = 'pookalam_community_gallery';
    const LIKES_STORAGE_KEY = 'pookalam_gallery_likes';

    const galleryGrid = document.getElementById('communityGalleryGrid');
    const galleryCountBadge = document.getElementById('galleryCountBadge');
    const galleryEmptyState = document.getElementById('galleryEmptyState');
    const filterTabs = document.querySelectorAll('.gallery-tab');

    // Lightbox modal elements
    const lightboxModal = document.getElementById('galleryLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxSubtitle = document.getElementById('lightboxSubtitle');
    const btnCloseLightbox = document.getElementById('btnCloseLightbox');
    const btnLightboxDownload = document.getElementById('btnLightboxDownload');

    let currentFilter = 'all';
    let currentLightboxItem = null;

    // Curated starter showcase items with classic Onam pookalams
    const CURATED_DESIGNS = [
        {
            id: 'curated-1',
            title: 'Royal Mahabali Lotus',
            creator: 'Anjali Menon',
            city: 'Thiruvananthapuram 🪔',
            date: 'Aug 2026',
            img: 'assets/images/circle-1.jpg',
            likes: 42,
            type: 'classic'
        },
        {
            id: 'curated-2',
            title: 'Geometric Star Mandapam',
            creator: 'Rahul & Family',
            city: 'Kochi 🌸',
            date: 'Aug 2026',
            img: 'assets/images/circle-2.jpg',
            likes: 38,
            type: 'classic'
        },
        {
            id: 'curated-3',
            title: 'Heritage Chendumalli Ring',
            creator: 'Devika Nair',
            city: 'Kozhikode 🌼',
            date: 'Aug 2026',
            img: 'assets/images/circle-8.jpg',
            likes: 29,
            type: 'classic'
        },
        {
            id: 'curated-4',
            title: 'Radiant Peacock Wheel',
            creator: 'Sreekanth V.',
            city: 'Thrissur 🦚',
            date: 'Aug 2026',
            img: 'assets/images/circle-14.jpg',
            likes: 56,
            type: 'classic'
        },
        {
            id: 'curated-5',
            title: 'Grand Sunflower Pookalam',
            creator: 'Meera Krishnan',
            city: 'Palakkad 🌻',
            date: 'Aug 2026',
            img: 'assets/images/circle-20.jpg',
            likes: 35,
            type: 'classic'
        },
        {
            id: 'curated-6',
            title: 'Thumba & Chethi Bloom',
            creator: 'Arjun K.',
            city: 'Alappuzha 🌺',
            date: 'Aug 2026',
            img: 'assets/images/circle-16.jpg',
            likes: 47,
            type: 'classic'
        }
    ];

    // Read user likes from localStorage
    function getLikedMap() {
        try {
            return JSON.parse(localStorage.getItem(LIKES_STORAGE_KEY) || '{}');
        } catch {
            return {};
        }
    }

    function saveLikedMap(map) {
        try {
            localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(map));
        } catch {}
    }

    // Read community uploaded items from localStorage
    function getCommunityUploads() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error('Failed to parse community gallery data:', e);
            return [];
        }
    }

    // Combine user creations (newest first) + curated designs
    function getAllGalleryItems() {
        const uploads = getCommunityUploads().map(item => ({ ...item, type: 'community' }));
        return [...uploads, ...CURATED_DESIGNS];
    }

    // Render gallery grid
    function renderGallery() {
        if (!galleryGrid) return;
        galleryGrid.innerHTML = '';

        const allItems = getAllGalleryItems();
        const likedMap = getLikedMap();

        const filtered = allItems.filter(item => {
            if (currentFilter === 'all') return true;
            if (currentFilter === 'community') return item.type === 'community';
            if (currentFilter === 'classic') return item.type === 'classic';
            return true;
        });

        if (galleryCountBadge) {
            galleryCountBadge.textContent = `${filtered.length} ${filtered.length === 1 ? 'Design' : 'Designs'}`;
        }

        if (filtered.length === 0) {
            if (galleryEmptyState) galleryEmptyState.hidden = false;
            return;
        } else {
            if (galleryEmptyState) galleryEmptyState.hidden = true;
        }

        filtered.forEach(item => {
            const isLiked = !!likedMap[item.id];
            const currentLikes = (item.likes || 0) + (isLiked ? 1 : 0);

            const card = document.createElement('div');
            card.className = `gallery-item-card ${item.type === 'community' ? 'community-created' : ''}`;

            card.innerHTML = `
                <div class="gallery-card-img-wrap">
                    <img src="${item.img}" alt="${item.title || 'Pookalam'}" loading="lazy" />
                    ${item.type === 'community' ? '<span class="gallery-badge-new">Community ✨</span>' : ''}
                    <div class="gallery-card-overlay">
                        <span>🔍 Click to Zoom</span>
                    </div>
                </div>
                <div class="gallery-card-body">
                    <div class="gallery-card-meta">
                        <h3 class="gallery-card-creator">${escapeHtml(item.creator || 'Anonymous Creator')}</h3>
                        <p class="gallery-card-caption">${escapeHtml(item.city || item.caption || 'Happy Onam! 🌸')}</p>
                    </div>
                    <div class="gallery-card-actions">
                        <button class="gallery-like-btn ${isLiked ? 'liked' : ''}" data-id="${item.id}" title="Like this Pookalam">
                            <span class="like-heart">${isLiked ? '❤️' : '🤍'}</span>
                            <span class="like-count">${currentLikes}</span>
                        </button>
                        <button class="gallery-download-btn" title="Download Pookalam">
                            <span>📥</span>
                        </button>
                    </div>
                </div>
            `;

            // Click image to open lightbox
            const imgWrap = card.querySelector('.gallery-card-img-wrap');
            imgWrap.addEventListener('click', () => openLightbox(item));

            // Like button
            const likeBtn = card.querySelector('.gallery-like-btn');
            likeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleLike(item.id, likeBtn);
            });

            // Download button
            const downloadBtn = card.querySelector('.gallery-download-btn');
            downloadBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                downloadImage(item.img, `${sanitizeFilename(item.creator || 'pookalam')}-design.png`);
            });

            galleryGrid.appendChild(card);
        });
    }

    function toggleLike(itemId, btnEl) {
        const likedMap = getLikedMap();
        const wasLiked = !!likedMap[itemId];

        if (wasLiked) {
            delete likedMap[itemId];
        } else {
            likedMap[itemId] = true;
        }
        saveLikedMap(likedMap);

        const countEl = btnEl.querySelector('.like-count');
        const heartEl = btnEl.querySelector('.like-heart');
        let currentCount = parseInt(countEl.textContent, 10) || 0;

        if (wasLiked) {
            btnEl.classList.remove('liked');
            heartEl.textContent = '🤍';
            countEl.textContent = Math.max(0, currentCount - 1);
        } else {
            btnEl.classList.add('liked');
            heartEl.textContent = '❤️';
            countEl.textContent = currentCount + 1;

            // Heart pop animation
            btnEl.classList.add('heart-pop');
            setTimeout(() => btnEl.classList.remove('heart-pop'), 400);
        }
    }

    function openLightbox(item) {
        if (!lightboxModal) return;
        currentLightboxItem = item;
        lightboxImg.src = item.img;
        lightboxTitle.textContent = item.title || 'Onam Pookalam';
        lightboxSubtitle.textContent = `Created by ${item.creator || 'Community Artist'} • ${item.city || item.date || 'Onam Celebration'}`;
        lightboxModal.hidden = false;
        lightboxModal.classList.add('show');
    }

    function closeLightbox() {
        if (!lightboxModal) return;
        lightboxModal.hidden = true;
        lightboxModal.classList.remove('show');
        currentLightboxItem = null;
    }

    if (btnCloseLightbox) {
        btnCloseLightbox.addEventListener('click', closeLightbox);
    }

    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) closeLightbox();
        });
    }

    if (btnLightboxDownload) {
        btnLightboxDownload.addEventListener('click', () => {
            if (currentLightboxItem) {
                downloadImage(currentLightboxItem.img, `${sanitizeFilename(currentLightboxItem.creator || 'pookalam')}-design.png`);
            }
        });
    }

    function downloadImage(url, filename) {
        const link = document.createElement('a');
        link.download = filename;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function sanitizeFilename(str) {
        return (str || 'pookalam').toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }

    // Filter tabs listener
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFilter = tab.dataset.filter || 'all';
            renderGallery();
        });
    });

    // Initialize
    renderGallery();
})();
