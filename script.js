let hls = null;
let allRadios = [];
let favorites = JSON.parse(localStorage.getItem('radioFavs')) || [];
let currentCategory = 'ALL';

document.addEventListener('DOMContentLoaded', () => {
    loadRadios();

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', () => renderRadios());
    }
});

// MEMBACA BERKAS JSON SECARA ASINKRONUS (FETCH ASYNC)
async function loadRadios() {
    const list = document.getElementById('radio-list');
    try {
        const res = await fetch('radios-id.json?v=' + Date.now());
        if (!res.ok) throw new Error();
        allRadios = await res.json();
        
        // Membaca ketegangan kategori unik secara dinamis dari file JSON
        generateCategoryTabs();
        renderRadios();
    } catch (e) {
        list.innerHTML = `
            <div class="error-box">
                <h4>JSON Gak Ketemu 💀</h4>
                <p>Gagal mengambil data playlist radio, pastikan file "radios-id.json" Anda aman.</p>
            </div>`;
    }
}

// MEMILIH & MENYUNTIKKAN DATA TOMBOL KATEGORI SECARA REAL-TIME
function generateCategoryTabs() {
    const tabsContainer = document.getElementById('category-tabs');
    if (!tabsContainer) return;
    
    // Cek ketersediaan properti kategori dalam JSON, jika tidak ada fallback ke array kosong
    const uniqueCategories = [...new Set(allRadios.filter(r => r.category).map(r => r.category))];
    const finalCategories = ['ALL', 'FAVORIT', ...uniqueCategories];
    
    tabsContainer.innerHTML = '';
    finalCategories.forEach(cat => {
        const button = document.createElement('button');
        button.className = `tab-btn ${cat === currentCategory ? 'active' : ''}`;
        button.innerText = cat === 'ALL' ? '🌈 All Vibes' : (cat === 'FAVORIT' ? '❤️ My Faves' : cat);
        button.onclick = () => switchCategory(cat);
        tabsContainer.appendChild(button);
    });
}

function renderRadios() {
    const list = document.getElementById('radio-list');
    const countElement = document.getElementById('radio-count');
    const keyword = document.getElementById('search-input').value.toLowerCase().trim();

    if (!list) return;

    // Filter data bertingkat: Pencarian Teks DAN Kondisi Tab Filter
    const filteredData = allRadios.filter(radio => {
        const matchesSearch = radio.title.toLowerCase().includes(keyword);
        let matchesTab = false;

        if (currentCategory === 'ALL') {
            matchesTab = true;
        } else if (currentCategory === 'FAVORIT') {
            matchesTab = favorites.includes(Number(radio.id));
        } else {
            matchesTab = radio.category === currentCategory;
        }

        return matchesSearch && matchesTab;
    });

    // Pembaruan teks kuantitas data frekuensi stasiun radio
    if (countElement) {
        if (keyword !== "") {
            countElement.innerText = `Ditemukan ${filteredData.length} stasiun untuk "${keyword}"`;
        } else {
            countElement.innerText = `Streaming ${filteredData.length} Stasiun Radio Pilihan`;
        }
    }

    list.innerHTML = '';

    if (filteredData.length === 0) {
        list.innerHTML = `
            <div class="error-box">
                <h4>Gak Ketemu Nih... 🚩</h4>
                <p>Coba cari kata kunci lain atau periksa tab kategori Anda.</p>
            </div>`;
        return;
    }

    // Suntik komponen elemen kartu stasiun ke DOM Grid
    filteredData.forEach(radio => {
        const isFav = favorites.includes(Number(radio.id));
        const card = document.createElement('div');
        card.className = 'radio-card';
        card.id = `card-${radio.id}`;
        
        card.innerHTML = `
            <button class="fav-btn" aria-label="Favorit" onclick="toggleFav(event, ${radio.id})">
                ${isFav ? '❤️' : '🤍'}
            </button>
            <div onclick="playStream('${radio.streamUrl}', '${radio.type}', '${radio.title}', ${radio.id}, '${radio.logo}')">
                <img src="${radio.logo}" alt="${radio.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/150?text=Radio'">
                <h3>${radio.title}</h3>
            </div>`;
        list.appendChild(card);
    });
}

// EKSEKUSI PEMUTAR AUDIO & DESENTRALISASI LOGO MINI PLAYER
window.playStream = (url, type, title, id, logoUrl) => {
    const audio = document.getElementById('player');
    const miniLogo = document.getElementById('player-current-logo');
    
    document.title = "▶️ " + title + " | Radio Player Pro";
    document.getElementById('now-playing').innerHTML = `🔥 Now Vibe-ing: <b>${title}</b>`;
    
    if (miniLogo && logoUrl) {
        miniLogo.src = logoUrl;
        miniLogo.alt = title;
    }

    document.querySelectorAll('.radio-card').forEach(c => c.classList.remove('playing'));
    const currentCard = document.getElementById(`card-${id}`);
    if (currentCard) currentCard.classList.add('playing');

    if (hls) { hls.destroy(); hls = null; }
    
    if (url.includes('.m3u8') && typeof Hls !== 'undefined' && Hls.isSupported()) {
        hls = new Hls(); 
        hls.loadSource(url); 
        hls.attachMedia(audio);
        hls.on(Hls.Events.MANIFEST_PARSED, () => audio.play().catch(e => console.log("Autoplay blocked")));
    } else {
        audio.src = url; 
        audio.play().catch(e => console.log("Autoplay blocked"));
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
    
    if (currentCategory === 'FAVORIT') {
        renderRadios();
    } else {
        const btn = e.currentTarget;
        btn.innerHTML = favorites.includes(targetId) ? '❤️' : '🤍';
    }
}

function switchCategory(cat) {
    currentCategory = cat;
    document.querySelectorAll('.tab-btn').forEach(btn => {
        const text = btn.innerText;
        const isActive = (cat === 'ALL' && text.includes('All')) || 
                         (cat === 'FAVORIT' && text.includes('Faves')) || 
                         (text === cat);
        btn.classList.toggle('active', isActive);
    });
    renderRadios();
}

function filterRadios() { 
    renderRadios(); 
}
