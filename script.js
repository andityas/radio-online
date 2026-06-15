let hls = null;
let allRadios = [];
let favorites = JSON.parse(localStorage.getItem('radioFavs')) || [];
let currentTab = 'all';

async function loadRadios() {
    const list = document.getElementById('radio-list');
    try {
        const res = await fetch('radios-id.json?v=' + Date.now());
        if (!res.ok) throw new Error();
        allRadios = await res.json();
        renderRadios();
    } catch (e) {
        list.innerHTML = `<div style=\"grid-column:1/-1;text-align:center;padding:50px;\">
            <h4>JSON Gak Ketemu 💀</h4><p>Cek filenya lagi ya, bestie.</p>
        </div>`;
    }
}

function renderRadios() {
    const list = document.getElementById('radio-list');
    const countElement = document.getElementById('radio-count');
    const keyword = document.getElementById('search-input').value.toLowerCase().trim();

    const data = allRadios.filter(r => {
        const isFav = (currentTab === 'all') || (currentTab === 'fav' && favorites.includes(Number(r.id)));
        const isMatch = r.title.toLowerCase().includes(keyword);
        return isFav && isMatch;
    });

    // UPDATE JUMLAH RADIO DINAMIS
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
        
        card.innerHTML = `
            <button class="fav-btn" aria-label="Favorit" onclick="toggleFav(event, ${radio.id})" 
                style="position:absolute; top:10px; right:10px; background:none; border:none; cursor:pointer; font-size:18px; color:${isFav ? '#ff4d4d' : '#ccc'}; z-index:10;">
                ${isFav ? '❤️' : '🤍'}
            </button>
            <div onclick="playStream('${radio.streamUrl}', '${radio.type}', '${radio.title}', ${radio.id})">
                <img src="${radio.logo}" alt="Streaming ${radio.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/150?text=Radio'">
                <h3>${radio.title}</h3>
            </div>`;
        list.appendChild(card);
    });
}

// FUNGSI PLAY & DYNAMIC TITLE
window.playStream = (url, type, title, id) => {
    const audio = document.getElementById('player');
    
    // 1. UPDATE JUDUL TAB BROWSER (DYNAMIC TITLE)
    document.title = "▶️ " + title + " | Radio Player Pro";
    
    // 2. UPDATE TEXT DI PLAYER UI
    document.getElementById('now-playing').innerHTML = `🔥 Now Vibe-ing: <b>${title}</b>`;

    document.querySelectorAll('.radio-card').forEach(c => c.classList.remove('playing'));
    const currentCard = document.getElementById(`card-${id}`);
    if (currentCard) currentCard.classList.add('playing');

    if (hls) { hls.destroy(); hls = null; }
    if (url.includes('.m3u8') && Hls.isSupported()) {
        hls = new Hls(); hls.loadSource(url); hls.attachMedia(audio);
        hls.on(Hls.Events.MANIFEST_PARSED, () => audio.play().catch(e => console.log("Autoplay blocked")));
    } else {
        audio.src = url; audio.play().catch(e => console.log("Autoplay blocked"));
    }
};

function toggleFav(e, id) {
    e.stopPropagation();
    const targetId = Number(id);
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
    document.getElementById('tab-all').classList.toggle('active', tab === 'all');
    document.getElementById('tab-fav').classList.toggle('active', tab === 'fav');
    renderRadios();
}

function filterRadios() { renderRadios(); }

// Jalankan load data
loadRadios();
