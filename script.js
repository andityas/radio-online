let hls = null;
let allRadios = [];
let favorites = JSON.parse(localStorage.getItem('radioFavs')) || [];
let currentTab = 'all';
let currentPlayingId = null;

// Load data dari file JSON
async function loadRadios() {
    const list = document.getElementById('radio-list');
    try {
        const res = await fetch('radios-id.json?v=' + Date.now());
        if (!res.ok) throw new Error();
        allRadios = await res.json();
        renderRadios();
    } catch (e) {
        list.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:50px;">
            <h4>JSON Gak Ketemu 💀</h4><p>Cek filenya lagi ya, bestie.</p>
        </div>`;
    }
}

// Render daftar radio
function renderRadios() {
    const list = document.getElementById('radio-list');
    const countElement = document.getElementById('radio-count');
    const keyword = document.getElementById('search-input').value.toLowerCase().trim();

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

    list.innerHTML = '';

    if (data.length === 0) {
        list.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding:50px; opacity:0.6;">
            <h4>Gak Ketemu Nih... 🚩</h4><p>Coba cari stasiun lain atau cek playlist favoritmu.</p>
        </div>`;
        return;
    }

    data.forEach(radio => {
        const isFav = favorites.includes(Number(radio.id));
        const card = document.createElement('div');
        card.className = 'radio-card';
        card.id = `card-${radio.id}`;
        if (currentPlayingId === radio.id) card.classList.add('playing');
        
        // Escape string untuk menghindari error jika ada kutip
        const escapedUrl = radio.streamUrl.replace(/'/g, "\\'");
        const escapedTitle = radio.title.replace(/'/g, "\\'");
        const escapedLogo = radio.logo.replace(/'/g, "\\'");
        
        card.innerHTML = `
            <button class="fav-btn" aria-label="Favorit" onclick="toggleFav(event, ${radio.id})">
                ${isFav ? '❤️' : '🤍'}
            </button>
            <div onclick="playStream('${escapedUrl}', '${radio.type}', '${escapedTitle}', ${radio.id})">
                <img src="${radio.logo}" alt="Streaming ${radio.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/150?text=Radio'">
                <h3>${radio.title}</h3>
            </div>`;
        list.appendChild(card);
    });
}

// Fungsi utama play stream (dengan perbaikan untuk semua radio)
window.playStream = (url, type, title, id) => {
    const audio = document.getElementById('player');
    const nowPlayingDiv = document.getElementById('now-playing');
    
    // Update UI
    document.title = "▶️ " + title + " | Radio Player Pro";
    nowPlayingDiv.innerHTML = `🔥 Now Vibe-ing: <b>${title}</b>`;
    currentPlayingId = id;

    // Highlight card
    document.querySelectorAll('.radio-card').forEach(c => c.classList.remove('playing'));
    const currentCard = document.getElementById(`card-${id}`);
    if (currentCard) currentCard.classList.add('playing');

    // Hancurkan HLS sebelumnya jika ada
    if (hls) {
        try { hls.destroy(); } catch(e) { console.warn(e); }
        hls = null;
    }

    // Hapus event error lama untuk menghindari multiple handler
    audio.onerror = null;
    // Reset audio element secara menyeluruh
    audio.pause();
    audio.src = '';
    audio.load();

    // Cek apakah stream HLS
    const isHls = (type === 'application/x-mpegURL') || url.includes('.m3u8');
    
    if (isHls && Hls.isSupported()) {
        hls = new Hls({ enableWorker: true, fragLoadingTimeOut: 30000 });
        hls.loadSource(url);
        hls.attachMedia(audio);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            audio.play().catch(e => {
                console.log("Autoplay diblokir, user perlu klik play manual:", e);
                nowPlayingDiv.innerHTML = `🎵 ${title} siap, klik play untuk mulai mendengarkan`;
            });
        });
        
        hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
                console.error("HLS fatal error:", data);
                nowPlayingDiv.innerHTML = `⚠️ Gagal memutar ${title}, stream mungkin offline. Coba stasiun lain.`;
                if (hls) hls.destroy();
                hls = null;
            }
        });
    } else {
        // Stream biasa (MP3, AAC, dll)
        audio.src = url;
        audio.load();
        
        // Tangani error jika stream gagal dimuat
        audio.onerror = () => {
            console.error(`Gagal memuat stream: ${url}`);
            nowPlayingDiv.innerHTML = `❌ Stream ${title} tidak dapat diakses. Mungkin sedang offline.`;
        };
        
        audio.play().catch(e => {
            console.log("Autoplay diblokir, user perlu klik play manual:", e);
            nowPlayingDiv.innerHTML = `🔊 ${title} - klik play jika tidak otomatis`;
        });
    }
};

// Toggle favorit
window.toggleFav = (e, id) => {
    e.stopPropagation();
    const targetId = Number(id);
    if (favorites.includes(targetId)) {
        favorites = favorites.filter(f => f !== targetId);
    } else {
        favorites.push(targetId);
    }
    localStorage.setItem('radioFavs', JSON.stringify(favorites));
    renderRadios();
};

// Switch tab
window.switchTab = (tab) => {
    currentTab = tab;
    document.getElementById('tab-all').classList.toggle('active', tab === 'all');
    document.getElementById('tab-fav').classList.toggle('active', tab === 'fav');
    renderRadios();
};

// Filter pencarian
window.filterRadios = () => renderRadios();

// Jalankan load data
loadRadios();

// Bersihkan HLS saat halaman ditutup
window.addEventListener('beforeunload', () => {
    if (hls) {
        try { hls.destroy(); } catch(e) {}
    }
});
