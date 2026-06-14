/* Radio Player Pro - Production Grade Refactor */

// ---------- EMBEDDED STATIONS (45 radios from provided JSON) ----------
const RADIOS_DATA = [
  { "id": 1, "category": "Pop", "title": "Prambors FM", "logo": "https://cdn.onlineradiobox.com/img/l/7/18687.v44.png", "streamUrl": "https://stream.rcs.revma.com/h77wwp48kxcwv" },
  { "id": 2, "category": "Pop", "title": "Gen FM", "logo": "https://cdn.onlineradiobox.com/img/l/6/19026.v38.png", "streamUrl": "https://wz.mari.co.id:1936/web_genfm/genfm/playlist.m3u8" },
  { "id": 3, "category": "Pop", "title": "Jak 101 FM", "logo": "https://cdn.onlineradiobox.com/img/l/5/19705.v45.png", "streamUrl": "https://wz.mari.co.id:1936/web_jakfm/jakfm/playlist.m3u8" },
  { "id": 4, "category": "Pop", "title": "Delta FM", "logo": "https://cdn.onlineradiobox.com/img/l/8/58058.v32.png", "streamUrl": "https://stream.rcs.revma.com/k02rmq48kxcwv" },
  { "id": 5, "category": "Pop", "title": "FeMale Radio", "logo": "https://cdn.onlineradiobox.com/img/l/6/60996.v19.png", "streamUrl": "https://stream.rcs.revma.com/9thenqqd2ncwv" },
  { "id": 6, "category": "Pop", "title": "iSwara FM", "logo": "https://cdn.onlineradiobox.com/img/l/9/18959.v12.png", "streamUrl": "https://stream.radiojar.com/4ywdgup3bnzuv" },
  { "id": 7, "category": "Pop", "title": "Trax FM", "logo": "https://cdn.onlineradiobox.com/img/l/6/18806.v13.png", "streamUrl": "https://stream.radiojar.com/rrqf78p3bnzuv" },
  { "id": 8, "category": "Pop", "title": "Bahana FM", "logo": "https://cdn.onlineradiobox.com/img/l/8/19708.v25.png", "streamUrl": "https://s1.cloudmu.id/listen/bahana_fm/stream" },
  { "id": 9, "category": "Pop", "title": "Mettaswara TOP 40", "logo": "https://cdn.onlineradiobox.com/img/l/3/111613.v14.png", "streamUrl": "https://mettaswara.com:8700/theone" },
  { "id": 10, "category": "Berita", "title": "Radio Elshinta", "logo": "https://cdn.onlineradiobox.com/img/l/2/18812.v17.png", "streamUrl": "https://stream-ssl.arenastreaming.com:8000/jakarta" },
  { "id": 11, "category": "Berita", "title": "Suara Surabaya", "logo": "https://cdn.onlineradiobox.com/img/l/8/18988.v10.png", "streamUrl": "https://c5.siar.us/proxy/ssfm/stream" },
  { "id": 12, "category": "Berita", "title": "RRI Pro 1", "logo": "https://cdn.onlineradiobox.com/img/l/4/18844.v17.png", "streamUrl": "https://stream-node1.rri.co.id/streaming/25/9025/rrijakartapro1.mp3" },
  { "id": 13, "category": "Berita", "title": "Sonora FM Jakarta", "logo": "https://cdn.onlineradiobox.com/img/l/6/19176.v16.png", "streamUrl": "https://sonora-radio.arenastreaming.com/8130/stream" },
  { "id": 14, "category": "Nostalgia", "title": "Golden Memories", "logo": "https://cdn.onlineradiobox.com/img/l/0/110170.v4.png", "streamUrl": "https://stream.zeno.fm/xg7mcgf1bf9uv" },
  { "id": 15, "category": "Nostalgia", "title": "Big 90's", "logo": "https://cdn.onlineradiobox.com/img/l/6/92666.v8.png", "streamUrl": "https://stream.zeno.fm/qmqe8k5e74zuv" },
  { "id": 16, "category": "Nostalgia", "title": "Slow Radio", "logo": "https://cdn.onlineradiobox.com/img/l/6/91316.v16.png", "streamUrl": "https://stream.zeno.fm/dpk2zq5np2zuv" },
  { "id": 17, "category": "Nostalgia", "title": "Ninetysix Radio Smooth", "logo": "https://cdn.onlineradiobox.com/img/l/9/117079.v4.png", "streamUrl": "https://stream.zeno.fm/1p7xwm841xhvv" },
  { "id": 18, "category": "Nostalgia", "title": "Mettaswara Throwback 80's", "logo": "https://cdn.onlineradiobox.com/img/l/9/111569.v15.png", "streamUrl": "https://mettaswara.com:8700/mettatrow" },
  { "id": 19, "category": "Rock", "title": "The Rockin' Life", "logo": "https://cdn.onlineradiobox.com/img/l/0/18880.v17.png", "streamUrl": "https://stream.radiojar.com/7csmg90fuqruv" },
  { "id": 20, "category": "Rock", "title": "Rock Rewind", "logo": "https://cdn.onlineradiobox.com/img/l/0/89300.v15.png", "streamUrl": "https://stream.zenolive.com/u18tuaphwzzuv.aac" },
  { "id": 21, "category": "Rock", "title": "Rock Ballads", "logo": "https://cdn.onlineradiobox.com/img/l/4/110904.v2.png", "streamUrl": "https://stream.zeno.fm/ynepvmy14bhvv" },
  { "id": 22, "category": "Rock", "title": "Jags Rock Music Radio", "logo": "https://cdn.onlineradiobox.com/img/l/1/71621.v34.png", "streamUrl": "https://stream.zeno.fm/q3mskdkgg6quv" },
  { "id": 23, "category": "Dangdut", "title": "Mettaswara Dangdut", "logo": "https://cdn.onlineradiobox.com/img/l/9/124069.v7.png", "streamUrl": "https://mettaswara.com:8700/d4d" },
  { "id": 24, "category": "Dangdut", "title": "Radio Imelda FM", "logo": "https://cdn.onlineradiobox.com/img/l/7/19177.v15.png", "streamUrl": "https://server.radioimeldafm.co.id:8030/imeldafm" },
  { "id": 25, "category": "Dangdut", "title": "Gajahmada FM", "logo": "https://cdn.onlineradiobox.com/img/l/6/19016.v10.png", "streamUrl": "https://server.radioimeldafm.co.id:8040/gajahmadafm" },
  { "id": 26, "category": "Dangdut", "title": "Semarak FM", "logo": "https://cdn.onlineradiobox.com/img/l/1/155551.v2.png", "streamUrl": "https://ssg.streamingmurah.com:8076/" },
  { "id": 27, "category": "Dangdut", "title": "NAGASWARA RADIOTEMEN", "logo": "https://cdn.onlineradiobox.com/img/l/2/19152.v27.png", "streamUrl": "https://live.nagaswarafm.com/nagaswararadio/stream" },
  { "id": 28, "category": "Komunitas", "title": "Radio Budi Luhur", "logo": "https://cdn.onlineradiobox.com/img/l/8/19448.v8.png", "streamUrl": "https://c2.siar.us/listen/radiobudiluhur/stream" },
  { "id": 29, "category": "Komunitas", "title": "RDK Fm Uin", "logo": "https://cdn.onlineradiobox.com/img/l/3/156493.v1.png", "streamUrl": "https://a1.siar.us/listen/rdk/radio.mp3" },
  { "id": 30, "category": "Komunitas", "title": "Radio CEK FM", "logo": "https://cdn.onlineradiobox.com/img/l/5/156305.v6.png", "streamUrl": "https://a5.siar.us:8000/stream" },
  { "id": 31, "category": "Komunitas", "title": "KUTA Radio 106 FM", "logo": "https://cdn.onlineradiobox.com/img/l/4/139824.v5.png", "streamUrl": "https://a7.siar.us/listen/radiokutafm/stream" },
  { "id": 32, "category": "Komunitas", "title": "CDBS Radio Action", "logo": "https://cdn.onlineradiobox.com/img/l/9/138819.v5.png", "streamUrl": "https://a1.siar.us/listen/radiocdbs/stream" },
  { "id": 33, "category": "Regional", "title": "OZ RADIO BANDUNG", "logo": "https://cdn.onlineradiobox.com/img/l/5/18985.v26.png", "streamUrl": "https://streaming.ozradio.id:8443/ozbandung" },
  { "id": 34, "category": "Regional", "title": "Ardan Radio", "logo": "https://cdn.onlineradiobox.com/img/l/7/18827.v12.png", "streamUrl": "https://stream.rcs.revma.com/ugpyzu9n5k3vv" },
  { "id": 35, "category": "Regional", "title": "Armada FM Ambon", "logo": "https://cdn.onlineradiobox.com/img/l/5/134015.v4.png", "streamUrl": "https://stream.zeno.fm/u5g9y3nmqtzvv" },
  { "id": 36, "category": "Regional", "title": "AXR Jakarta", "logo": "https://cdn.onlineradiobox.com/img/l/4/93194.v6.png", "streamUrl": "https://jakartastream.axr.online/" },
  { "id": 37, "category": "Regional", "title": "Metrum Radio Bandung", "logo": "https://cdn.onlineradiobox.com/img/l/4/84694.v9.png", "streamUrl": "http://103.28.149.117:8205/;" },
  { "id": 38, "category": "General", "title": "Dengerin Musik", "logo": "https://cdn.onlineradiobox.com/img/l/8/18908.v17.png", "streamUrl": "https://stream.denger.in/musik.mp3" },
  { "id": 39, "category": "General", "title": "Dna Fm Beta", "logo": "https://cdn.onlineradiobox.com/img/l/8/157588.v2.png", "streamUrl": "https://beta.dnafm.net/listen/beta/live" },
  { "id": 40, "category": "General", "title": "Radio Kelaster Fm", "logo": "https://cdn.onlineradiobox.com/img/l/9/113609.v2.png", "streamUrl": "https://stream.zeno.fm/9cfeccvaa5zuv" },
  { "id": 41, "category": "General", "title": "DNA FM LOVES", "logo": "https://cdn.onlineradiobox.com/img/l/0/148250.v4.png", "streamUrl": "https://sc.dnafm.net/listen/loves/live" },
  { "id": 42, "category": "General", "title": "Nuswantara Radio", "logo": "https://cdn.onlineradiobox.com/img/l/4/156204.v1.png", "streamUrl": "https://a12.siar.us/listen/nuswantararadio/stream" },
  { "id": 43, "category": "General", "title": "ZORA", "logo": "https://cdn.onlineradiobox.com/img/l/2/19102.v7.png", "streamUrl": "https://s1.gntr.net/listen/zora_radio/zora" },
  { "id": 44, "category": "General", "title": "Diozz FM", "logo": "https://cdn.onlineradiobox.com/img/l/7/157037.v2.png", "streamUrl": "https://a3.siar.us:8010/stream" },
  { "id": 45, "category": "General", "title": "Arena Streaming", "logo": "https://cdn.onlineradiobox.com/img/l/5/157035.v1.png", "streamUrl": "https://stream-ssl.arenastreaming.com:8006/autodj" }
];

// ---------- APP STATE ----------
let hlsInstance = null;
let currentStation = null;
let currentView = 'all';      // 'all' or 'fav'
let activeCategory = 'All';
let favorites = new Set(JSON.parse(localStorage.getItem('radioFavs') || '[]'));
let recentStations = JSON.parse(localStorage.getItem('recentStations') || '[]');

// DOM elements
const audioEl = document.getElementById('audio-player');
const stationsGrid = document.getElementById('stations-grid');
const searchInput = document.getElementById('search-input');
const npTitle = document.getElementById('np-title');
const npStatus = document.getElementById('np-status');
const npLogo = document.getElementById('np-logo');
const playPauseBtn = document.getElementById('play-pause-btn');
const stopBtn = document.getElementById('stop-btn');
const volumeSlider = document.getElementById('volume-slider');
const volumeToggle = document.getElementById('volume-toggle');

// Helper: normalize for search
function normalize(str) {
  return str.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
}

// ---------- RENDER STATION GRID ----------
function renderStations() {
  const searchTerm = normalize(searchInput.value);
  let filtered = RADIOS_DATA.filter(s => {
    if (currentView === 'fav' && !favorites.has(s.id)) return false;
    return true;
  });
  // category filter
  if (activeCategory !== 'All') {
    filtered = filtered.filter(s => s.category === activeCategory);
  }
  // search filter
  if (searchTerm) {
    filtered = filtered.filter(s => normalize(s.title).includes(searchTerm));
  }
  // sort: favorites first, then title
  filtered.sort((a,b) => {
    if (favorites.has(a.id) && !favorites.has(b.id)) return -1;
    if (!favorites.has(a.id) && favorites.has(b.id)) return 1;
    return a.title.localeCompare(b.title);
  });

  if (!filtered.length) {
    stationsGrid.innerHTML = `<div class="empty-recent" style="grid-column:1/-1;">📻 No stations match</div>`;
    return;
  }

  stationsGrid.innerHTML = filtered.map(radio => `
    <div class="radio-card" data-id="${radio.id}">
      <button class="fav-btn" data-id="${radio.id}">${favorites.has(radio.id) ? '❤️' : '🤍'}</button>
      <div class="card-clickable" data-id="${radio.id}">
        <div class="img-frame"><img src="${radio.logo}" alt="${radio.title}" loading="lazy"></div>
        <h3>${escapeHtml(radio.title)}</h3>
        <small style="opacity:0.6;">${radio.category}</small>
      </div>
    </div>
  `).join('');

  // attach event listeners dynamically
  document.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id);
      toggleFavorite(id);
    });
  });
  document.querySelectorAll('.card-clickable').forEach(card => {
    card.addEventListener('click', (e) => {
      const id = parseInt(card.dataset.id);
      const station = RADIOS_DATA.find(s => s.id === id);
      if (station) playStream(station);
    });
  });
}

function escapeHtml(str) {
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

// ---------- FAVORITE LOGIC ----------
function toggleFavorite(id) {
  if (favorites.has(id)) {
    favorites.delete(id);
  } else {
    favorites.add(id);
  }
  localStorage.setItem('radioFavs', JSON.stringify([...favorites]));
  renderStations();
  renderCategoryChips(); // just refresh UI
}

// ---------- RECENT STATIONS ----------
function saveRecent(station) {
  recentStations = recentStations.filter(s => s.id !== station.id);
  recentStations.unshift({ id: station.id, title: station.title, logo: station.logo });
  if (recentStations.length > 10) recentStations.pop();
  localStorage.setItem('recentStations', JSON.stringify(recentStations));
  renderRecent();
}

function renderRecent() {
  const container = document.getElementById('recent-list');
  if (!container) return;
  if (!recentStations.length) {
    container.innerHTML = '<div class="empty-recent">No recent stations</div>';
    return;
  }
  container.innerHTML = recentStations.map(rec => {
    const full = RADIOS_DATA.find(s => s.id === rec.id);
    if (!full) return '';
    return `
      <div class="recent-item" data-id="${rec.id}">
        <img src="${rec.logo}" alt="${rec.title}">
        <span>${escapeHtml(rec.title)}</span>
      </div>
    `;
  }).join('');
  document.querySelectorAll('.recent-item').forEach(el => {
    el.addEventListener('click', () => {
      const id = parseInt(el.dataset.id);
      const station = RADIOS_DATA.find(s => s.id === id);
      if (station) playStream(station);
    });
  });
}

// ---------- HLS STREAM HANDLING ----------
function destroyHls() {
  if (hlsInstance) {
    hlsInstance.destroy();
    hlsInstance = null;
  }
}

async function playStream(station) {
  if (currentStation && currentStation.id === station.id && !audioEl.paused) return;
  // stop previous hls
  destroyHls();
  audioEl.pause();
  audioEl.removeAttribute('src');
  audioEl.load();

  currentStation = station;
  npTitle.innerText = station.title;
  npLogo.src = station.logo;
  npStatus.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> loading...';
  playPauseBtn.disabled = false;
  localStorage.setItem('lastStation', JSON.stringify({ id: station.id, title: station.title, logo: station.logo }));
  saveRecent(station);

  const isHls = station.streamUrl.includes('.m3u8') || station.streamUrl.includes('playlist.m3u8');
  try {
    if (isHls && Hls.isSupported()) {
      hlsInstance = new Hls();
      hlsInstance.loadSource(station.streamUrl);
      hlsInstance.attachMedia(audioEl);
      hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
        audioEl.play().catch(err => showError(`Playback error: ${err.message}`));
      });
      hlsInstance.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          showError('HLS stream error, fallback not available');
          destroyHls();
        }
      });
    } else if (audioEl.canPlayType('audio/mpeg') || station.streamUrl) {
      audioEl.src = station.streamUrl;
      await audioEl.play();
    } else {
      showError('Unsupported stream format');
    }
  } catch (err) {
    showError(`Cannot play: ${err.message}`);
    npStatus.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Failed';
  }
}

function showError(msg) {
  npStatus.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${msg}`;
  console.warn(msg);
  setTimeout(() => {
    if (currentStation) npStatus.innerHTML = '<i class="fas fa-pause"></i> idle';
  }, 3000);
}

// stop playback
function stopPlayback() {
  destroyHls();
  audioEl.pause();
  audioEl.removeAttribute('src');
  audioEl.load();
  currentStation = null;
  npTitle.innerText = 'Select a station';
  npLogo.src = 'https://cdn.onlineradiobox.com/img/l/7/18687.v44.png';
  npStatus.innerHTML = '<i class="fas fa-stop"></i> stopped';
  playPauseBtn.disabled = true;
  playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
}

// play/pause toggle
function togglePlayPause() {
  if (!currentStation) return;
  if (audioEl.paused) {
    audioEl.play().catch(e => showError(e.message));
  } else {
    audioEl.pause();
    npStatus.innerHTML = '<i class="fas fa-pause"></i> paused';
  }
}

// audio events
audioEl.addEventListener('play', () => {
  playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
  npStatus.innerHTML = '<i class="fas fa-volume-up"></i> playing';
});
audioEl.addEventListener('pause', () => {
  if (!audioEl.src) return;
  playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
  if (currentStation) npStatus.innerHTML = '<i class="fas fa-pause"></i> paused';
});
audioEl.addEventListener('error', (e) => {
  showError('Stream unavailable');
  stopPlayback();
});

// volume
volumeSlider.addEventListener('input', (e) => {
  audioEl.volume = parseFloat(e.target.value);
  localStorage.setItem('radioVolume', audioEl.volume);
});
volumeToggle.addEventListener('click', () => {
  audioEl.muted = !audioEl.muted;
  volumeToggle.innerHTML = audioEl.muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
});

// ---------- CATEGORY CHIPS (dynamic) ----------
function renderCategoryChips() {
  const categories = ['All', ...new Set(RADIOS_DATA.map(s => s.category))];
  const container = document.getElementById('category-chips');
  if (!container) return;
  container.innerHTML = categories.map(cat => `
    <div class="chip ${activeCategory === cat ? 'active-chip' : ''}" data-category="${cat}">${cat}</div>
  `).join('');
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      activeCategory = chip.dataset.category;
      renderCategoryChips();
      renderStations();
    });
  });
}

// restore last station from localStorage
function restoreLastStation() {
  const last = localStorage.getItem('lastStation');
  if (last) {
    try {
      const parsed = JSON.parse(last);
      const station = RADIOS_DATA.find(s => s.id === parsed.id);
      if (station) {
        playStream(station).catch(() => null);
      }
    } catch(e) {}
  }
  const vol = localStorage.getItem('radioVolume');
  if (vol) audioEl.volume = parseFloat(vol);
}

// ---------- INITIALIZE & BINDINGS ----------
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentView = btn.dataset.view;
      renderStations();
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderCategoryChips();
  initTabs();
  renderStations();
  renderRecent();
  restoreLastStation();
  // search debounce
  searchInput.addEventListener('input', () => renderStations());
  stopBtn.addEventListener('click', stopPlayback);
  playPauseBtn.addEventListener('click', togglePlayPause);
  // keyboard shortcut "/"
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
    }
  });
  window.addEventListener('beforeunload', () => {
    destroyHls();
  });
});
