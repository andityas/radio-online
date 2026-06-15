let hls = null;
let currentCategory = 'ALL';
let favorites = JSON.parse(localStorage.getItem('radioFavs')) || [];

// Database stasiun radio internal yang telah diperbaiki format dan analisis kategorinya secara objektif
const allRadios = [
    { "id": 1, "category": "Pop", "title": "Delta FM Jakarta", "logo": "https://cdn.onlineradiobox.com/img/l/8/58058.v32.png", "streamUrl": "https://stream.rcs.revma.com/k02rmq48kxcwv", "type": "audio/mpeg" },
    { "id": 2, "category": "Dangdut", "title": "Mettaswara Dangdut", "logo": "https://cdn.onlineradiobox.com/img/l/9/124069.v7.png", "streamUrl": "https://mettaswara.com:8700/d4d", "type": "audio/mpeg" },
    { "id": 3, "category": "Pop", "title": "iSwara FM Jakarta", "logo": "https://cdn.onlineradiobox.com/img/l/9/18959.v12.png", "streamUrl": "https://stream.radiojar.com/4ywdgup3bnzuv", "type": "audio/mpeg" },
    { "id": 4, "category": "Pop", "title": "Prambors FM Jakarta", "logo": "https://cdn.onlineradiobox.com/img/l/7/18687.v44.png", "streamUrl": "https://stream.rcs.revma.com/h77wwp48kxcwv", "type": "audio/mpeg" },
    { "id": 5, "category": "Berita", "title": "Radio Elshinta Jakarta", "logo": "https://cdn.onlineradiobox.com/img/l/2/18812.v17.png", "streamUrl": "https://stream-ssl.arenastreaming.com:8000/jakarta", "type": "audio/mpeg" },
    { "id": 6, "category": "Lainnya", "title": "Dengerin Musik", "logo": "https://cdn.onlineradiobox.com/img/l/8/18908.v17.png", "streamUrl": "https://stream.denger.in/musik.mp3", "type": "audio/mpeg" },
    { "id": 7, "category": "Dangdut", "title": "Radio Imelda FM", "logo": "https://cdn.onlineradiobox.com/img/l/7/19177.v15.png", "streamUrl": "https://server.radioimeldafm.co.id:8030/imeldafm", "type": "audio/mpeg" },
    { "id": 8, "category": "Berita", "title": "Sonora FM Jakarta", "logo": "https://cdn.onlineradiobox.com/img/l/6/19176.v16.png", "streamUrl": "https://sonora-radio.arenastreaming.com/8130/stream", "type": "audio/mpeg" },
    { "id": 9, "category": "Dangdut", "title": "Gajahmada FM", "logo": "https://cdn.onlineradiobox.com/img/l/6/19016.v10.png", "streamUrl": "https://server.radioimeldafm.co.id:8040/gajahmadafm", "type": "audio/mpeg" },
    { "id": 10, "category": "Rock", "title": "The Rockin Life", "logo": "https://cdn.onlineradiobox.com/img/l/0/18880.v17.png", "streamUrl": "https://stream.radiojar.com/7csmg90fuqruv", "type": "audio/mpeg" },
    { "id": 11, "category": "Berita", "title": "Suara Surabaya FM", "logo": "https://cdn.onlineradiobox.com/img/l/8/18988.v10.png", "streamUrl": "https://c5.siar.us/proxy/ssfm/stream", "type": "audio/mpeg" },
    { "id": 12, "category": "Pop", "title": "FeMale Radio Jakarta", "logo": "https://cdn.onlineradiobox.com/img/l/6/60996.v19.png", "streamUrl": "https://stream.rcs.revma.com/9thenqqd2ncwv", "type": "audio/mpeg" },
    { "id": 13, "category": "Pop", "title": "Jak 101 FM Jakarta", "logo": "https://cdn.onlineradiobox.com/img/l/5/19705.v45.png", "streamUrl": "https://wz.mari.co.id:1936/web_jakfm/jakfm/playlist.m3u8", "type": "audio/mpeg" },
    { "id": 14, "category": "Pop", "title": "Trax FM Jakarta", "logo": "https://cdn.onlineradiobox.com/img/l/6/18806.v13.png", "streamUrl": "https://stream.radiojar.com/rrqf78p3bnzuv", "type": "audio/mpeg" },
    { "id": 15, "category": "Pop", "title": "OZ Radio Bandung", "logo": "https://cdn.onlineradiobox.com/img/l/5/18985.v26.png", "streamUrl": "https://streaming.ozradio.id:8443/ozbandung", "type": "audio/mpeg" },
    { "id": 16, "category": "Pop", "title": "Ardan Radio Bandung", "logo": "https://cdn.onlineradiobox.com/img/l/7/18827.v12.png", "streamUrl": "https://stream.rcs.revma.com/ugpyzu9n5k3vv", "type": "audio/mpeg" },
    { "id": 17, "category": "Pop", "title": "Bahana FM Jakarta", "logo": "https://cdn.onlineradiobox.com/img/l/8/19708.v25.png", "streamUrl": "https://s1.cloudmu.id/listen/bahana_fm/stream", "type": "audio/mpeg" },
    { "id": 18, "category": "Nostalgia", "title": "Big 90's", "logo": "https://cdn.onlineradiobox.com/img/l/6/92666.v8.png", "streamUrl": "https://stream.zeno.fm/qmqe8k5e74zuv", "type": "audio/mpeg" },
    { "id": 19, "category": "Pop", "title": "Gen FM Jakarta", "logo": "https://cdn.onlineradiobox.com/img/l/6/19026.v38.png", "streamUrl": "https://wz.mari.co.id:1936/web_genfm/genfm/playlist.m3u8", "type": "audio/mpeg" },
    { "id": 20, "category": "Nostalgia", "title": "Golden Memories", "logo": "https://cdn.onlineradiobox.com/img/l/0/110170.v4.png", "streamUrl": "https://stream.zeno.fm/xg7mcgf1bf9uv", "type": "audio/mpeg" },
    { "id": 21, "category": "Rock", "title": "Kis Rock", "logo": "https://cdn.onlineradiobox.com/img/l/0/106040.v7.png", "streamUrl": "https://stream.zeno.fm/2nbxgbynb18uv", "type": "audio/mpeg" },
    { "id": 22, "category": "Dangdut", "title": "Nagaswara Radiotemen Bogor", "logo": "https://cdn.onlineradiobox.com/img/l/2/19152.v27.png", "streamUrl": "https://live.nagaswarafm.com/nagaswararadio/stream", "type": "audio/mpeg" },
    { "id": 23, "category": "Rock", "title": "Rock Ballads", "logo": "https://cdn.onlineradiobox.com/img/l/4/110904.v2.png", "streamUrl": "https://stream.zeno.fm/ynepvmy14bhvv", "type": "audio/mpeg" },
    { "id": 24, "category": "Rock", "title": "Rock Rewind", "logo": "https://cdn.onlineradiobox.com/img/l/0/89300.v15.png", "streamUrl": "https://stream.zenolive.com/u18tuaphwzzuv.aac", "type": "audio/mpeg" },
    { "id": 25, "category": "Nostalgia", "title": "Slow Radio", "logo": "https://cdn.onlineradiobox.com/img/l/6/91316.v16.png", "streamUrl": "https://stream.zeno.fm/dpk2zq5np2zuv", "type": "audio/mpeg" }
];

// Inisialisasi komponen Tabs Kategori otomatis dari data array
function generateCategoryTabs() {
    const tabsContainer = document.getElementById('category-tabs');
    // Ambil data unik kategori luar data array
    const categories = ['ALL', 'FAVORIT', ...new Set(allRadios.map(radio => radio.category))];
    
    tabsContainer.innerHTML = '';
    categories.forEach(cat => {
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

    // Penyaringan ganda berdasarkan pencarian kata dan filter tab aktif
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

    // Perbarui jumlah status teks di bar atas secara dinamis
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
                <p>Coba cari kata kunci lain atau periksa tab filter kamu.</p>
            </div>`;
        return;
    }

    filteredData.forEach(radio => {
        const isFav = favorites.includes(Number(radio.id));
        const card = document.createElement('div');
        card.className = 'radio-card';
        card.id = `card-${radio.id}`;
        
        card.innerHTML = `
            <button class="fav-btn" aria-label="Favorit" onclick="toggleFav(event, ${radio.id})">
                ${isFav ? '❤️' : '🤍'}
            </button>
            <div onclick="playStream('${radio.streamUrl}', '${radio.type}', '${radio.title}', ${radio.id})">
                <img src="${radio.logo}" alt="Streaming ${radio.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/150?text=Radio'">
                <h3>${radio.title}</h3>
            </div>`;
        list.appendChild(card);
    });
}

window.playStream = (url, type, title, id) => {
    const audio = document.getElementById('player');
    
    document.title = "▶️ " + title + " | Radio Player Pro";
    document.getElementById('now-playing').innerHTML = `<b>${title}</b>`;

    document.querySelectorAll('.radio-card').forEach(c => c.classList.remove('playing'));
    const currentCard = document.getElementById(`card-${id}`);
    if (currentCard) currentCard.classList.add('playing');

    if (hls) { hls.destroy(); hls = null; }
    
    if (url.includes('.m3u8') && Hls.isSupported()) {
        hls = new Hls(); 
        hls.loadSource(url); 
        hls.attachMedia(audio);
        hls.on(Hls.Events.MANIFEST_PARSED, () => audio.play().catch(e => console.log("Autoplay ditolak browser")));
    } else {
        audio.src = url; 
        audio.play().catch(e => console.log("Autoplay ditolak browser"));
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
    
    // Jika berada di tab favorit, render ulang untuk menghapus item yang di-unfavorite langsung
    if (currentCategory === 'FAVORIT') {
        renderRadios();
    } else {
        // Cukup perbarui visual tombol hati tanpa memuat ulang grid
        const btn = e.currentTarget;
        const isFav = favorites.includes(targetId);
        btn.innerHTML = isFav ? '❤️' : '🤍';
    }
}

function switchCategory(cat) {
    currentCategory = cat;
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText.includes(cat) || (cat === 'ALL' && btn.innerText.includes('All')) || (cat === 'FAVORIT' && btn.innerText.includes('Faves')));
    });
    renderRadios();
}

function filterRadios() { 
    renderRadios(); 
}

// Booting Aplikasi
generateCategoryTabs();
renderRadios();
