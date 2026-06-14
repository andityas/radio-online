let hls = null;
let allRadios = [];
let favorites = JSON.parse(localStorage.getItem('radioFavs')) || [];
let currentTab = 'all';
let currentAudio = null;

// Data fallback jika JSON gagal dimuat (3 stasiun populer)
const FALLBACK_RADIOS = [
    { id: 1, title: "Prambors FM Jakarta", logo: "https://cdn.onlineradiobox.com/img/l/7/18687.v44.png", streamUrl: "https://stream.rcs.revma.com/h77wwp48kxcwv", type: "audio/mpeg", favorite: false },
    { id: 2, title: "Ardan Radio Bandung", logo: "https://cdn.onlineradiobox.com/img/l/7/18827.v12.png", streamUrl: "https://stream.rcs.revma.com/ugpyzu9n5k3vv", type: "audio/mpeg", favorite: false },
    { id: 3, title: "Delta FM Jakarta", logo: "https://cdn.onlineradiobox.com/img/l/8/58058.v32.png", streamUrl: "https://stream.rcs.revma.com/k02rmq48kxcwv", type: "audio/mpeg", favorite: false }
];

document.addEventListener('DOMContentLoaded', () => {
    loadRadios();

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', () => renderRadios());
    }

    const tabAll = document.getElementById('tab-all');
    const tabFav = document.getElementById('tab-fav');
    if (tabAll && tabFav) {
        tabAll.addEventListener('click', () => switchTab('all'));
        tabFav.addEventListener('click', () => switchTab('fav'));
    }

    // Tangani jika autoplay diblokir (beri petunjuk klik pertama)
    const audioPlayer = document.getElementById('player');
    if (audioPlayer) {
        audioPlayer.addEventListener('error', (e) => {
            console.warn("Audio error", e);
            const nowPlaying = document.getElementById('now-playing');
            if (nowPlaying) nowPlaying.innerHTML = `<b>Gagal memutar</b><span class="sub-vibe">Coba stasiun lain</span>`;
        });
    }
});

async function loadRadios() {
    const list = document.getElementById('radio-list');
    if (!list) return;

    try {
        // Coba load dari file radios-id.json
        const res = await fetch('radios-id.json?v=' + Date.now());
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
            allRadios = data;
            renderRadios();
            return;
        } else {
            throw new Error("Data kosong");
        }
    } catch (err) {
        console.error("Gagal load radios-id.json:", err);
        // Tampilkan pesan error yang informatif
        let errorMsg = "";
        if (err.message === "Failed to fetch") {
            errorMsg = "Tidak dapat mengakses file radios-id.json. Pastikan Anda menjalankan aplikasi melalui server (bukan file://). Gunakan Live Server di VS Code atau 'python -m http.server'.";
        } else {
            errorMsg = `Gagal memuat data: ${err.message}. Gunakan data cadangan.`;
        }
        
        // Tampilkan di container
        list.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding:30px; background:#111; border-radius:20px;">
                <h3>⚠️ Gagal memuat data stasiun</h3>
                <p style="color:#ff8888">${errorMsg}</p>
                <p>Menampilkan ${FALLBACK_RADIOS.length} stasiun contoh.</p>
                <button id="retry-load" style="margin-top:15px; padding:8px 20px; background:#1db954; border:none; border-radius:30px; color:black; font-weight:bold; cursor:pointer;">Coba Lagi</button>
            </div>
        `;
        // Gunakan fallback data
        allRadios = [...FALLBACK_RADIOS];
        renderRadios();
        
        // Pasang event retry
        const retryBtn = document.getElementById('retry-load');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                loadRadios(); // reload ulang
            });
        }
        return;
    }
    
    renderRadios();
}

function renderRadios() {
    const list = document.getElementById('radio-list');
    const countElement = document.getElementById('radio-count');
    const searchInput = document.getElementById('search-input');
    const keyword = searchInput ? searchInput.value.toLowerCase().trim() : "";

    if (!allRadios.length) {
        if (list) list.innerHTML = '<div>Belum ada data stasiun.</div>';
        return;
    }

    const data = allRadios.filter(r => {
        const isFav = (currentTab === 'all') || (currentTab === 'fav' && favorites.includes(Number(r.id)));
        const isMatch = r.title.toLowerCase().includes(keyword);
        return isFav && isMatch;
    });

    if (countElement) {
        if (keyword !== "") {
            countElement.innerText = `Ditemukan ${data.length} stasiun untuk "${keyword}"`;
        } else {
            countElement.innerText = `Streaming ${data.length} Stasiun Radio Indonesia`;
        }
    }

    if (!list) return;
    list.innerHTML = '';

    if (data.length === 0) {
        list.innerHTML = `
            <div style="grid-column: 1/-1; text-align:center; padding:50px; opacity:0.6;">
                <h4>Gak Ketemu Nih... 🚩</h4>
                <p>${currentTab === 'fav' ? 'Belum ada stasiun favorit. Tambahkan dengan klik ikon 🤍 di card.' : 'Coba kata kunci lain.'}</p>
            </div>`;
        return;
    }

    data.forEach(radio => {
        const isFav = favorites.includes(Number(radio.id));
        const card = document.createElement('article');
        card.className = 'radio-card';
        card.id = `card-${radio.id}`;
        
        card.innerHTML = `
            <button class="fav-btn" aria-label="Tambah ${radio.title} ke Favorit" data-id="${radio.id}">
                ${isFav ? '❤️' : '🤍'}
            </button>
            <div class="card-clickable">
                <div class="img-frame">
                    <img src="${radio.logo}" alt="Live Streaming ${radio.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/150?text=Radio'">
                </div>
                <h3>${escapeHtml(radio.title)}</h3>
                <span class="live-badge">● LIVE</span>
            </div>`;
        
        const favBtn = card.querySelector('.fav-btn');
        favBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFav(Number(radio.id));
        });

        const clickable = card.querySelector('.card-clickable');
        clickable.addEventListener('click', () => {
            playStream(radio.streamUrl, radio.type, radio.title, radio.id, radio.logo);
        });

        list.appendChild(card);
    });
}

function playStream(url, type, title, id, logoUrl) {
    const audio = document.getElementById('player');
    const miniLogo = document.getElementById('player-current-logo');
    
    // Update title browser
    document.title = "▶️ " + title + " | Radio Player Pro";
    
    // Update text dan logo di player bar
    const nowPlayingDiv = document.getElementById('now-playing');
    if (nowPlayingDiv) {
        nowPlayingDiv.innerHTML = `<b>${escapeHtml(title)}</b><span class="sub-vibe">Now Vibing</span>`;
    }
    if (miniLogo && logoUrl) {
        miniLogo.src = logoUrl;
        miniLogo.alt = title;
    }

    // Highlight card yang sedang diputar
    document.querySelectorAll('.radio-card').forEach(c => c.classList.remove('playing'));
    const currentCard = document.getElementById(`card-${id}`);
    if (currentCard) currentCard.classList.add('playing');

    // Hentikan HLS sebelumnya
    if (hls) {
        hls.destroy();
        hls = null;
    }

    // Jika stream .m3u8 dan HLS tersedia
    if (url.includes('.m3u8') && typeof Hls !== 'undefined' && Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(audio);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            audio.play().catch(e => console.log("Autoplay blocked:", e));
        });
        hls.on(Hls.Events.ERROR, (event, data) => {
            console.error("HLS Error", data);
            if (nowPlayingDiv) nowPlayingDiv.innerHTML = `<b>${escapeHtml(title)}</b><span class="sub-vibe">Stream error</span>`;
        });
    } else {
        audio.src = url;
        audio.play().catch(e => {
            console.log("Play blocked:", e);
            if (nowPlayingDiv) nowPlayingDiv.innerHTML = `<b>${escapeHtml(title)}</b><span class="sub-vibe">Klik play manual</span>`;
        });
    }
}

function toggleFav(targetId) {
    if (favorites.includes(targetId)) {
        favorites = favorites.filter(f => f !== targetId);
    } else {
        favorites.push(targetId);
    }
    localStorage.setItem('radioFavs', JSON.stringify(favorites));
    renderRadios();
}

function switchTab(tab) {
    currentTab = tab;
    const tabAll = document.getElementById('tab-all');
    const tabFav = document.getElementById('tab-fav');
    
    if (tabAll && tabFav) {
        tabAll.classList.toggle('active', tab === 'all');
        tabFav.classList.toggle('active', tab === 'fav');
    }
    renderRadios();
}

// Helper untuk menghindari XSS
function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}
