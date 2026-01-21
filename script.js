let hls = null;
let allRadios = [];
let favorites = JSON.parse(localStorage.getItem('radioFavs')) || [];
let currentTab = 'all';

async function loadRadios() {
    const list = document.getElementById('radio-list');
    const noResults = document.getElementById('no-results');
    
    try {
        // Panggil file JSON (pake timestamp biar gak kena cache)
        const res = await fetch('radios-id.json?v=' + Date.now());
        
        if (!res.ok) {
            throw new Error(`Gagal ambil file JSON (Status: ${res.status})`);
        }

        allRadios = await res.json();
        
        // Cek apakah data beneran ada isinya
        if (allRadios.length > 0) {
            renderRadios();
        } else {
            list.innerHTML = "JSON kosong nih, bestie...";
        }

    } catch (error) {
        console.error("Waduh error:", error);
        list.innerHTML = `<div style="text-align:center; padding:20px;">
            ❌ Gagal load data!<br>
            <small>${error.message}</small><br><br>
            <i>Cek apakah file <b>radios-id.json</b> sudah di-upload ke satu folder yang sama.</i>
        </div>`;
    }
}

function renderRadios() {
    const list = document.getElementById('radio-list');
    const noResults = document.getElementById('no-results');
    const searchInput = document.getElementById('search-input');
    const keyword = searchInput ? searchInput.value.toLowerCase() : "";

    // Sembunyikan pesan "gak ketemu" dulu di awal render
    noResults.style.display = 'none';

    let data = allRadios;

    // 1. Filter Tab Favorit
    if (currentTab === 'fav') {
        data = allRadios.filter(r => favorites.includes(r.id));
    }

    // 2. Filter Search
    data = data.filter(r => r.title.toLowerCase().includes(keyword));

    // Eksekusi Tampilan
    list.innerHTML = '';
    
    if (data.length === 0) {
        // Baru tampilin pesan error kalau datanya emang beneran kosong setelah difilter
        noResults.style.display = 'block';
    } else {
        data.forEach(radio => {
            const isFav = favorites.includes(radio.id);
            const card = document.createElement('div');
            card.className = 'radio-card';
            card.id = `card-${radio.id}`;
            card.innerHTML = `
                <button class="fav-btn" onclick="toggleFav(event, ${radio.id})">
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

// ... sisanya (playStream, toggleFav, switchTab) sama kayak sebelumnya ...

window.playStream = (url, type, title, id) => {
    const audio = document.getElementById('player');
    const statusText = document.getElementById('now-playing');
    
    // Ganti status kartu yang lagi main
    document.querySelectorAll('.radio-card').forEach(c => c.classList.remove('playing'));
    const activeCard = document.getElementById(`card-${id}`);
    if(activeCard) activeCard.classList.add('playing');
    
    statusText.textContent = "🔥 Now Vibe-ing: " + title;

    // Reset HLS biar gak tabrakan
    if (hls) { hls.destroy(); hls = null; }

    const streamUrl = url.trim();

    if (type.includes('mpegurl') || streamUrl.includes('.m3u8')) {
        if (Hls.isSupported()) {
            hls = new Hls();
            hls.loadSource(streamUrl);
            hls.attachMedia(audio);
            hls.on(Hls.Events.MANIFEST_PARSED, () => audio.play().catch(e => console.log("Play diblokir")));
        } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
            audio.src = streamUrl;
            audio.play().catch(e => console.log("Play diblokir"));
        }
    } else {
        audio.src = streamUrl;
        audio.play().catch(e => console.log("Play diblokir"));
    }
};

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

// Jalankan aplikasi pas load
loadRadios();