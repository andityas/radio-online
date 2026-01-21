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
        list.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:50px;">
            <h4>JSON Gak Ketemu 💀</h4><p>Cek filenya lagi ya, bestie.</p>
        </div>`;
    }
}

function renderRadios() {
    const list = document.getElementById('radio-list');
    const keyword = document.getElementById('search-input').value.toLowerCase().trim();

    // Filter Logic
    const data = allRadios.filter(r => {
        const isFav = (currentTab === 'all') || (currentTab === 'fav' && favorites.includes(Number(r.id)));
        const isMatch = r.title.toLowerCase().includes(keyword);
        return isFav && isMatch;
    });

    list.innerHTML = '';

    if (data.length === 0) {
        let title = "Waduh, Gak Ketemu Nih... 🚩";
        let desc = "Coba cek lagi keyword pencarianmu, bestie.";
        if (currentTab === 'fav' && keyword === "") {
            title = "Masih Kosong Melompong 🚩";
            desc = "Belum ada yang di-love nih. Cari radio terus klik ❤️ ya!";
        }
        
        list.innerHTML = `
            <div style="grid-column: 1/-1; display:flex; justify-content:center; align-items:center; min-height:250px;">
                <div style="text-align:center; background:rgba(255,255,255,0.05); padding:30px; border-radius:20px; border:1px dashed #444; width:80%;">
                    <h4 style="color:#1db954; margin:0;">${title}</h4>
                    <p style="color:#888; font-size:12px;">${desc}</p>
                </div>
            </div>`;
        return;
    }

    data.forEach(radio => {
        const isFav = favorites.includes(Number(radio.id));
        const card = document.createElement('div');
        card.className = 'radio-card';
        card.id = `card-${radio.id}`;
        card.innerHTML = `
            <button onclick="toggleFav(event, ${radio.id})" 
                style="position:absolute; top:10px; right:10px; background:rgba(0,0,0,0.5); border:none; border-radius:50%; width:30px; height:30px; cursor:pointer; color:${isFav ? '#ff4d4d' : '#ccc'};">
                ${isFav ? '❤️' : '🤍'}
            </button>
            <div onclick="playStream('${radio.streamUrl}', '${radio.type}', '${radio.title}', ${radio.id})">
                <img src="${radio.logo}" alt="${radio.title}">
                <h3>${radio.title}</h3>
            </div>`;
        list.appendChild(card);
    });
}

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

window.playStream = (url, type, title, id) => {
    const audio = document.getElementById('player');
    document.getElementById('now-playing').textContent = "🔥 Now Vibe-ing: " + title;
    
    document.querySelectorAll('.radio-card').forEach(c => c.classList.remove('playing'));
    document.getElementById(`card-${id}`)?.classList.add('playing');

    if (hls) { hls.destroy(); hls = null; }
    if (url.includes('.m3u8') && Hls.isSupported()) {
        hls = new Hls(); hls.loadSource(url); hls.attachMedia(audio);
        hls.on(Hls.Events.MANIFEST_PARSED, () => audio.play());
    } else {
        audio.src = url; audio.play();
    }
};

function switchTab(tab) {
    currentTab = tab;
    document.getElementById('tab-all').classList.toggle('active', tab === 'all');
    document.getElementById('tab-fav').classList.toggle('active', tab === 'fav');
    renderRadios();
}

function filterRadios() { renderRadios(); }
loadRadios();