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
const currentLogo = document.getElementById('player-current-logo');
let playPauseIcon = playPauseBtn; // karena tombol berisi teks emoji

document.addEventListener('DOMContentLoaded', () => {
    loadRadios();
    if (searchInput) searchInput.addEventListener('input', () => renderRadios());
    if (tabAll) tabAll.addEventListener('click', () => switchTab('all'));
    if (tabFav) tabFav.addEventListener('click', () => switchTab('fav'));
    if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlayPause);
    if (stopBtn) stopBtn.addEventListener('click', stopPlayback);
    if (volumeSlider) volumeSlider.addEventListener('input', (e) => { audio.volume = e.target.value; });
    audio.volume = volumeSlider ? volumeSlider.value : 0.8;
    
    // Audio events
    audio.addEventListener('play', () => {
        playPauseBtn.textContent = '⏸️';
        document.title = `▶️ ${currentStation?.title || 'Radio'} | Radio Player Pro`;
    });
    audio.addEventListener('pause', () => {
        playPauseBtn.textContent = '▶️';
        document.title = 'Radio Player Pro';
    });
    audio.addEventListener('error', () => {
        console.warn('Stream error');
        if (currentStation) {
            nowPlayingDiv.innerHTML = `<b>${currentStation.title}</b><span class="sub-vibe">Gagal memutar</span>`;
        }
    });
});

async function loadRadios() {
    try {
        // Gunakan data.json yang sudah berisi 52 stasiun dengan HLS untuk Gen & Jak
        const res = await fetch('data.json?v=' + Date.now());
        if (!res.ok) throw new Error();
        allRadios = await res.json();
        renderRadios();
    } catch (e) {
        radioList.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;">❌ Gagal memuat data. Pastikan file data.json ada.</div>`;
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
    });
}

function playStream(station) {
    if (currentStation && currentStation.id === station.id && !audio.paused) return;
    
    // Stop current playback
    stopPlayback(false); // false = jangan reset UI sepenuhnya
    
    currentStation = station;
    nowPlayingDiv.innerHTML = `<b>${station.title}</b><span class="sub-vibe">Now Vibing</span>`;
    currentLogo.src = station.logo;
    currentLogo.alt = station.title;
    document.title = `▶️ ${station.title} | Radio Player Pro`;
    
    // Highlight active card
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
            if (data.fatal) console.error('HLS error');
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
        currentLogo.src = 'https://via.placeholder.com/150?text=Radio';
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
    renderRadios(); // refresh tampilan
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
