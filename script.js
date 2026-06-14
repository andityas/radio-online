// ==============================================
// DATA RADIO (EMBEDDED - TANPA PERLU FETCH)
// ==============================================
const allRadios = [
  {
    "id": 1,
    "title": "Prambors FM Jakarta",
    "logo": "https://cdn.onlineradiobox.com/img/l/7/18687.v44.png",
    "streamUrl": "https://stream.rcs.revma.com/h77wwp48kxcwv",
    "type": "audio/mpeg",
    "favorite": false
  },
  {
    "id": 2,
    "title": "Gen FM Jakarta",
    "logo": "https://cdn.onlineradiobox.com/img/l/6/19026.v38.png",
    "streamUrl": "https://s1.cloudmu.id/listen/gen_fm/stream",
    "type": "audio/mpeg",
    "favorite": false
  },
  {
    "id": 3,
    "title": "Jak 101 FM Jakarta",
    "logo": "https://cdn.onlineradiobox.com/img/l/5/19705.v45.png",
    "streamUrl": "https://s1.cloudmu.id/listen/jak_fm/stream",
    "type": "audio/mpeg",
    "favorite": false
  },
  {
    "id": 4,
    "title": "Ardan Radio Bandung",
    "logo": "https://cdn.onlineradiobox.com/img/l/7/18827.v12.png",
    "streamUrl": "https://stream.rcs.revma.com/ugpyzu9n5k3vv",
    "type": "audio/mpeg",
    "favorite": false
  },
  {
    "id": 5,
    "title": "RRI Pro 2",
    "logo": "https://cdn.onlineradiobox.com/img/l/2/18862.v17.png",
    "streamUrl": "https://stream-node1.rri.co.id/streaming/25/9025/rrijakartapro2.mp3",
    "type": "audio/mpeg",
    "favorite": false
  },
  {
    "id": 6,
    "title": "RRI Pro 1",
    "logo": "https://cdn.onlineradiobox.com/img/l/4/18844.v17.png",
    "streamUrl": "https://stream-node1.rri.co.id/streaming/25/9025/rrijakartapro1.mp3",
    "type": "audio/mpeg",
    "favorite": false
  },
  {
    "id": 7,
    "title": "Suara Surabaya FM",
    "logo": "https://cdn.onlineradiobox.com/img/l/8/18988.v10.png",
    "streamUrl": "https://c5.siar.us/proxy/ssfm/stream",
    "type": "audio/mpeg",
    "favorite": false
  },
  {
    "id": 8,
    "title": "Radio Elshinta Jakarta",
    "logo": "https://cdn.onlineradiobox.com/img/l/2/18812.v17.png",
    "streamUrl": "https://stream-ssl.arenastreaming.com:8000/jakarta",
    "type": "audio/mpeg",
    "favorite": false
  },
  {
    "id": 9,
    "title": "Delta FM Jakarta",
    "logo": "https://cdn.onlineradiobox.com/img/l/8/58058.v32.png",
    "streamUrl": "https://stream.rcs.revma.com/k02rmq48kxcwv",
    "type": "audio/mpeg",
    "favorite": false
  },
  {
    "id": 10,
    "title": "FeMale Radio Jakarta",
    "logo": "https://cdn.onlineradiobox.com/img/l/6/60996.v19.png",
    "streamUrl": "https://stream.rcs.revma.com/9thenqqd2ncwv",
    "type": "audio/mpeg",
    "favorite": false
  },
  {
    "id": 11,
    "title": "Bahana FM Jakarta",
    "logo": "https://cdn.onlineradiobox.com/img/l/8/19708.v25.png",
    "streamUrl": "https://s1.cloudmu.id/listen/bahana_fm/stream",
    "type": "audio/mpeg",
    "favorite": false
  },
  {
    "id": 12,
    "title": "Sonora FM Jakarta",
    "logo": "https://cdn.onlineradiobox.com/img/l/6/19176.v16.png",
    "streamUrl": "https://sonora-radio.arenastreaming.com/8130/stream",
    "type": "audio/mpeg",
    "favorite": false
  },
  {
    "id": 13,
    "title": "OZ Radio Bandung",
    "logo": "https://cdn.onlineradiobox.com/img/l/5/18985.v26.png",
    "streamUrl": "https://streaming.ozradio.id:8443/ozbandung",
    "type": "audio/mpeg",
    "favorite": false
  },
  {
    "id": 14,
    "title": "Trax FM Jakarta",
    "logo": "https://cdn.onlineradiobox.com/img/l/6/18806.v13.png",
    "streamUrl": "https://stream.radiojar.com/rrqf78p3bnzuv",
    "type": "audio/mpeg",
    "favorite": false
  },
  {
    "id": 15,
    "title": "Nagaswara Radiotemen Bogor",
    "logo": "https://cdn.onlineradiobox.com/img/l/2/19152.v27.png",
    "streamUrl": "https://live.nagaswarafm.com/nagaswararadio/stream",
    "type": "audio/mpeg",
    "favorite": false
  },
  {
    "id": 16,
    "title": "Mettaswara Dangdut",
    "logo": "https://cdn.onlineradiobox.com/img/l/9/124069.v7.png",
    "streamUrl": "https://mettaswara.com:8700/d4d",
    "type": "audio/mpeg",
    "favorite": false
  },
  {
    "id": 17,
    "title": "Suara Giri FM",
    "logo": "https://cdn.onlineradiobox.com/img/l/6/19166.v5.png",
    "streamUrl": "http://streaming.girifm.com:8010/;stream.mp3",
    "type": "audio/mpeg",
    "favorite": false
  },
  {
    "id": 18,
    "title": "Radio Imelda FM",
    "logo": "https://cdn.onlineradiobox.com/img/l/7/19177.v15.png",
    "streamUrl": "https://server.radioimeldafm.co.id:8030/imeldafm",
    "type": "audio/mpeg",
    "favorite": false
  },
  {
    "id": 19,
    "title": "Gajahmada FM",
    "logo": "https://cdn.onlineradiobox.com/img/l/6/19016.v10.png",
    "streamUrl": "https://server.radioimeldafm.co.id:8040/gajahmadafm",
    "type": "audio/mpeg",
    "favorite": false
  },
  {
    "id": 20,
    "title": "VIS FM",
    "logo": "https://cdn.onlineradiobox.com/img/l/1/19561.v11.png",
    "streamUrl": "http://b.alhastream.com:5115/radio",
    "type": "audio/mpeg",
    "favorite": false
  },
  {
    "id": 21,
    "title": "Telstar FM Makassar",
    "logo": "https://cdn.onlineradiobox.com/img/l/1/20661.v9.png",
    "streamUrl": "https://stream-eu-nc.arenastreaming.com:5101/stream",
    "type": "audio/mpeg",
    "favorite": false
  },
  {
    "id": 22,
    "title": "iSwara FM Jakarta",
    "logo": "https://cdn.onlineradiobox.com/img/l/9/18959.v12.png",
    "streamUrl": "https://stream.radiojar.com/4ywdgup3bnzuv",
    "type": "audio/mpeg",
    "favorite": false
  },
  {
    "id": 23,
    "title": "Loker Musik Radio Indonesia",
    "logo": "https://cdn.onlineradiobox.com/img/l/9/75039.v11.png",
    "streamUrl": "https://stream.lokermusik.com/listen/lokermusik/lokermusik",
    "type": "audio/mpeg",
    "favorite": false
  },
  {
    "id": 24,
    "title": "NADAPA DIGITAL PRO2",
    "logo": "https://cdn.onlineradiobox.com/img/l/4/132914.v15.png",
    "streamUrl": "https://ssg.streamingmurah.com:8110/:6000/;?download=false",
    "type": "audio/mpeg",
    "favorite": false
  },
  {
    "id": 25,
    "title": "Golden Memories",
    "logo": "https://cdn.onlineradiobox.com/img/l/0/110170.v4.png",
    "streamUrl": "https://stream.zeno.fm/xg7mcgf1bf9uv",
    "type": "audio/mpeg",
    "favorite": false
  },
  {
    "id": 26,
    "title": "Big 90's",
    "logo": "https://cdn.onlineradiobox.com/img/l/6/92666.v8.png",
    "streamUrl": "https://stream.zeno.fm/qmqe8k5e74zuv",
    "type": "audio/mpeg",
    "favorite": false
  },
  {
    "id": 27,
    "title": "Kis Rock",
    "logo": "https://cdn.onlineradiobox.com/img/l/0/106040.v7.png",
    "streamUrl": "https://stream.zeno.fm/2nbxgbynb18uv",
    "type": "audio/mpeg",
    "favorite": false
  },
  {
    "id": 28,
    "title": "The Rockin Life",
    "logo": "https://cdn.onlineradiobox.com/img/l/0/18880.v17.png",
    "streamUrl": "https://stream.radiojar.com/7csmg90fuqruv",
    "type": "audio/mpeg",
    "favorite": false
  },
  {
    "id": 29,
    "title": "Rock Ballads",
    "logo": "https://cdn.onlineradiobox.com/img/l/4/110904.v2.png",
    "streamUrl": "https://stream.zeno.fm/ynepvmy14bhvv",
    "type": "audio/mpeg",
    "favorite": false
  },
  {
    "id": 30,
    "title": "Rock Rewind",
    "logo": "https://cdn.onlineradiobox.com/img/l/0/89300.v15.png",
    "streamUrl": "https://stream.zenolive.com/u18tuaphwzzuv.aac",
    "type": "audio/mpeg",
    "favorite": false
  },
  {
    "id": 31,
    "title": "Slow Radio",
    "logo": "https://cdn.onlineradiobox.com/img/l/6/91316.v16.png",
    "streamUrl": "https://stream.zeno.fm/dpk2zq5np2zuv",
    "type": "audio/mpeg",
    "favorite": false
  },
  {
    "id": 32,
    "title": "Dengerin Musik",
    "logo": "https://cdn.onlineradiobox.com/img/l/8/18908.v17.png",
    "streamUrl": "https://stream.denger.in/musik.mp3",
    "type": "audio/mpeg",
    "favorite": false
  },
  {
    "id": 33,
    "title": "Ringkas RadioNet Cirebon",
    "logo": "https://cdn.onlineradiobox.com/img/l/7/144127.v12.png",
    "streamUrl": "http://uk6freenew.listen2myradio.com:20828/;",
    "type": "audio/mpeg",
    "favorite": false
  },
  {
    "id": 34,
    "title": "Fourtyfive Radio",
    "logo": "https://cdn.onlineradiobox.com/img/l/8/148288.v3.png",
    "streamUrl": "https://a5.siar.us/listen/fourtyfiveradio/stream",
    "type": "audio/mpeg",
    "favorite": false
  },
  {
    "id": 35,
    "title": "Mettaswara Hits",
    "logo": "https://cdn.onlineradiobox.com/img/l/5/113955.v11.png",
    "streamUrl": "https://mettaswara.com:8700/hits",
    "type": "audio/mpeg",
    "favorite": false
  },
  {
    "id": 36,
    "title": "RD Revival Rocks!",
    "logo": "https://cdn.onlineradiobox.com/img/l/6/131296.v5.png",
    "streamUrl": "https://stream.zeno.fm/wuznwqnzgk3uv",
    "type": "audio/mpeg",
    "favorite": false
  },
  {
    "id": 37,
    "title": "Bonas Radio",
    "logo": "https://cdn.onlineradiobox.com/img/l/5/156775.v1.png",
    "streamUrl": "https://bonas-radio.nailsstethic.com:8000/radio.mp3",
    "type": "audio/mpeg",
    "favorite": false
  },
  {
    "id": 38,
    "title": "Nuswantara Radio",
    "logo": "https://cdn.onlineradiobox.com/img/l/4/156204.v1.png",
    "streamUrl": "https://a12.siar.us/listen/nuswantararadio/stream",
    "type": "audio/mpeg",
    "favorite": false
  },
  {
    "id": 39,
    "title": "Kard Radio",
    "logo": "https://cdn.onlineradiobox.com/img/l/1/101161.v13.png",
    "streamUrl": "https://stream.zeno.fm/38bvpz8xzp8uv",
    "type": "audio/mpeg",
    "favorite": false
  },
  {
    "id": 40,
    "title": "ZORA",
    "logo": "https://cdn.onlineradiobox.com/img/l/2/19102.v7.png",
    "streamUrl": "https://s1.gntr.net/listen/zora_radio/zora",
    "type": "audio/mpeg",
    "favorite": false
  },
  {
    "id": 41,
    "title": "SANews Radio",
    "logo": "https://cdn.onlineradiobox.com/img/l/4/156564.v1.png",
    "streamUrl": "https://s7.alhastream.com:8350/radio",
    "type": "audio/mpeg",
    "favorite": false
  },
  {
    "id": 42,
    "title": "YOURTAS RADIO",
    "logo": "https://cdn.onlineradiobox.com/img/l/5/89965.v14.png",
    "streamUrl": "https://stream.zeno.fm/9eu2z4y1pufvv",
    "type": "audio/mpeg",
    "favorite": false
  },
  {
    "id": 43,
    "title": "Semarak FM",
    "logo": "https://cdn.onlineradiobox.com/img/l/1/155551.v2.png",
    "streamUrl": "https://ssg.streamingmurah.com:8076/",
    "type": "audio/mpeg",
    "favorite": false
  },
  {
    "id": 44,
    "title": "Ine Radio",
    "logo": "https://cdn.onlineradiobox.com/img/l/7/155597.v5.png",
    "streamUrl": "https://s3.alhastream.com:8060/radio",
    "type": "audio/mpeg",
    "favorite": false
  },
  {
    "id": 45,
    "title": "Crown Media Center Radio",
    "logo": "https://cdn.onlineradiobox.com/img/l/4/152954.v2.png",
    "streamUrl": "https://stream.crownmediacenter.my.id/listen/cmcradio/station2.aac",
    "type": "audio/mpeg",
    "favorite": false
  },
  {
    "id": 46,
    "title": "Keilove FM",
    "logo": "https://cdn.onlineradiobox.com/img/l/0/154800.v3.png",
    "streamUrl": "https://s3.alhastream.com:8440/keilove",
    "type": "audio/mpeg",
    "favorite": false
  },
  {
    "id": 47,
    "title": "80s Radio Hits",
    "logo": "https://cdn.onlineradiobox.com/img/l/5/71605.v58.png",
    "streamUrl": "https://stream.zeno.fm/wy1pbnedd3quv",
    "type": "audio/mpeg",
    "favorite": false
  },
  {
    "id": 48,
    "title": "Bontang Streamers",
    "logo": "https://cdn.onlineradiobox.com/img/l/1/96091.v21.png",
    "streamUrl": "http://atletik.biz.id:8000/radio.mp3",
    "type": "audio/mpeg",
    "favorite": false
  },
  {
    "id": 49,
    "title": "Homebrew Station",
    "logo": "https://cdn.onlineradiobox.com/img/l/3/157643.v1.png",
    "streamUrl": "https://radio.homebrew.my.id/listen/homebrew-radio/radio.mp3",
    "type": "audio/mpeg",
    "favorite": false
  },
  {
    "id": 50,
    "title": "Free FM",
    "logo": "https://cdn.onlineradiobox.com/img/l/5/81395.v9.png",
    "streamUrl": "https://rocafmadrid.radioca.st/stream",
    "type": "audio/mpeg",
    "favorite": false
  },
  {
    "id": 51,
    "title": "Hits Radio Kandangan",
    "logo": "https://cdn.onlineradiobox.com/img/l/6/149756.v3.png",
    "streamUrl": "http://45.64.97.82:8030/stream",
    "type": "audio/mpeg",
    "favorite": false
  },
  {
    "id": 52,
    "title": "KISI",
    "logo": "https://cdn.onlineradiobox.com/img/l/0/19460.v11.png",
    "streamUrl": "https://live.kisifm.com/listen/kisifm/;",
    "type": "audio/mpeg",
    "favorite": false
  }
];

// ==============================================
// LOGIKA APLIKASI (SAMA PERSIS SEPERTI ASLINYA)
// ==============================================
let hls = null;
let favorites = JSON.parse(localStorage.getItem('radioFavs')) || [];
let currentTab = 'all';

document.addEventListener('DOMContentLoaded', () => {
    // Langsung render tanpa fetch
    renderRadios();

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
    
    // Update judul browser
    document.title = "▶️ " + title + " | Radio Player Pro";
    
    // Update info di player bar
    document.getElementById('now-playing').innerHTML = `<b>${title}</b><span class="sub-vibe">Now Vibing</span>`;
    if(miniLogo && logoUrl) {
        miniLogo.src = logoUrl;
        miniLogo.alt = title;
    }

    // Tandai kartu yang sedang diputar
    document.querySelectorAll('.radio-card').forEach(c => c.classList.remove('playing'));
    const currentCard = document.getElementById(`card-${id}`);
    if (currentCard) currentCard.classList.add('playing');

    // Hentikan HLS jika ada
    if (hls) { 
        hls.destroy(); 
        hls = null; 
    }

    // Putar stream (kebanyakan MP3 langsung)
    if (url.includes('.m3u8') && typeof Hls !== 'undefined' && Hls.isSupported()) {
        hls = new Hls(); 
        hls.loadSource(url); 
        hls.attachMedia(audio);
        hls.on(Hls.Events.MANIFEST_PARSED, () => audio.play().catch(e => console.log("Autoplay diblokir")));
    } else {
        audio.src = url; 
        audio.play().catch(e => console.log("Autoplay diblokir, klik play manual"));
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
