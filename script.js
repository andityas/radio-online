let hls = null;
let allRadios = [];
let favorites = JSON.parse(localStorage.getItem('radioFavs')) || [];
let currentTab = 'all';

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
});

async function loadRadios() {
    const list = document.getElementById('radio-list');
    try {
        const res = await fetch('radios-id.json?v=' + Date.now());
        if (!res.ok) throw new Error();
        allRadios = await res.json();
        renderRadios();
    } catch (e) {
        list.innerHTML = `
            <div style="grid-column:1/-1;text-align:center;padding:50px;">
                <h4>JSON Gak Ketemu 💀</h4>
                <p>Cek filenya lagi ya, bestie.</p>
            </div>`;
    }
}

function renderRadios() {
    const list = document.getElementById('radio-list');
    const searchInput = document.getElementById('search-input');
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    if (!list) return;
    list.innerHTML = '';

    let filtered = allRadios.filter(radio => radio.title.toLowerCase().includes(query));

    if (currentTab === 'fav') {
        filtered = filtered.filter(radio => favorites.includes(radio.id));
    }

    if (filtered.length === 0) {
        list.innerHTML = `
            <div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-soft)">
                Mati lampu atau radionya gak ada nih... 🛰️
            </div>`;
        return;
    }

    filtered.forEach(radio => {
        const isFav = favorites.includes(radio.id);
        const card = document.createElement('div');
        card.className = 'radio-card';
        card.id = `card-${radio.id}`;

        // MENYUNTIKKAN STRUKTUR KARTU SEO & AKSESIBILITAS TINGGI
        card.innerHTML = `
            <div class="card-image-container" onclick="playStation(${radio.id}, '${radio.streamUrl}', '${radio.title}', '${radio.logo}')">
                <img src="${radio.logo}" alt="Streaming Live ${radio.title} Indonesia Online" loading="lazy" class="radio-logo">
                <div class="play-overlay">
                    <span class="play-icon-pulse">▶</span>
                </div>
            </div>
            <div class="card-details">
                <h3 class="radio-title-text">${radio.title}</h3>
                <button class="fav-toggle-btn ${isFav ? 'is-fav' : ''}" onclick="toggleFav(${radio.id})" aria-label="Tambah ${radio.title} ke favorit">
                    ${isFav ? '❤️' : '🤍'}
                </button>
            </div>
        `;
        list.appendChild(card);
    });
}

function switchTab(tab) {
    currentTab = tab;
    document.getElementById('tab-all').classList.toggle('active', tab === 'all');
    document.getElementById('tab-fav').classList.toggle('active', tab === 'fav');
    renderRadios();
}

function playStation(id, url, title, logoUrl) {
    const audio = document.getElementById('player');
    const miniLogo = document.getElementById('player-current-logo');
    
    if (!audio) return;

    document.getElementById('now-playing').innerHTML = `<b>${title}</b><span class="sub-vibe">Now Vibing</span>`;
    if(miniLogo && logoUrl) {
        miniLogo.src = logoUrl;
        miniLogo.alt = `Logo ${title} Pemutar Aktif`;
    }

    document.querySelectorAll('.radio-card').forEach(c => c.classList.remove('playing'));
    const currentCard = document.getElementById(`card-${id}`);
    if (currentCard) currentCard.classList.add('playing');

    if (hls) { 
        hls.destroy(); 
        hls = null;
    }

    if (url.includes('.m3u8') && typeof Hls !== 'undefined' && Hls.isSupported()) {
        hls = new Hls(); 
        hls.loadSource(url); 
        hls.attachMedia(audio);
        hls.on(Hls.Events.MANIFEST_PARSED, () => audio.play().catch(e => console.log("Blocked by Browser Policy")));
    } else {
        audio.src = url; 
        audio.play().catch(e => console.log("Blocked by Browser Policy"));
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
