let hls = null;
let allRadios = [];
let favorites = JSON.parse(localStorage.getItem('radioFavs')) || [];
let currentTab = 'all';

async function loadRadios() {
    const list = document.getElementById('radio-list');
    try {
        const res = await fetch('radios-id.json?v=' + Date.now());
        allRadios = await res.json();
        renderRadios();
    } catch (error) {
        list.innerHTML = `<div id="no-results" style="display:flex">
            <div class="no-results-content"><h4>JSON Error 🚩</h4><p>File JSON gak kebaca atau gak ada, cek lagi ya!</p></div>
        </div>`;
    }
}

function renderRadios() {
    const list = document.getElementById('radio-list');
    const noResults = document.getElementById('no-results');
    const errorTitle = document.getElementById('error-title');
    const errorDesc = document.getElementById('error-desc');
    
    // Pastikan input search ada, kalau gak ada kasih string kosong
    const searchInput = document.getElementById('search-input');
    const keyword = searchInput ? searchInput.value.toLowerCase().trim() : "";

    // 1. Bersihkan list dulu biar gak tumpang tindih
    list.innerHTML = '';

    // 2. Filter Berdasarkan Tab & Keyword
    let filteredData = allRadios;
    
    if (currentTab === 'fav') {
        filteredData = allRadios.filter(r => favorites.includes(parseInt(r.id)));
    }
    
    if (keyword !== "") {
        filteredData = filteredData.filter(r => r.title.toLowerCase().includes(keyword));
    }

    // 3. Logika Tampilan
    if (filteredData.length === 0) {
        noResults.style.display = 'flex';
        
        if (currentTab === 'fav' && keyword === "") {
            errorTitle.textContent = "Belum Ada Favorit ❤️";
            errorDesc.textContent = "Klik ikon hati di radio favoritmu biar muncul di sini.";
        } else {
            errorTitle.textContent = "Waduh, Gak Ketemu Nih... 🚩";
            errorDesc.textContent = "Coba cek lagi keyword pencarianmu, bestie.";
        }
        
        list.appendChild(noResults);
    } else {
        // SEMBUNYIKAN no-results kalau ada data
        noResults.style.display = 'none';
        
        filteredData.forEach(radio => {
            const isFav = favorites.includes(parseInt(radio.id));
            const card = document.createElement('div');
            card.className = 'radio-card';
            card.id = `card-${radio.id}`;
            card.innerHTML = `
                <button class="fav-btn" onclick="toggleFav(event, ${radio.id})" 
                    style="position:absolute; top:15px; right:15px; background:rgba(0,0,0,0.5); border:none; border-radius:50%; width:30px; height:30px; cursor:pointer; color:${isFav ? '#ff4d4d' : '#ccc'}">
                    ${isFav ? '❤️' : '🤍'}
                </button>
                <div onclick="playStream('${radio.streamUrl}', '${radio.type}', '${radio.title}', ${radio.id})">
                    <img src="${radio.logo}" alt="${radio.title}">
                    <h3 style="font-size:13px; margin-top:10px">${radio.title}</h3>
                </div>
            `;
            list.appendChild(card);
        });
    }
}

// Play Stream Logic
window.playStream = (url, type, title, id) => {
    const audio = document.getElementById('player');
    document.getElementById('now-playing').textContent = "🔥 Playing: " + title;
    if (hls) { hls.destroy(); hls = null; }

    if (type.includes('mpegurl') || url.includes('.m3u8')) {
        if (Hls.isSupported()) {
            hls = new Hls(); hls.loadSource(url); hls.attachMedia(audio);
            hls.on(Hls.Events.MANIFEST_PARSED, () => audio.play());
        }
    } else {
        audio.src = url; audio.play();
    }
};

// Toggle Fav Logic
function toggleFav(event, id) {
    event.stopPropagation();
    
    // Pastikan ID diperlakukan sebagai angka biar konsisten
    const targetId = parseInt(id); 

    if (favorites.includes(targetId)) {
        // Hapus dari favorit kalau sudah ada
        favorites = favorites.filter(favId => favId !== targetId);
    } else {
        // Tambah ke favorit kalau belum ada
        favorites.push(targetId);
    }

    // Simpan ke memori browser
    localStorage.setItem('radioFavs', JSON.stringify(favorites));

    // Re-render tampilan biar langsung update
    renderRadios();
}

// Switch Tab Logic
function switchTab(tab) {
    currentTab = tab;
    document.getElementById('tab-all').classList.toggle('active', tab === 'all');
    document.getElementById('tab-fav').classList.toggle('active', tab === 'fav');
    renderRadios();
}

function filterRadios() { renderRadios(); }

loadRadios();