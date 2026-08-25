// ============================================
// Onam Pookalam Designer — Background Music
// Local file path (drop your MP3 here to override):
//   assets/audio/onam-music.mp3
// Falls back to a royalty-free Onam track automatically.
// ============================================

(function () {
    const LOCAL_SRC   = 'assets/audio/onam-music.mp3';
    // Public-domain Kerala / Carnatic music from Wikimedia Commons
    const FALLBACK_SRC = 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Mohanam_varnam.ogg';
    const STORAGE_KEY = 'pookalam_music_muted';

    // Read persisted mute preference (default: NOT muted)
    let isMuted = sessionStorage.getItem(STORAGE_KEY) === 'true';

    // ---- Create the <audio> element ----
    const audio = document.createElement('audio');
    audio.loop   = true;
    audio.volume = 0.35;
    audio.muted  = isMuted;
    document.body.appendChild(audio);

    // ---- Create the toggle button ----
    const btn = document.createElement('button');
    btn.id = 'musicToggleBtn';
    updateBtn();
    document.body.appendChild(btn);

    function updateBtn() {
        btn.innerHTML = isMuted ? '🔇' : '🎵';
        btn.setAttribute('aria-label', isMuted ? 'Unmute music' : 'Mute music');
        btn.title = isMuted ? 'Unmute music' : 'Mute music';
    }

    btn.addEventListener('click', () => {
        isMuted = !isMuted;
        audio.muted = isMuted;
        sessionStorage.setItem(STORAGE_KEY, isMuted);
        updateBtn();

        // If unmuting and audio was never started, start it now
        if (!isMuted && audio.paused) {
            audio.play().catch(() => {});
        }

        // Gold ripple animation
        btn.classList.remove('music-pulse');
        void btn.offsetWidth;
        btn.classList.add('music-pulse');
    });

    // ---- Try local file first, fall back to remote ----
    function loadAndPlay() {
        audio.src = LOCAL_SRC;
        audio.load();

        audio.play()
            .then(() => { /* local file worked */ })
            .catch(() => {
                // Local file missing or blocked — try fallback URL
                audio.src = FALLBACK_SRC;
                audio.load();
                audio.play().catch(() => {
                    // Still blocked by autoplay policy — unlock on first interaction
                    const unlock = () => {
                        audio.play().catch(() => {});
                        document.removeEventListener('click',      unlock);
                        document.removeEventListener('keydown',    unlock);
                        document.removeEventListener('touchstart', unlock);
                    };
                    document.addEventListener('click',      unlock);
                    document.addEventListener('keydown',    unlock);
                    document.addEventListener('touchstart', unlock);
                });
            });
    }

    loadAndPlay();
})();
