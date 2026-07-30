/**
 * Admin Dashboard Controller
 * Full CRUD Operations for managing songs
 */

let editingSongId = null;

// Admin credentials
const ADMIN_USERNAME = 'mithun';
const ADMIN_PASSWORD = '142011';

// Check if user is logged in
function isLoggedIn() {
  return sessionStorage.getItem('adminLoggedIn') === 'true';
}

// Handle login
function handleLogin(e) {
  e.preventDefault();
  const form = e.target;
  const username = form.username.value.trim();
  const password = form.password.value.trim();
  const errorDiv = document.getElementById('login-error');

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    sessionStorage.setItem('adminLoggedIn', 'true');
    showToast('Login successful!', 'success');
    showAdminDashboard();
  } else {
    errorDiv.style.display = 'block';
    setTimeout(() => {
      errorDiv.style.display = 'none';
    }, 3000);
  }
}

// Handle logout
function handleLogout() {
  sessionStorage.removeItem('adminLoggedIn');
  showLoginForm();
  showToast('Logged out successfully', 'success');
}

// Show login form
function showLoginForm() {
  document.getElementById('login-section').style.display = 'block';
  document.getElementById('admin-section').style.display = 'none';
}

// Show admin dashboard
function showAdminDashboard() {
  document.getElementById('login-section').style.display = 'none';
  document.getElementById('admin-section').style.display = 'block';
  loadAdminSongsTable();
}

async function loadAdminSongsTable() {
  const tableBody = document.getElementById('admin-songs-tbody');
  if (!tableBody) return;

  tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">Loading song library...</td></tr>';

  try {
    const songs = await API.getSongs();
    tableBody.innerHTML = '';

    if (songs.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;" class="text-muted">No songs in database. Add one using the form.</td></tr>';
      return;
    }

    songs.forEach(song => {
      const id = song.id || song._id;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><img src="${song.coverImage || CONFIG.DEFAULT_COVER}" class="table-thumb" alt="${song.title}"></td>
        <td><strong>${song.title}</strong><br><small class="text-muted">${song.artist}</small></td>
        <td>${song.album || 'Single'}</td>
        <td><span class="badge-genre">${song.genre || 'Pop'}</span></td>
        <td>${song.releaseYear || new Date().getFullYear()}</td>
        <td>${song.language || 'English'}</td>
        <td>
          <div class="table-actions">
            <button class="btn-secondary edit-btn" data-id="${id}" style="padding: 6px 12px; font-size: 0.82rem;">
              <i class="fa-solid fa-pen-to-square"></i> Edit
            </button>
            <button class="btn-danger delete-btn" data-id="${id}" style="padding: 6px 12px; font-size: 0.82rem;">
              <i class="fa-solid fa-trash"></i> Delete
            </button>
          </div>
        </td>
      `;

      tr.querySelector('.edit-btn').addEventListener('click', () => openEditModal(song));
      tr.querySelector('.delete-btn').addEventListener('click', () => deleteSongHandler(id, song.title));

      tableBody.appendChild(tr);
    });
  } catch (err) {
    console.error('Admin Table Error:', err);
    tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: red;">Failed to load songs table.</td></tr>';
  }
}

// Add Song Form Handler with File Upload Support
async function handleAddSong(e) {
  e.preventDefault();
  const form = e.target;

  // Create FormData to handle file uploads
  const formData = new FormData();
  
  formData.append('title', form.title.value.trim());
  formData.append('artist', form.artist.value.trim());
  formData.append('album', form.album.value.trim() || 'Single');
  formData.append('genre', form.genre.value.trim() || 'Pop');
  formData.append('duration', form.duration.value.trim() || '3:30');
  formData.append('releaseYear', form.releaseYear.value ? Number(form.releaseYear.value) : new Date().getFullYear());
  formData.append('language', form.language.value.trim() || 'English');

  // Handle cover image - file or URL
  const coverImageFile = form.coverImageFile.files[0];
  const coverImageUrl = form.coverImage.value.trim();
  
  if (coverImageFile) {
    formData.append('coverImageFile', coverImageFile);
  } else if (coverImageUrl) {
    formData.append('coverImage', coverImageUrl);
  }

  // Handle audio - file or URL (at least one required)
  const audioFile = form.audioFile.files[0];
  const audioUrl = form.audioUrl.value.trim();

  if (audioFile) {
    formData.append('audioFile', audioFile);
  } else if (audioUrl) {
    formData.append('audioUrl', audioUrl);
  } else {
    showToast('Please provide either an audio file or audio URL', 'error');
    return;
  }

  if (!form.title.value.trim() || !form.artist.value.trim()) {
    showToast('Please fill in required fields: Title and Artist', 'error');
    return;
  }

  const result = await API.uploadSong(formData);
  if (result) {
    form.reset();
    loadAdminSongsTable();
  }
}

// Delete Song Handler
async function deleteSongHandler(id, title) {
  if (confirm(`Are you sure you want to delete "${title}"?`)) {
    const success = await API.deleteSong(id);
    if (success) {
      loadAdminSongsTable();
    }
  }
}

// Edit Modal Handlers
function openEditModal(song) {
  editingSongId = song.id || song._id;
  const modal = document.getElementById('edit-modal');
  const form = document.getElementById('edit-song-form');

  if (!modal || !form) return;

  form.editTitle.value = song.title || '';
  form.editArtist.value = song.artist || '';
  form.editAlbum.value = song.album || '';
  form.editGenre.value = song.genre || '';
  form.editDuration.value = song.duration || '';
  if (form.editReleaseYear) form.editReleaseYear.value = song.releaseYear || '';
  if (form.editLanguage) form.editLanguage.value = song.language || '';
  form.editCoverImage.value = song.coverImage || '';
  form.editAudioUrl.value = song.audioUrl || '';

  modal.classList.add('active');
}

function closeEditModal() {
  const modal = document.getElementById('edit-modal');
  if (modal) modal.classList.remove('active');
  editingSongId = null;
}

async function handleEditSongSubmit(e) {
  e.preventDefault();
  if (!editingSongId) return;

  const form = e.target;
  const songData = {
    title: form.editTitle.value.trim(),
    artist: form.editArtist.value.trim(),
    album: form.editAlbum.value.trim() || 'Single',
    genre: form.editGenre.value.trim() || 'Pop',
    duration: form.editDuration.value.trim() || '3:30',
    releaseYear: form.editReleaseYear.value ? Number(form.editReleaseYear.value) : new Date().getFullYear(),
    language: form.editLanguage.value.trim() || 'English',
    coverImage: form.editCoverImage.value.trim() || CONFIG.DEFAULT_COVER,
    audioUrl: form.editAudioUrl.value.trim()
  };

  const result = await API.updateSong(editingSongId, songData);
  if (result) {
    closeEditModal();
    loadAdminSongsTable();
  }
}

// Initialize Admin Page
document.addEventListener('DOMContentLoaded', () => {
  // Check login status
  if (isLoggedIn()) {
    showAdminDashboard();
  } else {
    showLoginForm();
  }

  // Login form
  const loginForm = document.getElementById('login-form');
  if (loginForm) loginForm.addEventListener('submit', handleLogin);

  // Logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

  const addForm = document.getElementById('add-song-form');
  if (addForm) addForm.addEventListener('submit', handleAddSong);

  const editForm = document.getElementById('edit-song-form');
  if (editForm) editForm.addEventListener('submit', handleEditSongSubmit);

  const modalClose = document.getElementById('modal-close-btn');
  if (modalClose) modalClose.addEventListener('click', closeEditModal);

  const modalOverlay = document.getElementById('edit-modal');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeEditModal();
    });
  }
});
