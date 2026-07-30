# 🚀 Quick Start Guide - Admin Login & Upload

## Step-by-Step Setup

### 1️⃣ Start the Backend Server

```bash
cd backend
npm install
npm run dev
```

You should see:
```
===================================================
🚀 Music Server running on port: 5000
🎵 API Endpoint: http://localhost:5000/api/songs
===================================================
```

### 2️⃣ Open the Admin Page

**Option A:** If using the development server:
```
http://localhost:5000/admin.html
```

**Option B:** Open directly in browser:
```
d:\music_lai\frontend\admin.html
```
or
```
d:\music_lai\admin.html
```

### 3️⃣ Login to Admin Dashboard

![Login Screen](https://via.placeholder.com/600x400?text=Login+Screen)

**Credentials:**
- Username: `mithun`
- Password: `142011`

Click **"Login"** button

### 4️⃣ Upload Your First Song

After successful login, you'll see the admin dashboard.

**Fill in the form:**
1. **Song Title** (Required) - e.g., "Believer"
2. **Artist Name** (Required) - e.g., "Imagine Dragons"
3. **Album** (Optional) - e.g., "Evolve"
4. **Genre** (Optional) - e.g., "Rock"
5. **Duration** (Optional) - e.g., "3:24"
6. **Release Year** (Optional) - e.g., "2017"
7. **Language** (Optional) - e.g., "English"

**Upload Files:**
- **Cover Image File:** Click "Choose File" to upload an image (JPG, PNG, GIF)
  - OR use **Cover Image URL** field to provide a URL
- **Audio File:** Click "Choose File" to upload an audio file (MP3, WAV, M4A, OGG, AAC)
  - OR use **Audio Stream URL** field to provide a URL

**Submit:**
- Click **"Upload Track & Save to Database"**
- Wait for the success message
- Your song will appear in the table below

### 5️⃣ Manage Songs

**View All Songs:**
- Scroll down to see the song library table
- Each song shows: Cover, Title, Artist, Album, Genre, Year, Language

**Edit a Song:**
- Click the **"Edit"** button on any song
- Modify the details in the modal
- Click **"Update Song"**

**Delete a Song:**
- Click the **"Delete"** button on any song
- Confirm the deletion

**Logout:**
- Click the **"Logout"** button in the top-right corner
- You'll be redirected to the login page

---

## 📝 Example Test Data

Use this sample data to test the upload feature:

### Test Song 1 (with URLs):
```
Title: Summer Vibes
Artist: Ocean Waves
Album: Beach Sessions
Genre: Chillout
Duration: 4:15
Release Year: 2024
Language: English
Cover Image URL: https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500
Audio Stream URL: https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3
```

### Test Song 2 (with file upload):
```
Title: Midnight Dreams
Artist: Luna Echo
Album: Nocturnal
Genre: Ambient
Duration: 5:30
Release Year: 2025
Language: Instrumental
Cover Image File: [Upload any JPG/PNG image]
Audio File: [Upload any MP3/WAV file]
```

---

## ✅ Success Checklist

- [x] Backend server is running on port 5000
- [x] Can access admin page in browser
- [x] Can login with username "mithun" and password "142011"
- [x] Can see the admin dashboard after login
- [x] Can upload a song with file
- [x] Can add a song with URL
- [x] Uploaded song appears in MongoDB database
- [x] Can edit existing songs
- [x] Can delete songs
- [x] Can logout successfully

---

## 🎯 Where Files Are Stored

**Uploaded Files:**
```
backend/uploads/
├── audioFile-1627384756789-123456789.mp3
├── coverImageFile-1627384756790-987654321.jpg
└── ...
```

**Database Records (MongoDB):**
- Database: `music_db` (or as configured in .env)
- Collection: `songs`
- Each song document contains file paths like `/uploads/filename.mp3`

**Access Uploaded Files:**
```
http://localhost:5000/uploads/audioFile-1627384756789-123456789.mp3
```

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot connect to server"
**Solution:**
- Make sure backend is running: `cd backend && npm run dev`
- Check if port 5000 is available
- Verify MongoDB connection string in `backend/.env`

### Issue: "Login not working"
**Solution:**
- Username: `mithun` (all lowercase)
- Password: `142011` (exact numbers)
- Clear browser cache if needed

### Issue: "File upload fails"
**Solution:**
- Check file size (max 50MB)
- Only audio files (mp3, wav, m4a, ogg, aac) allowed
- Only image files (jpeg, jpg, png, gif) allowed
- Ensure `backend/uploads/` folder exists (auto-created)

### Issue: "Songs not showing after upload"
**Solution:**
- Check browser console for errors
- Verify MongoDB is connected (check server terminal)
- Try refreshing the page
- Check if API returns data: `http://localhost:5000/api/songs`

---

## 🔧 Configuration

### Change Admin Credentials

Edit `frontend/js/admin.js` and `js/admin.js`:

```javascript
// Change these values:
const ADMIN_USERNAME = 'your_username';
const ADMIN_PASSWORD = 'your_password';
```

### Change Upload File Size Limit

Edit `backend/middleware/upload.js`:

```javascript
const upload = multer({
  storage: storage,
  limits: { fileSize: 100000000 }, // Change to 100MB
  fileFilter: fileFilter
});
```

### Change Allowed File Types

Edit `backend/middleware/upload.js`:

```javascript
const fileFilter = (req, file, cb) => {
  // Add or remove file extensions:
  const allowedFileTypes = /jpeg|jpg|png|gif|mp3|wav|m4a|ogg|aac|flac/;
  // ...
};
```

---

## 📞 Need Help?

If you encounter any issues:

1. Check the browser console (F12 → Console tab)
2. Check the backend server terminal for errors
3. Verify MongoDB connection in backend logs
4. Review `ADMIN_LOGIN_SETUP.md` for detailed documentation

---

**Ready to go! Start uploading your music collection! 🎵🎉**
