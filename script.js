let hls = null;
let allRadios = [];
let favorites = JSON.parse(localStorage.getItem('radioFavs')) || [];
let currentTab = 'all';

// Inisialisasi Event Listener setelah DOM Siap
document.addEventListener('DOMContentLoaded', () => {
    loadRadios();

    // Event Listener untuk Fitur Pencarian (Ganti onkeyup inline)
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', () => renderRadios());
    }

    // Event Listener untuk Filter Tab (Ganti onclick inline)
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

    // Update jumlah radio untuk UX & Keterbacaan Dynamic Text oleh Search Engine
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
        
        // Optimasi SEO: Mengubah div menjadi tag elemen semantik <article>
        const card = document.createElement('article');
        card.className = 'radio-card';
        card.id = `card-${radio.id}`;
        
        card.innerHTML = `
            <button class="fav-btn" aria-label="Tambah ${radio.title} ke Favorit" data-id="${radio.id}" 
                style="position:absolute; top:10px; right:10px; background:none; border:none; cursor:pointer; font-size:18px; color:${isFav ? '#ff4d4d' : '#ccc'}; z-index:10;">
                ${isFav ? '❤️' : '🤍'}
            </button>
            <div class="card-clickable" data-url="${radio.streamUrl}" data-type="${radio.type}" data-title="${radio.title}" data-id="${radio.id}">
                <img src="${radio.logo}" alt="Live Streaming ${radio.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/150?text=Radio'">
                <h3>${radio.title}</h3>
            </div>`;
        
        // Memasang Event secara internal JavaScript
        card.querySelector('.fav-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFav(Number(radio.id));
        });

        card.querySelector('.card-clickable').addEventListener('click', () => {
            playStream(radio.streamUrl, radio.type, radio.title, radio.id);
        });

        list.appendChild(card);
    });
}

function playStream(url, type, title, id) {
    const audio = document.getElementById('player');
    
    // 1. UPDATE JUDUL TAB BROWSER (Sangat Bagus untuk SEO CTR saat tab di-pin/dibuka user)
    document.title = "▶️ Sedang Memutar: " + title + " | Radio Player Pro";
    
    // 2. UPDATE TEXT DI PLAYER UI
    document.getElementById('now-playing').innerHTML = `🔥 Now Vibe-ing: <b>${title}</b>`;

    document.querySelectorAll('.radio-card').forEach(c => c.classList.remove('playing'));
    const currentCard = document.getElementById(`card-${id}`);
    if (currentCard) currentCard.classList.add('playing');

    if (hls) { 
        hls.destroy(); 
        hls = null; 
    }

    // Pengecekan Protokol Streaming HLS (.m3u8)
    if (url.includes('.m3u8') && typeof Hls !== 'undefined' && Hls.isSupported()) {
        hls = new Hls(); 
        hls.loadSource(url); 
        hls.attachMedia(audio);
        hls.on(Hls.Events.MANIFEST_PARSED, () => audio.play().catch(e => console.log("Autoplay diblokir browser")));
    } else {
        audio.src = url; 
        audio.play().catch(e => console.log("Autoplay diblokir browser"));
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
