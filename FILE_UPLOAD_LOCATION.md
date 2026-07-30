# 📂 File Upload Location Guide

## Where to Find File Upload Fields

After logging in to the admin dashboard, you'll see the **"Add New Song"** form on the left side of the page.

### Form Field Order:

```
┌─────────────────────────────────────────────────────────────┐
│  🎵 Add New Song                                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Song Title * ___________________________________________   │
│  (e.g. Believer)                                            │
│                                                              │
│  Artist Name * __________________________________________   │
│  (e.g. Imagine Dragons)                                     │
│                                                              │
│  Album ___________________________________________________   │
│  (e.g. Evolve)                                              │
│                                                              │
│  Genre ___________________________________________________   │
│  (e.g. Rock, Pop, Electronic)                               │
│                                                              │
│  Duration ________________________________________________   │
│  (e.g. 3:24)                                                │
│                                                              │
│  Release Year ____________________________________________   │
│  (e.g. 2017)                                                │
│                                                              │
│  Language ________________________________________________   │
│  (e.g. English)                                             │
│                                                              │
│  📷 Cover Image File (Upload from device)                  │
│  [Choose File] No file chosen                               │
│  Supported: JPG, PNG, GIF (Max 50MB)                        │
│                                                              │
│  OR Cover Image URL ______________________________________   │
│  (https://example.com/image.jpg)                            │
│                                                              │
│  🎵 Audio File * (Upload from device)                      │
│  [Choose File] No file chosen                               │
│  Supported: MP3, WAV, M4A, OGG, AAC (Max 50MB)              │
│                                                              │
│  OR Audio Stream URL _____________________________________   │
│  (https://example.com/music.mp3)                            │
│  Provide either a file OR a URL (at least one required)     │
│                                                              │
│  [  Upload Track & Save to Database  ]                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📍 Exact Location in the Page

### Step 1: Login
1. Open the admin page
2. Enter Username: `mithun`
3. Enter Password: `142011`
4. Click "Login"

### Step 2: Find the File Upload Fields
After login, you'll see the admin dashboard with TWO main sections:

**LEFT SIDE** - "Add New Song" Form (THIS IS WHERE FILE UPLOADS ARE!)
- Scroll down through the form fields
- After the "Language" field, you'll see:
  - **📷 Cover Image File** - File upload button
  - **OR Cover Image URL** - Text input
  - **🎵 Audio File** - File upload button (THIS IS THE MAIN ONE!)
  - **OR Audio Stream URL** - Text input

**RIGHT SIDE** - "Existing Track Library" Table
- Shows all your songs
- Edit and Delete buttons

---

## 🎯 How to Upload a Song

### Method 1: Upload Files from Your Device

1. Fill in **Title** and **Artist** (required)
2. Fill in other details (optional)
3. Click **"Choose File"** next to **📷 Cover Image File**
   - Select an image from your computer (JPG, PNG, or GIF)
4. Click **"Choose File"** next to **🎵 Audio File**
   - Select an audio file from your computer (MP3, WAV, M4A, OGG, AAC)
5. Click **"Upload Track & Save to Database"**

### Method 2: Use URLs

1. Fill in **Title** and **Artist** (required)
2. Fill in other details (optional)
3. Enter a URL in **"OR Cover Image URL"** field
4. Enter a URL in **"OR Audio Stream URL"** field
5. Click **"Upload Track & Save to Database"**

### Method 3: Mix Both (File + URL)

You can also:
- Upload a cover image FILE but use an audio URL
- Upload an audio FILE but use a cover image URL

**Important:** You must provide at least ONE audio source (either file OR URL)

---

## 🔍 Visual Reference

### Before Selecting Files:
```
📷 Cover Image File (Upload from device)
[Choose File] No file chosen
Supported: JPG, PNG, GIF (Max 50MB)
```

### After Selecting a File:
```
📷 Cover Image File (Upload from device)
[Choose File] my-album-cover.jpg
Supported: JPG, PNG, GIF (Max 50MB)
```

### The Audio File Field Looks Like:
```
🎵 Audio File * (Upload from device)
[Choose File] No file chosen
Supported: MP3, WAV, M4A, OGG, AAC (Max 50MB)
```

### After Selecting an Audio File:
```
🎵 Audio File * (Upload from device)
[Choose File] my-awesome-song.mp3
Supported: MP3, WAV, M4A, OGG, AAC (Max 50MB)
```

---

## ✅ File Upload Checklist

Before clicking "Upload Track & Save to Database", make sure:

- [ ] Title is filled in (required)
- [ ] Artist is filled in (required)
- [ ] At least ONE audio source is provided:
  - [ ] Audio file selected, OR
  - [ ] Audio URL entered
- [ ] Optional: Cover image file or URL
- [ ] File size is under 50MB
- [ ] File type is supported

---

## 📂 What Happens After Upload?

1. **File Processing:**
   - Your files are uploaded to the server
   - Files are saved in `backend/uploads/` folder
   - Unique filenames are generated (e.g., `audioFile-1722345678901-123456789.mp3`)

2. **Database Storage:**
   - Song metadata is saved to MongoDB
   - File paths are stored as `/uploads/filename.mp3`

3. **Instant Update:**
   - The song appears in the "Existing Track Library" table
   - You can immediately play, edit, or delete it
   - The form is cleared and ready for the next upload

---

## 🎨 Browser File Picker

When you click **"Choose File"**, your browser will show a file picker dialog:

### On Windows:
```
┌──────────────────────────────────────┐
│ Open                            [X]  │
├──────────────────────────────────────┤
│ This PC > Music >                    │
│                                       │
│ 📁 Albums                            │
│ 📄 song1.mp3                         │
│ 📄 song2.mp3                         │
│ 📄 my-track.wav                      │
│                                       │
│ File name: ____________   [Open]     │
│ Files of type: Audio Files (*.mp3...) │
└──────────────────────────────────────┘
```

### Supported File Types:

**Audio Files:**
- `.mp3` - MP3 Audio
- `.wav` - WAV Audio
- `.m4a` - M4A/AAC Audio
- `.ogg` - OGG Vorbis
- `.aac` - AAC Audio

**Image Files:**
- `.jpg` / `.jpeg` - JPEG Images
- `.png` - PNG Images
- `.gif` - GIF Images

---

## 🐛 Troubleshooting

### Issue: "Choose File" button doesn't appear
**Solution:** 
- Make sure you're logged in
- Check that you're on the admin dashboard (not the login page)
- Scroll down in the "Add New Song" form

### Issue: File upload fails
**Possible causes:**
1. File is too large (>50MB)
2. File type not supported
3. Backend server not running
4. No internet connection to backend

**Solution:**
- Check file size and type
- Make sure backend is running: `cd backend && npm run dev`
- Check browser console (F12) for errors

### Issue: Can't see file upload fields
**Solution:**
- The file upload inputs are HTML file inputs
- They appear as buttons that say "Choose File"
- Look for the 📷 and 🎵 emoji icons
- They're located AFTER the "Language" field
- They're BEFORE the submit button

---

## 📱 Mobile View

On mobile devices, the form fields stack vertically. File upload buttons will show as:

```
┌─────────────────────────────────────┐
│ 📷 Cover Image File                 │
│ (Upload from device)                │
│ [Tap to Choose File]                │
│ Supported: JPG, PNG, GIF (Max 50MB) │
└─────────────────────────────────────┘
```

---

## 🎉 You're All Set!

The file upload fields are now in place! Just:

1. **Login** → Username: `mithun`, Password: `142011`
2. **Scroll down** in the "Add New Song" form
3. **Click "Choose File"** to select your audio file
4. **Fill in the details** (title, artist, etc.)
5. **Click "Upload Track & Save to Database"**

Your song will be uploaded and saved to MongoDB! 🎵
