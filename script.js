// ========================
// 1. Ambil data dari JSON
// ========================
let radioData = [];
let favorites = JSON.parse(localStorage.getItem('radio_favs')) || [];
let currentStation = null;
let currentTab = 'all';
let hlsInstance = null;

const audio = document.getElementById('audioElement');
const grid = document.getElementById('radioGrid');
const searchBar = document.getElementById('searchBar');
const playerBar = document.getElementById('playerBar');
const btnPlayPause = document.getElementById('btnPlayPause');
const playIcon = document.getElementById('playIcon');
const volumeSlider = document.getElementById('volumeSlider');
const playerStatus = document.getElementById('playerStatus');
const liveDot = document.getElementById('liveDot');
const favCountSpan = document.getElementById('favCount');

// ========================
// 2. Load data dari stations.json
// ========================
async function loadRadioData() {
    try {
        const response = await fetch('./stations.json');
        if (!response.ok) throw new Error('Gagal memuat stations.json');
        radioData = await response.json();
        renderRadio();
    } catch (error) {
        console.error(error);
        grid.innerHTML = `<div class="col-span-full text-center text-red-500 py-10">Gagal memuat data stasiun. Pastikan file stations.json ada dan diakses via server (bukan file://).</div>`;
    }
}

// ========================
// 3. Render kartu radio
// ========================
function renderRadio(filterText = '') {
    if (!radioData.length) return;
    grid.innerHTML = '';

    let filtered = radioData.filter(radio =>
        radio.title.toLowerCase().includes(filterText.toLowerCase())
    );

    if (currentTab === 'fav') {
        filtered = filtered.filter(radio => favorites.includes(radio.id));
    }

    favCountSpan.innerText = favorites.length;

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="col-span-full text-center text-slate-500 py-10">Stasiun tidak ditemukan...</div>`;
        return;
    }

    filtered.forEach(radio => {
        const isFav = favorites.includes(radio.id);
        const isPlayingThis = currentStation && currentStation.id === radio.id && !audio.paused;

        const card = document.createElement('div');
        card.className = `bg-slate-800 border ${isPlayingThis ? 'border-indigo-500 shadow-md shadow-indigo-500/10' : 'border-slate-700'} rounded-xl p-4 flex flex-col items-center justify-between text-center relative hover:border-slate-500 transition-all group`;

        card.innerHTML = `
            <button class="fav-btn absolute top-3 right-3 text-sm cursor-pointer ${isFav ? 'text-rose-500' : 'text-slate-500 group-hover:text-slate-300'}" data-id="${radio.id}">
                <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
            </button>
            <div class="w-20 h-20 bg-white rounded-lg p-1.5 flex items-center justify-center mb-3 border border-slate-700 relative">
                <img src="${radio.logo}" alt="${radio.title}" class="max-w-full max-h-full object-contain" onerror="this.src='https://placehold.co/100x100/1e293b/ffffff?text=Radio'">
                <button class="play-card-btn absolute inset-0 bg-slate-900/60 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-xl" data-id="${radio.id}">
                    <i class="fa-solid ${isPlayingThis ? 'fa-pause' : 'fa-play'}"></i>
                </button>
            </div>
            <h4 class="font-medium text-sm text-slate-200 truncate w-full px-1">${radio.title}</h4>
        `;
        grid.appendChild(card);
    });

    // Re-attach event listeners
    document.querySelectorAll('.fav-btn').forEach(btn => btn.addEventListener('click', toggleFavorite));
    document.querySelectorAll('.play-card-btn').forEach(btn => btn.addEventListener('click', handleCardPlay));
}

// ========================
// 4. Play radio (support HLS & normal)
// ========================
function playRadio(station) {
    currentStation = station;
    playerBar.classList.remove('hidden');
    document.getElementById('currentLogo').src = station.logo;
    document.getElementById('currentTitle').innerText = station.title;

    liveDot.classList.add('hidden');
    playerStatus.innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i> Menghubungkan...';

    if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
    }

    const streamUrl = station.streamUrl;

    // Deteksi HLS (.m3u8)
    if (streamUrl.includes('.m3u8')) {
        if (Hls && Hls.isSupported()) {
            hlsInstance = new Hls();
            hlsInstance.loadSource(streamUrl);
            hlsInstance.attachMedia(audio);
            hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
                audio.play().catch(err => showPlayError(err));
            });
            hlsInstance.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) showPlayError(data);
            });
        } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
            audio.src = streamUrl;
            audio.play().catch(err => showPlayError(err));
        } else {
            playerStatus.innerText = "Browser tidak mendukung HLS.";
        }
    } else {
        audio.src = streamUrl;
        audio.play().catch(err => showPlayError(err));
    }
}

function showPlayError(err) {
    console.warn(err);
    playerStatus.innerText = "⚠️ Gagal memutar streaming.";
    updateUIPlayState(false);
}

function updateUIPlayState(isPlaying) {
    playIcon.className = isPlaying ? "fa-solid fa-pause" : "fa-solid fa-play ml-0.5";
    renderRadio(searchBar.value);
}

// ========================
// 5. Event Handlers
// ========================
function handleCardPlay(e) {
    const id = parseInt(e.currentTarget.getAttribute('data-id'));
    const station = radioData.find(r => r.id === id);
    if (!station) return;

    if (currentStation && currentStation.id === id) {
        if (audio.paused) {
            audio.play();
            updateUIPlayState(true);
        } else {
            audio.pause();
            updateUIPlayState(false);
        }
    } else {
        playRadio(station);
    }
}

function toggleFavorite(e) {
    e.stopPropagation();
    const id = parseInt(e.currentTarget.getAttribute('data-id'));
    if (favorites.includes(id)) {
        favorites = favorites.filter(favId => favId !== id);
    } else {
        favorites.push(id);
    }
    localStorage.setItem('radio_favs', JSON.stringify(favorites));
    renderRadio(searchBar.value);
}

// ========================
// 6. Audio event listeners
// ========================
audio.addEventListener('playing', () => {
    liveDot.classList.remove('hidden');
    playerStatus.innerText = " LIVE / STREAMING";
    updateUIPlayState(true);
});

audio.addEventListener('pause', () => {
    liveDot.classList.add('hidden');
    playerStatus.innerText = " DIHENTIKAN";
    updateUIPlayState(false);
});

audio.addEventListener('error', (e) => {
    console.error("Audio error", e);
    showPlayError(e);
});

btnPlayPause.addEventListener('click', () => {
    if (!currentStation) return;
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
});

volumeSlider.addEventListener('input', (e) => {
    const vol = parseFloat(e.target.value);
    audio.volume = vol;
    const volIcon = document.getElementById('volumeIcon');
    if (vol === 0) volIcon.className = "fa-solid fa-volume-xmark text-slate-500";
    else if (vol < 0.4) volIcon.className = "fa-solid fa-volume-low text-slate-400";
    else volIcon.className = "fa-solid fa-volume-high text-slate-400";
});

// ========================
// 7. Tab & Search
// ========================
document.getElementById('tabAll').addEventListener('click', () => {
    currentTab = 'all';
    document.getElementById('tabAll').className = "px-4 py-1.5 rounded-full text-sm font-medium bg-indigo-600 text-white";
    document.getElementById('tabFav').className = "px-4 py-1.5 rounded-full text-sm font-medium bg-slate-800 text-slate-300 hover:bg-slate-700";
    renderRadio(searchBar.value);
});

document.getElementById('tabFav').addEventListener('click', () => {
    currentTab = 'fav';
    document.getElementById('tabFav').className = "px-4 py-1.5 rounded-full text-sm font-medium bg-indigo-600 text-white";
    document.getElementById('tabAll').className = "px-4 py-1.5 rounded-full text-sm font-medium bg-slate-800 text-slate-300 hover:bg-slate-700";
    renderRadio(searchBar.value);
});

searchBar.addEventListener('input', (e) => renderRadio(e.target.value));

// Inisialisasi volume
audio.volume = volumeSlider.value;

// Mulai dengan memuat data dari JSON
loadRadioData();
