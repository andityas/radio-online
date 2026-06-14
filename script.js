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
    const countElement = document.getElementById('radio-count');
    const searchInput = document.getElementById('search-input');
    const keyword = searchInput ? searchInput.value.toLowerCase().trim() : "";

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
        list.innerHTML = `
            <div style="grid-column: 1/-1; text-align:center; padding:50px; opacity:0.6;">
                <h4>Gak Ketemu Nih... 🚩</h4>
                <p>Coba cari stasiun lain atau cek playlist favoritmu.</p>
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
                <h3>${radio.title}</h3>
                <span class="live-badge">● LIVE</span>
            </div>`;
        
        card.querySelector('.fav-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFav(Number(radio.id));
        });

        card.querySelector('.card-clickable').addEventListener('click', () => {
            playStream(radio.streamUrl, radio.type, radio.title, radio.id, radio.logo);
        });

        list.appendChild(card);
    });
}

function playStream(url, type, title, id, logoUrl) {
    const audio = document.getElementById('player');
    const miniLogo = document.getElementById('player-current-logo');
    
    document.title = "▶️ " + title + " | Radio Player Pro";
    document.getElementById('now-playing').innerHTML = `<b>${title}</b><span class="sub-vibe">Now Vibing</span>`;
    if(miniLogo && logoUrl) {
        miniLogo.src = logoUrl;
        miniLogo.alt = title;
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
        hls.on(Hls.Events.MANIFEST_PARSED, () => audio.play().catch(e => console.log("Blocked")));
    } else {
        audio.src = url; 
        audio.play().catch(e => console.log("Blocked"));
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
    
    if(tabAll && tabFav) {
        tabAll.classList.toggle('active', tab === 'all');
        tabFav.classList.toggle('active', tab === 'fav');
    }
    renderRadios();
}
