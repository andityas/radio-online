// Data stasiun akan diambil dari data.json
let radioData = [];

// Sistem favorit
let favorites = JSON.parse(localStorage.getItem('radio_favs')) || [];
let currentStation = null;
let currentTab = 'all';
let hlsInstance = null;

// Elemen DOM
const audio = document.getElementById('audioElement');
const grid = document.getElementById('radioGrid');
const searchBar = document.getElementById('searchBar');
const playerBar = document.getElementById('playerBar');
const btnPlayPause = document.getElementById('btnPlayPause');
const playIcon = document.getElementById('playIcon');
const volumeSlider = document.getElementById('volumeSlider');
const playerStatus = document.getElementById('playerStatus');
const liveDot = document.getElementById('liveDot');

// Prioritas kategori
const categoryOrder = {
    'Pop': 1,
    'Berita': 2,
    'Nostalgia': 3,
    'Rock': 4,
    'Dangdut': 5,
    'Komunitas': 6,
    'Regional': 7,
    'General': 8
};

// Fungsi render kartu radio
function renderRadio(filterText = '') {
    grid.innerHTML = '';
    let filtered = radioData.filter(r => r.title.toLowerCase().includes(filterText.toLowerCase()));
    if (currentTab === 'fav') {
        filtered = filtered.filter(r => favorites.includes(r.id));
    }
    // Urutkan berdasarkan kategori
    filtered.sort((a, b) => (categoryOrder[a.category] || 99) - (categoryOrder[b.category] || 99));
    document.getElementById('favCount').innerText = favorites.length;

    if (filtered.length === 0) {
        grid.innerHTML = '<div class="col-span-full text-center text-slate-500 py-10">Stasiun tidak ditemukan...</div>';
        return;
    }

    filtered.forEach(radio => {
        const isFav = favorites.includes(radio.id);
        const isPlaying = currentStation && currentStation.id === radio.id && !audio.paused;
        const card = document.createElement('div');
        card.className = `bg-slate-800 border ${isPlaying ? 'border-indigo-500 shadow-md shadow-indigo-500/10' : 'border-slate-700'} rounded-xl p-4 flex flex-col items-center justify-between text-center relative hover:border-slate-500 transition-all group`;
        card.innerHTML = `
            <button class="fav-btn absolute top-3 right-3 text-sm cursor-pointer transition-colors ${isFav ? 'text-rose-500' : 'text-slate-500 group-hover:text-slate-300'}" data-id="${radio.id}">
                <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
            </button>
            <div class="w-20 h-20 bg-white rounded-lg p-1.5 flex items-center justify-center mb-3 border border-slate-700 relative">
                <img src="${radio.logo}" alt="${radio.title}" class="max-w-full max-h-full object-contain" onerror="this.src='https://placehold.co/100x100/1e293b/ffffff?text=Radio'">
                <button class="play-card-btn absolute inset-0 bg-slate-900/60 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-xl" data-id="${radio.id}">
                    <i class="fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'}"></i>
                </button>
            </div>
            <h4 class="font-medium text-sm text-slate-200 truncate w-full px-1">${radio.title}</h4>
        `;
        grid.appendChild(card);
    });

    // Event listener
    document.querySelectorAll('.fav-btn').forEach(btn => btn.addEventListener('click', toggleFavorite));
    document.querySelectorAll('.play-card-btn').forEach(btn => btn.addEventListener('click', handleCardPlay));
}

// Putar radio
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

    if (station.streamUrl.includes('.m3u8')) {
        if (Hls.isSupported()) {
            hlsInstance = new Hls();
            hlsInstance.loadSource(station.streamUrl);
            hlsInstance.attachMedia(audio);
            hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
                audio.play().catch(() => showPlayError());
            });
        } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
            audio.src = station.streamUrl;
            audio.play().catch(() => showPlayError());
        } else {
            playerStatus.innerText = "Browser Anda tidak mendukung HLS.";
        }
    } else {
        audio.src = station.streamUrl;
        audio.play().catch(() => showPlayError());
    }
    updateUIPlayState(true);
}

function showPlayError() {
    playerStatus.innerText = "⚠️ Gagal memutar streaming.";
    updateUIPlayState(false);
}

function updateUIPlayState(isPlaying) {
    playIcon.className = isPlaying ? "fa-solid fa-pause" : "fa-solid fa-play ml-0.5";
    renderRadio(searchBar.value);
}

// Handler tombol play di kartu
function handleCardPlay(e) {
    const id = parseInt(e.currentTarget.dataset.id);
    const station = radioData.find(r => r.id === id);
    if (!station) return;
    if (currentStation && currentStation.id === id) {
        audio.paused ? audio.play() : audio.pause();
        updateUIPlayState(!audio.paused);
    } else {
        playRadio(station);
    }
}

// Toggle favorit
function toggleFavorite(e) {
    e.stopPropagation();
    const id = parseInt(e.currentTarget.dataset.id);
    if (favorites.includes(id)) {
        favorites = favorites.filter(fid => fid !== id);
    } else {
        favorites.push(id);
    }
    localStorage.setItem('radio_favs', JSON.stringify(favorites));
    renderRadio(searchBar.value);
}

// Event audio
audio.addEventListener('playing', () => {
    liveDot.classList.remove('hidden');
    playerStatus.innerText = " LIVE / STREAMING";
});
audio.addEventListener('pause', () => {
    liveDot.classList.add('hidden');
    playerStatus.innerText = " DIHENTIKAN";
    updateUIPlayState(false);
});

// Tombol play/pause global
btnPlayPause.addEventListener('click', () => {
    if (!currentStation) return;
    if (audio.paused) {
        audio.play();
        updateUIPlayState(true);
    } else {
        audio.pause();
        updateUIPlayState(false);
    }
});

// Volume slider
volumeSlider.addEventListener('input', (e) => {
    const vol = e.target.value;
    audio.volume = vol;
    const icon = document.getElementById('volumeIcon');
    if (vol == 0) icon.className = "fa-solid fa-volume-xmark text-slate-500";
    else if (vol < 0.4) icon.className = "fa-solid fa-volume-low text-slate-400";
    else icon.className = "fa-solid fa-volume-high text-slate-400";
});

// Pencarian
searchBar.addEventListener('input', (e) => renderRadio(e.target.value));

// Tab
document.getElementById('tabAll').addEventListener('click', function() {
    currentTab = 'all';
    this.className = "px-4 py-1.5 rounded-full text-sm font-medium bg-indigo-600 text-white transition-colors cursor-pointer";
    document.getElementById('tabFav').className = "px-4 py-1.5 rounded-full text-sm font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer";
    renderRadio(searchBar.value);
});
document.getElementById('tabFav').addEventListener('click', function() {
    currentTab = 'fav';
    this.className = "px-4 py-1.5 rounded-full text-sm font-medium bg-indigo-600 text-white transition-colors cursor-pointer";
    document.getElementById('tabAll').className = "px-4 py-1.5 rounded-full text-sm font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer";
    renderRadio(searchBar.value);
});

// Ambil data dari JSON lalu render
fetch('data.json')
    .then(response => {
        if (!response.ok) throw new Error('Gagal memuat data');
        return response.json();
    })
    .then(data => {
        radioData = data;
        audio.volume = volumeSlider.value;
        renderRadio();
    })
    .catch(error => {
        console.error(error);
        grid.innerHTML = '<div class="col-span-full text-center text-rose-400 py-10">Gagal memuat data stasiun. Periksa file data.json</div>';
    });
