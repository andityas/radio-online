let hlsInstance = null;
let allRadios = [];
let favorites = JSON.parse(localStorage.getItem('radioFavs')) || [];
let currentTab = 'all';
let currentStation = null;
let audio = document.getElementById('player');
let isPlaying = false;

// DOM elements
const searchInput = document.getElementById('search-input');
const tabAll = document.getElementById('tab-all');
const tabFav = document.getElementById('tab-fav');
const radioList = document.getElementById('radio-list');
const radioCount = document.getElementById('radio-count');
const playPauseBtn = document.getElementById('play-pause-btn');
const playPauseIcon = document.getElementById('play-pause-icon');
const stopBtn = document.getElementById('stop-btn');
const volumeSlider = document.getElementById('volume-slider');
const nowPlayingDiv = document.getElementById('now-playing');
const currentLogo = document.getElementById('player-current-logo');

document.addEventListener('DOMContentLoaded', () => {
    loadRadios();
    if (searchInput) searchInput.addEventListener('input', () => renderRadios());
    if (tabAll) tabAll.addEventListener('click', () => switchTab('all'));
    if (tabFav) tabFav.addEventListener('click', () => switchTab('fav'));
    if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlayPause);
    if (stopBtn) stopBtn.addEventListener('click', stopPlayback);
    if (volumeSlider) volumeSlider.addEventListener('input', (e) => { audio.volume = e.target.value; });
    audio.volume = volumeSlider ? volumeSlider.value : 0.8;
    audio.addEventListener('play', () => {
        isPlaying = true;
        playPauseIcon.textContent = '⏸️';
        document.title = `▶️ ${currentStation?.title || 'Radio'} | Radio Player Pro`;
    });
    audio.addEventListener('pause', () => {
        isPlaying = false;
        playPauseIcon.textContent = '▶️';
        document.title = 'Radio Player Pro';
    });
});

async function loadRadios() {
    try {
        const res = await fetch('radios-id.json?v=' + Date.now());
        if (!res.ok) throw new Error();
        allRadios = await res.json();
        // Perbaiki streamUrl untuk Gen FM dan Jak 101 jika perlu (gunakan HLS)
        allRadios = allRadios.map(r => {
            if (r.id === 2) r.streamUrl = 'https://wz.mari.co.id:1936/web_genfm/genfm/playlist.m3u8';
            if (r.id === 3) r.streamUrl = 'https://wz.mari.co.id:1936/web_jakfm/jakfm/playlist.m3u8';
            return r;
        });
        renderRadios();
    } catch (e) {
        radioList.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;">❌ Gagal memuat data. Cek koneksi atau file JSON.</div>`;
    }
}

function renderRadios() {
    const keyword = searchInput?.value.toLowerCase().trim() || '';
    let filtered = allRadios.filter(r => {
        const matchTab = (currentTab === 'all') || (currentTab === 'fav' && favorites.includes(Number(r.id)));
        const matchSearch = r.title.toLowerCase().includes(keyword);
        return matchTab && matchSearch;
    });

    radioCount.innerText = keyword ? `Ditemukan ${filtered.length} stasiun untuk "${keyword}"` : `Streaming ${filtered.length} Stasiun Radio Indonesia`;

    if (filtered.length === 0) {
        radioList.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;">😢 Stasiun tidak ditemukan.</div>`;
        return;
    }

    radioList.innerHTML = filtered.map(radio => {
        const isFav = favorites.includes(Number(radio.id));
        const isActive = currentStation && currentStation.id === radio.id && !audio.paused;
        return `
            <article class="radio-card ${isActive ? 'playing' : ''}" data-id="${radio.id}">
                <button class="fav-btn" data-id="${radio.id}">${isFav ? '❤️' : '🤍'}</button>
                <div class="card-clickable">
                    <div class="img-frame">
                        <img src="${radio.logo}" alt="${radio.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/100?text=Radio'">
                    </div>
                    <h3>${radio.title}</h3>
                    <span class="live-badge">● LIVE</span>
                </div>
            </article>
        `;
    }).join('');

    // Attach event listeners
    document.querySelectorAll('.radio-card').forEach(card => {
        card.querySelector('.card-clickable')?.addEventListener('click', () => {
            const id = parseInt(card.dataset.id);
            const station = allRadios.find(r => r.id === id);
            if (station) playStream(station);
        });
        const favBtn = card.querySelector('.fav-btn');
        if (favBtn) favBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFav(parseInt(favBtn.dataset.id));
        });
    });
}

function playStream(station) {
    if (currentStation && currentStation.id === station.id && !audio.paused) return;
    stopPlayback(false); // stop current but don't hide UI

    currentStation = station;
    nowPlayingDiv.innerHTML = `<b>${station.title}</b><span class="sub-vibe">Now Vibing</span>`;
    currentLogo.src = station.logo;
    currentLogo.alt = station.title;
    document.title = `▶️ ${station.title} | Radio Player Pro`;
    
    // Highlight card
    document.querySelectorAll('.radio-card').forEach(c => c.classList.remove('playing'));
    const activeCard = document.querySelector(`.radio-card[data-id="${station.id}"]`);
    if (activeCard) activeCard.classList.add('playing');

    const isHls = station.streamUrl.includes('.m3u8');
    if (isHls && typeof Hls !== 'undefined' && Hls.isSupported()) {
        if (hlsInstance) hlsInstance.destroy();
        hlsInstance = new Hls();
        hlsInstance.loadSource(station.streamUrl);
        hlsInstance.attachMedia(audio);
        hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => audio.play().catch(e => console.warn(e)));
        hlsInstance.on(Hls.Events.ERROR, (_, data) => { if (data.fatal) console.error('HLS error'); });
    } else {
        audio.src = station.streamUrl;
        audio.play().catch(e => console.warn(e));
    }
}

function stopPlayback(hideUI = true) {
    if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
    }
    audio.pause();
    audio.src = '';
    audio.load();
    currentStation = null;
    if (hideUI) {
        nowPlayingDiv.innerHTML = `Lagi sepi nih, dengerin sesuatu yuk... 🎧`;
        currentLogo.src = 'https://via.placeholder.com/150?text=Radio';
        document.title = 'Radio Player Pro';
    }
    document.querySelectorAll('.radio-card').forEach(c => c.classList.remove('playing'));
}

function togglePlayPause() {
    if (!currentStation) return;
    if (audio.paused) {
        audio.play().catch(e => console.warn(e));
    } else {
        audio.pause();
    }
}

function toggleFav(id) {
    if (favorites.includes(id)) {
        favorites = favorites.filter(f => f !== id);
    } else {
        favorites.push(id);
    }
    localStorage.setItem('radioFavs', JSON.stringify(favorites));
    renderRadios();
}

function switchTab(tab) {
    currentTab = tab;
    if (tabAll && tabFav) {
        tabAll.classList.toggle('active', tab === 'all');
        tabFav.classList.toggle('active', tab === 'fav');
    }
    renderRadios();
}
