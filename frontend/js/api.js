/**
 * API Client & Toast Notification Helper
 */

// Toast notification display helper
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icon = type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation';
  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease-out';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// In-memory / localStorage client side fallback for demo mode
const LOCAL_STORAGE_KEY = 'music_app_offline_songs';

function getOfflineSongs() {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (data) return JSON.parse(data);
  const initial = [
    {
      id: "mock-1",
      title: "Summer Chillout",
      artist: "Acoustic Vibe",
      album: "Sunset Sessions",
      genre: "Chillout",
      duration: "2:45",
      coverImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    {
      id: "mock-2",
      title: "Midnight Beats",
      artist: "Lofi Dreamer",
      album: "Nightfall",
      genre: "Lo-Fi",
      duration: "3:12",
      coverImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    },
    {
      id: "mock-3",
      title: "Neon Horizons",
      artist: "Cyber Pulse",
      album: "Synthwave Dreams",
      genre: "Electronic",
      duration: "4:05",
      coverImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
    },
    {
      id: "mock-4",
      title: "Acoustic Breeze",
      artist: "Harmony Echo",
      album: "Unplugged",
      genre: "Acoustic",
      duration: "3:30",
      coverImage: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=500&auto=format&fit=crop&q=80",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
    },
    {
      id: "mock-5",
      title: "Urban Funk",
      artist: "Groove Society",
      album: "City Lights",
      genre: "Funk",
      duration: "3:50",
      coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&auto=format&fit=crop&q=80",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
    },
    {
      id: "mock-6",
      title: "Starlight Serenade",
      artist: "Luna Eclipse",
      album: "Cosmic Odyssey",
      genre: "Ambient",
      duration: "3:18",
      coverImage: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
    }
  ];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

function saveOfflineSongs(songs) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(songs));
}

/**
 * Main API Service Object
 */
const API = {
  // Fetch all songs
  async getSongs(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${CONFIG.API_BASE_URL}${queryString ? '?' + queryString : ''}`;
      
      const response = await fetch(url, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const json = await response.json();
      return json.data || [];
    } catch (err) {
      console.warn('[API Fetch Notice]: Server unreachable, loading offline cached songs.', err);
      let songs = getOfflineSongs();
      if (params.search) {
        const q = params.search.toLowerCase();
        songs = songs.filter(s => 
          s.title.toLowerCase().includes(q) || 
          s.artist.toLowerCase().includes(q) || 
          (s.album && s.album.toLowerCase().includes(q))
        );
      }
      if (params.artist) songs = songs.filter(s => s.artist.toLowerCase() === params.artist.toLowerCase());
      if (params.album) songs = songs.filter(s => s.album && s.album.toLowerCase() === params.album.toLowerCase());
      if (params.genre) songs = songs.filter(s => s.genre && s.genre.toLowerCase() === params.genre.toLowerCase());
      return songs;
    }
  },

  // Fetch single song by ID
  async getSongById(id) {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/${id}`);
      if (!response.ok) throw new Error('Song not found');
      const json = await response.json();
      return json.data;
    } catch (err) {
      const songs = getOfflineSongs();
      return songs.find(s => s.id === id || s._id === id);
    }
  },

  // Create song
  async createSong(songData) {
    try {
      const response = await fetch(CONFIG.API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(songData)
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.message || 'Failed to create song');
      }

      const json = await response.json();
      showToast('Song added successfully!', 'success');
      return json.data;
    } catch (err) {
      console.warn('[API Create Warning]: Backend error, saving locally.', err);
      const songs = getOfflineSongs();
      const newSong = { id: 'offline-' + Date.now(), ...songData, createdAt: new Date().toISOString() };
      songs.unshift(newSong);
      saveOfflineSongs(songs);
      showToast('Song saved locally (Offline Mode)', 'success');
      return newSong;
    }
  },

  // Upload song with files
  async uploadSong(formData) {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData // Don't set Content-Type header, browser will set it with boundary
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({ message: 'Upload failed' }));
        throw new Error(errJson.message || 'Failed to upload song');
      }

      const json = await response.json();
      showToast('Song uploaded successfully!', 'success');
      return json.data;
    } catch (err) {
      console.error('[API Upload Error]:', err);
      // Show more specific error message
      const errorMessage = err.message || 'Failed to upload song';
      showToast(errorMessage, 'error');
      return null;
    }
  },

  // Update song
  async updateSong(id, songData) {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(songData)
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.message || 'Failed to update song');
      }

      const json = await response.json();
      showToast('Song updated successfully!', 'success');
      return json.data;
    } catch (err) {
      console.warn('[API Update Warning]: Backend error, updating locally.', err);
      const songs = getOfflineSongs();
      const index = songs.findIndex(s => s.id === id || s._id === id);
      if (index !== -1) {
        songs[index] = { ...songs[index], ...songData };
        saveOfflineSongs(songs);
        showToast('Song updated locally (Offline Mode)', 'success');
        return songs[index];
      }
      throw err;
    }
  },

  // Delete song
  async deleteSong(id) {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete song');
      showToast('Song deleted successfully', 'success');
      return true;
    } catch (err) {
      console.warn('[API Delete Warning]: Backend error, deleting locally.', err);
      let songs = getOfflineSongs();
      songs = songs.filter(s => s.id !== id && s._id !== id);
      saveOfflineSongs(songs);
      showToast('Song deleted locally (Offline Mode)', 'success');
      return true;
    }
  }
};
