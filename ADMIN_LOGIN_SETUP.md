# 🔐 Admin Login & File Upload Setup

## Overview
The admin page has been updated with authentication and file upload functionality. Users must now login to access the admin dashboard, and they can upload songs directly from their device.

---

## 🔑 Login Credentials

**Username:** `mithun`  
**Password:** `142011`

> **Note:** These credentials are currently hardcoded in the frontend for simplicity. For production use, consider implementing a proper backend authentication system with encrypted passwords.

---

## ✨ New Features

### 1. **Admin Login Page**
- The admin page now shows a login form by default
- Users must enter the correct username and password to access the dashboard
- Session-based authentication using `sessionStorage`
- Logout button to clear the session

### 2. **File Upload Support**
- Upload audio files directly from your device (MP3, WAV, M4A, OGG, AAC)
- Upload cover images from your device (JPEG, JPG, PNG, GIF)
- Files are stored in `backend/uploads/` directory
- Maximum file size: 50MB
- Files are accessible via `/uploads/<filename>` URL

### 3. **Flexible Song Addition**
You can now add songs in two ways:
- **Option A:** Upload audio file + cover image file from your device
- **Option B:** Provide URLs for audio stream and cover image
- **Option C:** Mix both (e.g., upload audio file but use URL for cover image)

---

## 📂 Files Modified

### Frontend Files:
1. **`frontend/admin.html`** - Added login section and logout button
2. **`frontend/js/admin.js`** - Added authentication logic and file upload handler
3. **`frontend/js/api.js`** - Added `uploadSong()` method for FormData upload
4. **`admin.html`** (root) - Same changes as frontend/admin.html
5. **`js/admin.js`** (root) - Same changes as frontend/js/admin.js
6. **`js/api.js`** (root) - Already had uploadSong method

### Backend Files:
- No changes needed! The backend already supports file uploads via:
  - `POST /api/songs/upload` endpoint
  - Multer middleware for handling multipart/form-data
  - File storage in `backend/uploads/` directory

---

## 🚀 How to Use

### Step 1: Start the Backend Server
```bash
cd backend
npm install
npm run dev
```

The server will run on `http://localhost:5000`

### Step 2: Open the Admin Page
Open `frontend/admin.html` or `admin.html` in your browser or navigate to:
```
http://localhost:5000/admin.html
```

### Step 3: Login
- Enter username: `mithun`
- Enter password: `142011`
- Click "Login"

### Step 4: Upload a Song
1. Fill in the song details (Title and Artist are required)
2. Choose one of these options:
   - **Upload from device:** Click "Choose File" for Audio File
   - **Stream URL:** Enter an audio URL in the "Audio Stream URL" field
3. Optionally add a cover image (file or URL)
4. Click "Upload Track & Save to Database"

### Step 5: Manage Songs
- View all songs in the table below the form
- Edit existing songs using the "Edit" button
- Delete songs using the "Delete" button
- Logout when done using the "Logout" button in the top-right

---

## 🔒 Security Features

### Current Implementation:
- ✅ Session-based authentication using `sessionStorage`
- ✅ Login expires when browser tab is closed
- ✅ File type validation (only audio and image files)
- ✅ File size limit (50MB maximum)
- ✅ Unique filename generation to prevent overwrites

### Production Recommendations:
For a production environment, consider these improvements:

1. **Backend Authentication:**
   ```javascript
   // Example: Use JWT tokens and bcrypt password hashing
   const bcrypt = require('bcrypt');
   const jwt = require('jsonwebtoken');
   ```

2. **Environment Variables:**
   ```env
   ADMIN_USERNAME=mithun
   ADMIN_PASSWORD_HASH=<bcrypt_hashed_password>
   JWT_SECRET=your_secret_key
   ```

3. **Protected Routes:**
   ```javascript
   // middleware/auth.js
   const jwt = require('jsonwebtoken');
   
   module.exports = (req, res, next) => {
     const token = req.header('Authorization');
     if (!token) return res.status(401).json({ message: 'Access denied' });
     
     try {
       const verified = jwt.verify(token, process.env.JWT_SECRET);
       req.user = verified;
       next();
     } catch (err) {
       res.status(400).json({ message: 'Invalid token' });
     }
   };
   ```

4. **Apply Middleware to Admin Routes:**
   ```javascript
   // routes/songs.js
   const auth = require('../middleware/auth');
   
   router.post('/upload', auth, upload.fields([...]), uploadSong);
   router.post('/', auth, createSong);
   router.put('/:id', auth, updateSong);
   router.delete('/:id', auth, deleteSong);
   ```

---

## 🗂️ Upload Directory Structure

```
backend/
├── uploads/
│   ├── audioFile-1627384756789-123456789.mp3
│   ├── coverImageFile-1627384756790-987654321.jpg
│   ├── audioFile-1627384812345-234567890.wav
│   └── .gitkeep
```

Files are automatically named with timestamps and random numbers to prevent conflicts.

---

## 📊 Database Storage

Songs uploaded via file are stored in MongoDB with:
```json
{
  "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
  "title": "My Awesome Song",
  "artist": "John Doe",
  "album": "Greatest Hits",
  "genre": "Pop",
  "duration": "3:45",
  "coverImage": "/uploads/coverImageFile-1627384756790-987654321.jpg",
  "audioUrl": "/uploads/audioFile-1627384756789-123456789.mp3",
  "releaseYear": 2026,
  "language": "English",
  "createdAt": "2026-07-30T10:30:00.000Z",
  "updatedAt": "2026-07-30T10:30:00.000Z"
}
```

Note that `coverImage` and `audioUrl` store relative paths that are served by the Express static middleware.

---

## 🎨 UI Changes

### Login Screen:
- Clean, centered login form
- Lock icon for visual clarity
- Error message display for invalid credentials
- Automatic redirect to dashboard on success

### Admin Dashboard:
- Logout button in the top-right corner
- All existing functionality preserved
- File upload inputs added to the form
- Toast notifications for success/error messages

---

## 🧪 Testing the Upload Feature

### Test 1: Upload Audio File
1. Login to admin
2. Fill in Title: "Test Song", Artist: "Test Artist"
3. Click "Choose File" under "Audio File" and select an MP3 file
4. Click "Upload Track & Save to Database"
5. Check the uploads folder: `backend/uploads/`
6. Verify the song appears in the table

### Test 2: Use Audio URL
1. Fill in Title and Artist
2. Skip the audio file upload
3. Enter a URL in "Audio Stream URL" (e.g., from SoundHelix)
4. Click "Upload Track & Save to Database"
5. Verify the song uses the external URL

### Test 3: Mix File and URL
1. Upload a cover image file
2. Use an audio URL (not a file)
3. Should work correctly with uploaded image and streamed audio

---

## ❓ Troubleshooting

### Issue: Login doesn't work
- **Solution:** Clear browser cache and sessionStorage
- Check browser console for errors
- Verify username is `mithun` and password is `142011` (case-sensitive)

### Issue: File upload fails
- **Solution:** Check that:
  - Backend server is running
  - `backend/uploads/` directory exists (it's auto-created)
  - File size is under 50MB
  - File type is audio or image
  - `multer` package is installed: `npm install multer`

### Issue: Uploaded files return 404
- **Solution:** Verify:
  - `server.js` has: `app.use('/uploads', express.static(path.join(__dirname, 'uploads')));`
  - Files exist in `backend/uploads/` directory
  - No firewall blocking the uploads folder

### Issue: Session expires too quickly
- **Solution:** `sessionStorage` is used, which clears on tab close
- To persist longer, change to `localStorage` in `admin.js`:
  ```javascript
  localStorage.setItem('adminLoggedIn', 'true');
  ```

---

## 🎯 Next Steps

Consider these enhancements:
1. Add user registration and role-based access control
2. Implement JWT token authentication
3. Add file compression/optimization before upload
4. Support batch uploads (multiple songs at once)
5. Add progress bar for large file uploads
6. Implement cloud storage (AWS S3, Cloudinary) instead of local storage
7. Add audio metadata extraction (ID3 tags)
8. Create an admin activity log

---

## 📝 Summary

The admin page now requires authentication with username `mithun` and password `142011`. Users can upload songs directly from their device, and files are stored in the MongoDB database with references to the uploaded files in the `backend/uploads/` directory. The implementation is secure for development but should be enhanced with proper backend authentication and encryption for production use.

**Login → Upload → Manage → Logout** - Simple and secure! 🎵
