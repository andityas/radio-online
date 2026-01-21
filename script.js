let hls = null;
let allRadios = [];
let favorites = JSON.parse(localStorage.getItem('radioFavs')) || [];
let currentTab = 'all';

// 1. Ambil Data
async function loadRadios() {
    const list = document.getElementById('radio-list');
    try {
        const res = await fetch('radios-id.json');
        allRadios = await res.json();
        renderRadios();
    } catch (error) {
        list.textContent = "Gagal memuat daftar radio. Pastikan file JSON ada.";
    }
}

// 2. Tampilkan ke Layar
function renderRadios() {
    const list = document.getElementById('radio-list');
    const noResults = document.getElementById('no-results');
    const keyword = document.getElementById('search-input').value.toLowerCase();

    let data = allRadios;
    if (currentTab === 'fav') {
        data = allRadios.filter(r => favorites.includes(r.id));
    }

    data = data.filter(r => r.title.toLowerCase().includes(keyword));

    list.innerHTML = '';
    if (data.length === 0) {
        noResults.style.display = 'block';
    } else {
        noResults.style.display = 'grid';
        data.forEach(radio => {
            const isFav = favorites.includes(radio.id);
            const card = document.createElement('div');
            card.className = 'radio-card';
            card.id = `card-${radio.id}`;
            card.innerHTML = `
                <button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFav(event, ${radio.id})">
                    ${isFav ? '❤️' : '🤍'}
                </button>
                <div onclick="playStream('${radio.streamUrl}', '${radio.type}', '${radio.title}', ${radio.id})">
                    <img src="${radio.logo}" alt="${radio.title}">
                    <h3>${radio.title}</h3>
                </div>
            `;
            list.appendChild(card);
        });
    }
}

// 3. Fungsi Play (HLS & Standard)
window.playStream = (url, type, title, id) => {
    const audio = document.getElementById('player');
    const statusText = document.getElementById('now-playing');
    
    // UI Feedback
    document.querySelectorAll('.radio-card').forEach(c => c.classList.remove('playing'));
    document.getElementById(`card-${id}`).classList.add('playing');
    
    statusText.textContent = "🔊 Sedang Memutar: " + title;

    if (hls) { hls.destroy(); hls = null; }

    const streamUrl = url.trim();

    if (type.includes('mpegurl') || streamUrl.includes('.m3u8')) {
        if (Hls.isSupported()) {
            hls = new Hls();
            hls.loadSource(streamUrl);
            hls.attachMedia(audio);
            hls.on(Hls.Events.MANIFEST_PARSED, () => audio.play());
        } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
            audio.src = streamUrl;
            audio.play();
        }
    } else {
        audio.src = streamUrl;
        audio.play();
    }
};

// 4. Fitur Favorit & Tab
function toggleFav(event, id) {
    event.stopPropagation();
    if (favorites.includes(id)) {
        favorites = favorites.filter(favId => favId !== id);
    } else {
        favorites.push(id);
    }
    localStorage.setItem('radioFavs', JSON.stringify(favorites));
    renderRadios();
}

function switchTab(tab) {
    currentTab = tab;
    document.getElementById('tab-all').classList.toggle('active', tab === 'all');
    document.getElementById('tab-fav').classList.toggle('active', tab === 'fav');
    renderRadios();
}

function filterRadios() { renderRadios(); }

loadRadios();