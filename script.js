let hls = null;
let allRadios = [];
let favorites = JSON.parse(localStorage.getItem('radioFavs')) || [];
let currentTab = 'all';

// Load daftar radio dari radios-id.json
async function loadRadios() {
  const list = document.getElementById('radio-list');
  list.textContent = "⏳ Sedang memuat daftar radio...";
  try {
    const res = await fetch('radios-id.json');
    allRadios = await res.json();
    renderRadios();
  } catch (error) {
    list.textContent = "❌ Gagal memuat JSON.";
  }
}

// Render daftar radio ke grid
function renderRadios() {
  const list = document.getElementById('radio-list');
  const noResults = document.getElementById('no-results');
  const keyword = document.getElementById('search-input').value.toLowerCase();

  let dataToRender = allRadios;

  // Filter tab favorit
  if (currentTab === 'fav') {
    dataToRender = allRadios.filter(r => favorites.includes(r.id));
  }

  // Filter pencarian
  dataToRender = dataToRender.filter(r => r.title.toLowerCase().includes(keyword));

  list.innerHTML = '';
  if (dataToRender.length === 0) {
    noResults.style.display = 'block';
  } else {
    noResults.style.display = 'none';
    dataToRender.forEach(radio => {
      const isFav = favorites.includes(radio.id);
      const card = document.createElement('div');
      card.className = 'radio-card';
      card.innerHTML = `
        <button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFav(event, ${radio.id})">
          ${isFav ? '❤️' : '🤍'}
        </button>
        <div onclick="playStream('${radio.streamUrl}', '${radio.type}', '${radio.title}')">
          <img src="${radio.logo}" alt="${radio.title}">
          <h3>${radio.title}</h3>
        </div>
      `;
      list.appendChild(card);
    });
  }
}

// Toggle favorit
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

// Ganti tab
function switchTab(tab) {
  currentTab = tab;
  document.getElementById('tab-all').className = tab === 'all' ? 'tab-btn active' : 'tab-btn';
  document.getElementById('tab-fav').className = tab === 'fav' ? 'tab-btn active' : 'tab-btn';
  renderRadios();
}

// Filter pencarian
function filterRadios() {
  renderRadios();
}

// Play stream
window.playStream = (url, type, title) => {
  const audio = document.getElementById('player');
  const statusText = document.getElementById('now-playing');
  statusText.textContent = "Sedang Memutar: " + title;

  if (hls) { hls.destroy(); hls = null; }

  const streamUrl = url.trim();
  if (type === 'application/vnd.apple.mpegurl' || streamUrl.includes('.m3u8')) {
    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(audio);
      hls.on(Hls.Events.MANIFEST_PARSED, () => audio.play().catch(err => console.log("Autoplay diblokir:", err)));
    } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
      audio.src = streamUrl;
      audio.play().catch(err => console.log("Autoplay diblokir:", err));
    }
  } else {
    audio.src = streamUrl;
    audio.play().catch(err => console.log("Autoplay diblokir:", err));
  }
};

// Jalankan saat halaman load
loadRadios();