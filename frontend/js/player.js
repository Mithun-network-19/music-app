/**
 * Global Music Player Engine
 * Manages HTML5 Audio playback, playlist state, scrub bar, volume, shuffle, and repeat.
 * Includes SessionStorage state persistence for zero-interruption audio playback across page reloads.
 */
class MusicPlayer {
  constructor() {
    this.audio = new Audio();
    this.playlist = [];
    this.currentIndex = 0;
    this.isPlaying = false;
    this.isShuffle = false;
    this.isRepeat = false;
    
    // UI Elements
    this.coverEl = document.getElementById('player-cover');
    this.titleEl = document.getElementById('player-title');
    this.artistEl = document.getElementById('player-artist');
    this.playBtn = document.getElementById('player-play-btn');
    this.prevBtn = document.getElementById('player-prev-btn');
    this.nextBtn = document.getElementById('player-next-btn');
    this.shuffleBtn = document.getElementById('player-shuffle-btn');
    this.repeatBtn = document.getElementById('player-repeat-btn');
    this.progressBar = document.getElementById('player-progress');
    this.progressContainer = document.getElementById('player-progress-container');
    this.currentTimeEl = document.getElementById('player-current-time');
    this.totalTimeEl = document.getElementById('player-total-time');
    this.volumeSlider = document.getElementById('player-volume');
    this.muteBtn = document.getElementById('player-mute-btn');
    this.vinylEl = document.querySelector('.vinyl-record');

    this.initEvents();
    this.restoreSessionState();
  }

  initEvents() {
    if (!this.playBtn) return; // Player dock not on current page

    // Audio element listeners
    this.audio.addEventListener('timeupdate', () => {
      this.updateProgress();
      this.saveSessionState();
    });
    this.audio.addEventListener('ended', () => this.onTrackEnded());
    this.audio.addEventListener('loadedmetadata', () => {
      if (this.totalTimeEl) {
        this.totalTimeEl.textContent = this.formatTime(this.audio.duration);
      }
    });
    this.audio.addEventListener('error', (e) => {
      console.warn('Audio playback error', e);
      if (this.isPlaying) {
        showToast('Playback error: Audio stream unavailable', 'error');
        this.pause();
      }
    });

    // Control buttons listeners
    this.playBtn.addEventListener('click', () => this.togglePlay());
    if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prev());
    if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.next());
    if (this.shuffleBtn) this.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
    if (this.repeatBtn) this.repeatBtn.addEventListener('click', () => this.toggleRepeat());

    // Seeking listener
    if (this.progressContainer) {
      this.progressContainer.addEventListener('click', (e) => this.seek(e));
    }

    // Volume listener
    if (this.volumeSlider) {
      this.volumeSlider.addEventListener('input', (e) => {
        const val = e.target.value / 100;
        this.audio.volume = val;
        this.updateVolumeIcon(val);
      });
    }

    if (this.muteBtn) {
      this.muteBtn.addEventListener('click', () => this.toggleMute());
    }
  }

  setPlaylist(songs, startIndex = 0) {
    this.playlist = songs;
    this.currentIndex = startIndex;
    if (this.playlist.length > 0 && !this.audio.src) {
      this.loadTrack(this.playlist[this.currentIndex]);
    }
  }

  loadTrack(song) {
    if (!song) return;
    this.currentTrack = song;
    this.audio.src = song.audioUrl;
    
    if (this.titleEl) this.titleEl.textContent = song.title;
    if (this.artistEl) this.artistEl.textContent = song.artist;
    if (this.coverEl) this.coverEl.src = song.coverImage || CONFIG.DEFAULT_COVER;
    if (this.totalTimeEl) this.totalTimeEl.textContent = song.duration || '0:00';
    if (this.progressBar) this.progressBar.style.width = '0%';
    if (this.currentTimeEl) this.currentTimeEl.textContent = '0:00';
  }

  playTrack(song, playlist = null) {
    if (playlist) {
      this.playlist = playlist;
      this.currentIndex = this.playlist.findIndex(s => (s.id || s._id) === (song.id || song._id));
      if (this.currentIndex === -1) this.currentIndex = 0;
    }
    
    this.loadTrack(song);
    this.play();
  }

  play() {
    if (!this.audio.src) return;
    this.audio.play().then(() => {
      this.isPlaying = true;
      this.updatePlayBtnIcon();
      if (this.vinylEl) this.vinylEl.classList.add('playing');
      this.saveSessionState();
    }).catch(err => console.log('Autoplay prevented or network error:', err));
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
    this.updatePlayBtnIcon();
    if (this.vinylEl) this.vinylEl.classList.remove('playing');
    this.saveSessionState();
  }

  togglePlay() {
    if (this.playlist.length === 0 && !this.currentTrack) return;
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  next() {
    if (this.playlist.length === 0) return;

    if (this.isShuffle) {
      this.currentIndex = Math.floor(Math.random() * this.playlist.length);
    } else {
      this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
    }

    this.playTrack(this.playlist[this.currentIndex]);
  }

  prev() {
    if (this.playlist.length === 0) return;

    if (this.audio.currentTime > 3) {
      this.audio.currentTime = 0;
      return;
    }

    if (this.isShuffle) {
      this.currentIndex = Math.floor(Math.random() * this.playlist.length);
    } else {
      this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
    }

    this.playTrack(this.playlist[this.currentIndex]);
  }

  onTrackEnded() {
    if (this.isRepeat) {
      this.audio.currentTime = 0;
      this.play();
    } else {
      this.next();
    }
  }

  toggleShuffle() {
    this.isShuffle = !this.isShuffle;
    if (this.shuffleBtn) {
      this.shuffleBtn.classList.toggle('active', this.isShuffle);
    }
    showToast(this.isShuffle ? 'Shuffle turned ON' : 'Shuffle turned OFF', 'success');
  }

  toggleRepeat() {
    this.isRepeat = !this.isRepeat;
    if (this.repeatBtn) {
      this.repeatBtn.classList.toggle('active', this.isRepeat);
    }
    showToast(this.isRepeat ? 'Repeat track ON' : 'Repeat track OFF', 'success');
  }

  seek(e) {
    if (!this.audio.duration) return;
    const rect = this.progressContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    this.audio.currentTime = percentage * this.audio.duration;
  }

  updateProgress() {
    if (!this.audio.duration) return;
    const current = this.audio.currentTime;
    const total = this.audio.duration;
    const pct = (current / total) * 100;
    
    if (this.progressBar) this.progressBar.style.width = `${pct}%`;
    if (this.currentTimeEl) this.currentTimeEl.textContent = this.formatTime(current);
  }

  updatePlayBtnIcon() {
    if (!this.playBtn) return;
    const icon = this.playBtn.querySelector('i');
    if (icon) {
      icon.className = this.isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play';
    }
  }

  toggleMute() {
    this.audio.muted = !this.audio.muted;
    if (this.muteBtn) {
      const icon = this.muteBtn.querySelector('i');
      if (icon) {
        icon.className = this.audio.muted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high';
      }
    }
  }

  updateVolumeIcon(val) {
    if (!this.muteBtn) return;
    const icon = this.muteBtn.querySelector('i');
    if (!icon) return;
    if (val === 0) icon.className = 'fa-solid fa-volume-xmark';
    else if (val < 0.5) icon.className = 'fa-solid fa-volume-low';
    else icon.className = 'fa-solid fa-volume-high';
  }

  formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  // Session State Persistence for Page Refresh
  saveSessionState() {
    if (!this.currentTrack) return;
    const state = {
      currentTrack: this.currentTrack,
      currentTime: this.audio.currentTime,
      isPlaying: this.isPlaying,
      playlist: this.playlist,
      currentIndex: this.currentIndex
    };
    sessionStorage.setItem('aurasound_player_state', JSON.stringify(state));
  }

  restoreSessionState() {
    try {
      const saved = sessionStorage.getItem('aurasound_player_state');
      if (!saved) return;
      const state = JSON.parse(saved);
      if (state.currentTrack) {
        this.playlist = state.playlist || [];
        this.currentIndex = state.currentIndex || 0;
        this.loadTrack(state.currentTrack);
        this.audio.currentTime = state.currentTime || 0;
        if (state.isPlaying) {
          this.play();
        }
      }
    } catch (e) {
      console.warn('Could not restore session player state', e);
    }
  }
}

// Global player instance
const player = new MusicPlayer();
