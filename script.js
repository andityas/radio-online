let hls = null;
let allRadios = [];
let favorites = JSON.parse(localStorage.getItem('radioFavs')) || [];
let currentTab = 'all';

async function loadRadios() {
    const list = document.getElementById('radio-list');
    try {
        const res = await fetch('radios-id.json?v=' + Date.now());
        if (!res.ok) throw new Error("Gagal load JSON");
        allRadios = await res.json();
        renderRadios();
    } catch (error) {
        list.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding:50px;">
            <h4>Koneksi Bermasalah 🚩</h4>
            <p>Coba refresh halaman atau cek file JSON lo.</p>
        </div>`;
    }
}

function renderRadios() {
    const list = document.getElementById('radio-list');
    const searchInput = document.getElementById('search-input');
    const keyword = searchInput ? searchInput.value.toLowerCase().trim() : "";

    // 1. Filter data secara gabungan (Tab + Search)
    const filteredData = allRadios.filter(radio => {
        const isFavMatch = (currentTab === 'all') || (currentTab === 'fav' && favorites.includes(Number(radio.id)));
        const isSearchMatch = radio.title.toLowerCase().includes(keyword);
        return isFavMatch && isSearchMatch;
    });

    // 2. Kosongkan list
    list.innerHTML = '';

    // 3. Logika Tampilan: Jika Kosong
    if (filteredData.length === 0) {
        let title = "Waduh, Gak Ketemu Nih... 🚩";
        let desc = "Coba cek lagi keyword pencarianmu, bestie.";

        if (currentTab === 'fav' && keyword === "") {
            title = "Belum Ada Favorit ❤️";
            desc = "Klik ikon hati di stasiun radio biar muncul di sini.";
        }

        // Kita bikin elemen error langsung di sini, gak usah ambil dari luar
        list.innerHTML = `
            <div style="grid-column: 1 / -1; display: flex; justify-content: center; align-items: center; min-height: 300px; width: 100%;">
                <div style="text-align: center; background: rgba(255, 255, 255, 0.05); padding: 40px; border-radius: 25px; border: 1px dashed #444; width: 100%; max-width: 400px;">
                    <h4 style="color: #1db954; margin-bottom: 8px;">${title}</h4>
                    <p style="color: #888; font-size: 13px; margin: 0;">${desc}</p>
                </div>
            </div>
        `;
        return; // Stop fungsi di sini
    }

    // 4. Logika Tampilan: Jika Ada Data
    filteredData.forEach(radio => {
        const isFav = favorites.includes(Number(radio.id));
        const card = document.createElement('div');
        card.className = 'radio-card';
        card.id = `card-${radio.id}`;
        card.innerHTML = `
            <button class="fav-btn" onclick="toggleFav(event, ${radio.id})" 
                style="position:absolute; top:15px; right:15px; background:rgba(0,0,0,0.5); border:none; border-radius:50%; width:30px; height:30px; cursor:pointer; color:${isFav ? '#ff4d4d' : '#ccc'}; transition: 0.2s;">
                ${isFav ? '❤️' : '🤍'}
            </button>
            <div onclick="playStream('${radio.streamUrl}', '${radio.type}', '${radio.title}', ${radio.id})">
                <img src="${radio.logo}" alt="${radio.title}" style="width: 100%; border-radius: 15px; aspect-ratio: 1/1; object-fit: cover;">
                <h3 style="font-size:13px; margin-top:10px">${radio.title}</h3>
            </div>
        `;
        list.appendChild(card);
    });
}

function toggleFav(event, id) {
    event.stopPropagation();
    const targetId = Number(id);

    if (favorites.includes(targetId)) {
        favorites = favorites.filter(favId => favId !== targetId);
    } else {
        favorites.push(targetId);
    }

    localStorage.setItem('radioFavs', JSON.stringify(favorites));
    renderRadios();
}

window.playStream = (url, type, title, id) => {
    const audio = document.getElementById('player');
    const status = document.getElementById('now-playing');
    status.textContent = "🔥 Playing: " + title;

    document.querySelectorAll('.radio-card').forEach(c => c.classList.remove('playing'));
    const activeCard = document.getElementById(`card-${id}`);
    if (activeCard) activeCard.classList.add('playing');

    if (hls) { hls.destroy(); hls = null; }

    if (type.includes('mpegurl') || url.includes('.m3u8')) {
        if (Hls.isSupported()) {
            hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(audio);
            hls.on(Hls.Events.MANIFEST_PARSED, () => audio.play());
        }
    } else {
        audio.src = url;
        audio.play();
    }
};

function switchTab(tab) {
    currentTab = tab;
    document.getElementById('tab-all').classList.toggle('active', tab === 'all');
    document.getElementById('tab-fav').classList.toggle('active', tab === 'fav');
    renderRadios();
}

function filterRadios() {
    renderRadios();
}

loadRadios();