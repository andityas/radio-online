let hlsInstance = null;
let allRadios = [];
let favorites = JSON.parse(localStorage.getItem('radioFavs')) || [];
let currentTab = 'all';
let currentStation = null;

// DOM elements
const audio = document.getElementById('player');
const searchInput = document.getElementById('search-input');
const tabAll = document.getElementById('tab-all');
const tabFav = document.getElementById('tab-fav');
const radioList = document.getElementById('radio-list');
const radioCount = document.getElementById('radio-count');
const playPauseBtn = document.getElementById('play-pause-btn');
const stopBtn = document.getElementById('stop-btn');
const volumeSlider = document.getElementById('volume-slider');
const nowPlayingDiv = document.getElementById('now-playing');
const avatarWrapper = document.querySelector('.avatar-mini-wrapper');

// Helper: fallback gambar SVG
function handleImageError(img, fallbackText = 'R') {
    img.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%233b82f6'/%3E%3Ctext x='50' y='55' font-size='14' text-anchor='middle' fill='%23ffffff'%3E${fallbackText.charAt(0)}%3C/text%3E%3C/svg%3E`;
}

// Tampilkan ikon default (pemancar radio berdenyut) saat player sepi
function showDefaultPlayerIcon() {
    if (!avatarWrapper) return;
    avatarWrapper.innerHTML = '';
    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-tower-broadcast default-player-icon';
    avatarWrapper.appendChild(icon);
}

// Ganti ikon default dengan gambar logo station
function setPlayerLogo(station) {
    if (!avatarWrapper) return;
    avatarWrapper.innerHTML = '';
    const img = document.createElement('img');
    img.src = station.logo;
    img.alt = station.title;
    img.onerror = () => handleImageError(img, station.title.charAt(0));
    avatarWrapper.appendChild(img);
}

document.addEventListener('DOMContentLoaded', () => {
    loadRadios();
    if (searchInput) searchInput.addEventListener('input', () => renderRadios());
    if (tabAll) tabAll.addEventListener('click', () => switchTab('all'));
    if (tabFav) tabFav.addEventListener('click', () => switchTab('fav'));
    if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlayPause);
    if (stopBtn) stopBtn.addEventListener('click', () => stopPlayback(true));
    if (volumeSlider) volumeSlider.addEventListener('input', (e) => { audio.volume = e.target.value; });
    audio.volume = volumeSlider ? volumeSlider.value : 0.8;

    audio.addEventListener('play', () => {
        playPauseBtn.textContent = '⏸️';
        document.title = `▶️ ${currentStation?.title || 'Radio'} | Radio Player Pro`;
    });
    audio.addEventListener('pause', () => {
        playPauseBtn.textContent = '▶️';
        document.title = 'Radio Player Pro';
    });
    audio.addEventListener('error', () => {
        if (currentStation) {
            nowPlayingDiv.innerHTML = `<b>${currentStation.title}</b><span class="sub-vibe">Gagal memutar</span>`;
        }
    });

    // Tampilkan ikon default di awal
    showDefaultPlayerIcon();
});

async function loadRadios() {
    try {
        const res = await fetch('data.json?v=' + Date.now());
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        allRadios = await res.json();
        console.log('✅ Data loaded:', allRadios.length);
        renderRadios();
    } catch (e) {
        console.error(e);
        radioList.innerHTML = `
            <div style="grid-column:1/-1;text-align:center;padding:40px;">
                ❌ Gagal memuat data. Cek file <strong>data.json</strong>.<br>
                Pesan error: ${e.message}
            </div>`;
        if (radioCount) radioCount.innerText = 'Gagal memuat stasiun';
    }
}

function renderRadios() {
    if (!allRadios.length) return;
    const keyword = searchInput?.value.toLowerCase().trim() || '';
    let filtered = allRadios.filter(r => {
        const matchTab = (currentTab === 'all') || (currentTab === 'fav' && favorites.includes(Number(r.id)));
        const matchSearch = r.title.toLowerCase().includes(keyword);
        return matchTab && matchSearch;
    });

    if (radioCount) {
        radioCount.innerText = keyword ? `Ditemukan ${filtered.length} stasiun untuk "${keyword}"` : `Streaming ${filtered.length} Stasiun Radio Indonesia`;
    }

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
                        <img src="${radio.logo}" alt="${radio.title}" loading="lazy" data-fallback="${radio.title}">
                    </div>
                    <h3>${radio.title}</h3>
                    <span class="live-badge">● LIVE</span>
                </div>
            </article>
        `;
    }).join('');

    // Event listeners dan fallback gambar
    document.querySelectorAll('.radio-card').forEach(card => {
        const clickable = card.querySelector('.card-clickable');
        if (clickable) {
            clickable.addEventListener('click', () => {
                const id = parseInt(card.dataset.id);
                const station = allRadios.find(r => r.id === id);
                if (station) playStream(station);
            });
        }
        const favBtn = card.querySelector('.fav-btn');
        if (favBtn) {
            favBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleFav(parseInt(favBtn.dataset.id));
            });
        }
        const img = card.querySelector('img');
        if (img) {
            if (img.complete && img.naturalWidth === 0) {
                handleImageError(img, img.getAttribute('data-fallback') || 'R');
            } else {
                img.onerror = () => handleImageError(img, img.getAttribute('data-fallback') || 'R');
            }
        }
    });
}

function playStream(station) {
    if (currentStation && currentStation.id === station.id && !audio.paused) return;
    stopPlayback(false);

    currentStation = station;
    nowPlayingDiv.innerHTML = `<b>${station.title}</b><span class="sub-vibe">Now Vibing</span>`;
    setPlayerLogo(station);
    document.title = `▶️ ${station.title} | Radio Player Pro`;

    document.querySelectorAll('.radio-card').forEach(c => c.classList.remove('playing'));
    const activeCard = document.querySelector(`.radio-card[data-id="${station.id}"]`);
    if (activeCard) activeCard.classList.add('playing');

    const isHls = station.streamUrl && station.streamUrl.includes('.m3u8');
    if (isHls && typeof Hls !== 'undefined' && Hls.isSupported()) {
        if (hlsInstance) hlsInstance.destroy();
        hlsInstance = new Hls();
        hlsInstance.loadSource(station.streamUrl);
        hlsInstance.attachMedia(audio);
        hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => audio.play().catch(e => console.warn(e)));
        hlsInstance.on(Hls.Events.ERROR, (_, data) => {
            if (data.fatal) console.error('HLS error', data);
        });
    } else {
        audio.src = station.streamUrl;
        audio.play().catch(e => console.warn(e));
    }
}

function stopPlayback(resetUI = true) {
    if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
    }
    audio.pause();
    audio.src = '';
    audio.load();
    if (resetUI) {
        currentStation = null;
        nowPlayingDiv.innerHTML = `Lagi sepi nih, dengerin sesuatu yuk... 🎧`;
        showDefaultPlayerIcon();
        document.title = 'Radio Player Pro';
        playPauseBtn.textContent = '▶️';
        document.querySelectorAll('.radio-card').forEach(c => c.classList.remove('playing'));
    }
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
        if (tab === 'all') {
            tabAll.classList.add('active');
            tabFav.classList.remove('active');
        } else {
            tabFav.classList.add('active');
            tabAll.classList.remove('active');
        }
    }
    renderRadios();
}
