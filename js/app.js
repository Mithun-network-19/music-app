/**
 * Main Application Logic & Seamless Single Page Application (SPA) Router
 */

function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (toggleBtn) {
    const newToggle = toggleBtn.cloneNode(true);
    toggleBtn.parentNode.replaceChild(newToggle, toggleBtn);
    newToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }
}

function updateThemeIcon(theme) {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (toggleBtn) {
    toggleBtn.innerHTML = theme === 'light' 
      ? '<i class="fa-solid fa-moon"></i>' 
      : '<i class="fa-solid fa-sun"></i>';
  }
}

function createSongCard(song, songsList) {
  const card = document.createElement('div');
  card.className = 'song-card';
  card.setAttribute('data-id', song.id || song._id);

  card.innerHTML = `
    <div class="card-img-wrapper">
      <img src="${song.coverImage || CONFIG.DEFAULT_COVER}" alt="${song.title}" class="card-img" loading="lazy" onerror="this.src='${CONFIG.DEFAULT_COVER}'">
      <button class="card-play-btn" aria-label="Play ${song.title}">
        <i class="fa-solid fa-play"></i>
      </button>
    </div>
    <div class="song-info">
      <h3 class="song-title" title="${song.title}">${song.title}</h3>
      <p class="song-artist" title="${song.artist}">${song.artist}</p>
      <div class="song-meta">
        <span class="badge-genre">${song.genre || 'Music'}</span>
        <span class="song-duration"><i class="fa-regular fa-clock"></i> ${song.duration || '3:30'}</span>
      </div>
    </div>
  `;

  card.addEventListener('click', () => {
    player.playTrack(song, songsList);
  });

  return card;
}

function createArtistCard(artistName, avatarUrl, songCount) {
  const card = document.createElement('div');
  card.className = 'artist-card';
  card.innerHTML = `
    <img src="${avatarUrl}" alt="${artistName}" class="artist-avatar" loading="lazy">
    <h4 class="artist-name">${artistName}</h4>
    <p class="artist-role">${songCount} Tracks</p>
  `;

  card.addEventListener('click', (e) => {
    e.preventDefault();
    navigateToPage(`browse.html?artist=${encodeURIComponent(artistName)}`);
  });

  return card;
}

async function initHomePage() {
  const featuredContainer = document.getElementById('featured-songs-grid');
  const artistsContainer = document.getElementById('popular-artists-grid');

  if (!featuredContainer) return;

  try {
    featuredContainer.innerHTML = '<div class="loading-spinner"><p>Loading featured songs...</p></div>';
    const songs = await API.getSongs();
    
    if (songs.length > 0 && player.playlist.length === 0) {
      player.setPlaylist(songs, 0);
    }

    featuredContainer.innerHTML = '';
    if (songs.length === 0) {
      featuredContainer.innerHTML = '<p class="text-muted">No songs available yet.</p>';
    } else {
      songs.slice(0, 6).forEach(song => {
        featuredContainer.appendChild(createSongCard(song, songs));
      });
    }

    if (artistsContainer) {
      artistsContainer.innerHTML = '';
      const artistMap = {};
      songs.forEach(song => {
        if (!artistMap[song.artist]) {
          artistMap[song.artist] = {
            count: 0,
            cover: song.coverImage
          };
        }
        artistMap[song.artist].count++;
      });

      const artists = Object.keys(artistMap).slice(0, 6);
      if (artists.length === 0) {
        artistsContainer.innerHTML = '<p class="text-muted">No artists found.</p>';
      } else {
        artists.forEach(artistName => {
          const info = artistMap[artistName];
          artistsContainer.appendChild(createArtistCard(artistName, info.cover, info.count));
        });
      }
    }
  } catch (err) {
    console.error('Home Page Error:', err);
    featuredContainer.innerHTML = '<p class="text-muted">Failed to load songs. Please refresh.</p>';
  }
}

async function initBrowsePage() {
  const gridContainer = document.getElementById('browse-songs-grid');
  const searchInput = document.getElementById('search-input');
  const artistFilter = document.getElementById('artist-filter');
  const albumFilter = document.getElementById('album-filter');
  const genreFilter = document.getElementById('genre-filter');

  if (!gridContainer) return;

  const urlParams = new URLSearchParams(window.location.search);
  const initialArtist = urlParams.get('artist') || '';

  async function loadAndFilter() {
    gridContainer.innerHTML = '<div class="loading-spinner"><p>Filtering tracks...</p></div>';

    const params = {};
    if (searchInput && searchInput.value.trim()) params.search = searchInput.value.trim();
    if (artistFilter && artistFilter.value) params.artist = artistFilter.value;
    if (albumFilter && albumFilter.value) params.album = albumFilter.value;
    if (genreFilter && genreFilter.value) params.genre = genreFilter.value;

    const songs = await API.getSongs(params);
    gridContainer.innerHTML = '';

    if (songs.length === 0) {
      gridContainer.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
          <i class="fa-solid fa-compact-disc" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 15px;"></i>
          <h3>No Songs Found</h3>
          <p class="text-muted">Try clearing filters or search term.</p>
        </div>
      `;
    } else {
      songs.forEach(song => {
        gridContainer.appendChild(createSongCard(song, songs));
      });
    }
  }

  try {
    const allSongs = await API.getSongs();
    
    if (artistFilter) {
      const artists = [...new Set(allSongs.map(s => s.artist))].sort();
      artistFilter.innerHTML = '<option value="">All Artists</option>' + 
        artists.map(a => `<option value="${a}" ${a === initialArtist ? 'selected' : ''}>${a}</option>`).join('');
    }

    if (albumFilter) {
      const albums = [...new Set(allSongs.map(s => s.album).filter(Boolean))].sort();
      albumFilter.innerHTML = '<option value="">All Albums</option>' + 
        albums.map(al => `<option value="${al}">${al}</option>`).join('');
    }

    if (genreFilter) {
      const genres = [...new Set(allSongs.map(s => s.genre).filter(Boolean))].sort();
      genreFilter.innerHTML = '<option value="">All Genres</option>' + 
        genres.map(g => `<option value="${g}">${g}</option>`).join('');
    }
  } catch (err) {
    console.error('Filter population error:', err);
  }

  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(loadAndFilter, 300);
    });
  }

  if (artistFilter) artistFilter.addEventListener('change', loadAndFilter);
  if (albumFilter) albumFilter.addEventListener('change', loadAndFilter);
  if (genreFilter) genreFilter.addEventListener('change', loadAndFilter);

  loadAndFilter();
}

async function navigateToPage(url, pushState = true) {
  const targetPath = url.split('?')[0];

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Page load failed');
    const htmlText = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');
    const newContent = doc.getElementById('app-content');

    if (!newContent) {
      window.location.href = url;
      return;
    }

    const appContainer = document.getElementById('app-content');
    appContainer.innerHTML = newContent.innerHTML;

    document.title = doc.title;

    if (pushState) {
      history.pushState({ url }, '', url);
    }

    updateActiveNavLinks(targetPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    initTheme();
    initMobileDrawer();
    initializeCurrentRoute(targetPath);

  } catch (err) {
    console.warn('SPA navigation error, falling back to full load', err);
    window.location.href = url;
  }
}

function initMobileDrawer() {
  const menuToggleBtn = document.getElementById('mobile-menu-toggle');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const mobileDrawer = document.getElementById('mobile-drawer');

  function openDrawer() {
    if (mobileDrawer) mobileDrawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (mobileDrawer) mobileDrawer.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (menuToggleBtn) {
    menuToggleBtn.addEventListener('click', openDrawer);
  }

  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', closeDrawer);
  }

  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', closeDrawer);
  }

  // Expose for router use
  window.closeMobileDrawer = closeDrawer;
}

function updateActiveNavLinks(path) {
  const current = path.split('/').pop() || 'index.html';
  const cleanCurrent = current.split('?')[0];

  const selectors = ['.nav-link', '.drawer-link', '.mob-nav-item'];
  selectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(link => {
      const href = (link.getAttribute('href') || '').split('/').pop().split('?')[0];
      if (href === cleanCurrent || (cleanCurrent === '' && href === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  });
}

function initializeCurrentRoute(path = window.location.pathname) {
  const page = path.split('/').pop() || 'index.html';

  if (page === '' || page === 'index.html') {
    initHomePage();
  } else if (page.startsWith('browse.html')) {
    initBrowsePage();
  } else if (page.startsWith('admin.html')) {
    if (typeof loadAdminSongsTable === 'function') {
      loadAdminSongsTable();
    }
  }
}

function initSPARouter() {
  document.body.addEventListener('click', (e) => {
    const link = e.target.closest('a.nav-link-spa, a.btn-primary, a.btn-secondary, a.see-all-btn, a.mob-nav-item');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('#')) return;

    e.preventDefault();
    if (window.closeMobileDrawer) window.closeMobileDrawer();
    navigateToPage(href);
  });

  window.addEventListener('popstate', (e) => {
    const url = (e.state && e.state.url) ? e.state.url : window.location.href;
    navigateToPage(url, false);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileDrawer();
  initSPARouter();
  initializeCurrentRoute();
});
