# 🚀 START HERE - Complete Setup Guide

This is your complete step-by-step guide to get the music application running.

---

## 📋 Checklist

Complete these steps in order:

- [ ] **Step 1:** Install Node.js
- [ ] **Step 2:** Install project dependencies
- [ ] **Step 3:** Connect to MongoDB
- [ ] **Step 4:** Start the server
- [ ] **Step 5:** Access the admin panel
- [ ] **Step 6:** Upload songs!

---

## Step 1: Install Node.js ⚡

**Current Status:** ❌ Node.js is NOT installed

### What to do:

1. **Download Node.js LTS** from: https://nodejs.org/
   - Click the green button that says "LTS (Recommended)"
   - File will be named like: `node-v20.x.x-x64.msi`

2. **Run the installer:**
   - Double-click the downloaded file
   - Click "Next" → "Next" → "Install"
   - Make sure "Add to PATH" is checked ✅
   - Click "Finish"

3. **Verify installation:**
   - **IMPORTANT:** Close and reopen PowerShell
   - Run: `node --version`
   - Should show: `v20.x.x` or similar ✅

**Time needed:** 5 minutes

**Detailed guide:** See `INSTALL_NODEJS.md`

---

## Step 2: Install Project Dependencies 📦

After Node.js is installed:

```powershell
# Navigate to backend folder
cd D:\music_lai\backend

# Install all required packages
npm install
```

**What this does:**
- Downloads Express (web server)
- Downloads Mongoose (MongoDB driver)
- Downloads Multer (file upload handler)
- Downloads all other dependencies

**You'll see:**
```
added 150+ packages in 30s
```

**Time needed:** 1-2 minutes

---

## Step 3: Connect to MongoDB 🗄️

**Current Status:** ❌ MongoDB is NOT connected (using local connection)

### Option A: MongoDB Atlas (Recommended - FREE & Easy)

1. **Create account:** https://www.mongodb.com/cloud/atlas/register
2. **Create FREE cluster** (M0 tier)
3. **Create database user** (username + password)
4. **Whitelist IP:** Add `0.0.0.0/0`
5. **Get connection string**
6. **Update `.env` file:**

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/music_db?retryWrites=true&w=majority
```

**Detailed guide:** See `CONNECT_TO_MONGODB.md`

### Test Connection:

```powershell
node test-connection.js
```

**Should show:**
```
✅ SUCCESS! Connected to MongoDB
```

**Time needed:** 5-10 minutes

---

## Step 4: Start the Server 🚀

```powershell
# Make sure you're in the backend folder
cd D:\music_lai\backend

# Start the development server
npm run dev
```

**Success looks like:**
```
===================================================
🚀 Music Server running on port: 5000
🎵 API Endpoint: http://localhost:5000/api/songs
===================================================
✅ [MongoDB Connected]: Host -> cluster0.xxxxx.mongodb.net
```

**Keep this window open!** The server needs to stay running.

**Time needed:** Instant

---

## Step 5: Access the Admin Panel 🎛️

1. **Open your browser**
2. **Go to:** `http://localhost:5000/admin.html`
3. **Login:**
   - Username: `mithun`
   - Password: `142011`
4. **Click "Login"**

**You should see:** The admin dashboard with the upload form! ✅

---

## Step 6: Upload Songs! 🎵

Now you can upload your music:

1. **Fill in the form:**
   - Song Title: (e.g., "Believer")
   - Artist Name: (e.g., "Imagine Dragons")
   - Other fields are optional

2. **Choose files:**
   - Click "Choose File" next to **🎵 Audio File**
   - Select an MP3, WAV, or M4A file
   - Optionally, upload a cover image too

3. **Click:** "Upload Track & Save to Database"

4. **Success!** Your song appears in the table below ✅

---

## 🎯 Quick Command Reference

### Start the server:
```powershell
cd D:\music_lai\backend
npm run dev
```

### Stop the server:
Press `Ctrl + C` in PowerShell

### Test MongoDB connection:
```powershell
cd D:\music_lai\backend
node test-connection.js
```

### Check if server is running:
Open browser: http://localhost:5000/api/health

---

## 🐛 Common Issues & Solutions

### Issue: "npm is not recognized"
**Solution:** Install Node.js (see Step 1)

### Issue: "Cannot connect to MongoDB"
**Solution:** 
- Check `backend/.env` file has correct connection string
- Run `node test-connection.js` to diagnose
- See `CONNECT_TO_MONGODB.md` for setup

### Issue: "Audio/Image Files Only!" error
**Solution:** This has been fixed! Just restart the server:
```powershell
# Press Ctrl+C to stop
npm run dev  # Start again
```

### Issue: Login doesn't work
**Solution:**
- Username must be: `mithun` (lowercase)
- Password must be: `142011` (exact numbers)
- Clear browser cache if needed

### Issue: Files not uploading
**Solution:**
- Make sure server is running (check PowerShell window)
- File size must be under 50MB
- File must be audio (MP3, WAV, M4A, OGG, AAC) or image (JPG, PNG, GIF)

---

## 📚 Documentation Files

| File | Description |
|------|-------------|
| `INSTALL_NODEJS.md` | How to install Node.js and npm |
| `CONNECT_TO_MONGODB.md` | Quick MongoDB setup guide |
| `MONGODB_SETUP_GUIDE.md` | Detailed MongoDB instructions |
| `FILE_UPLOAD_FIX.md` | Explanation of file upload fix |
| `QUICK_START_GUIDE.md` | User guide for the app |
| `ADMIN_LOGIN_SETUP.md` | Admin authentication details |
| `DEPLOYMENT_SUMMARY.md` | Complete implementation summary |

---

## ✅ Success Checklist

You're all set when you can:

- [x] Run `node --version` and see a version number
- [x] Run `npm --version` and see a version number
- [x] Run `npm install` without errors
- [x] Run `node test-connection.js` and see ✅ SUCCESS
- [x] Run `npm run dev` and see server running message
- [x] Open `http://localhost:5000/admin.html` in browser
- [x] Login with `mithun` / `142011`
- [x] Upload a song successfully
- [x] See the song in the table

---

## 🎉 You're Ready!

Once all steps are complete:

1. **Server is running** → Backend is active
2. **MongoDB is connected** → Database is ready
3. **Admin is accessible** → You can login
4. **Songs upload successfully** → Everything works!

**Now you can manage your music library! 🎵**

---

## 🆘 Need Help?

1. **Check the specific guide** for each step (see documentation files above)
2. **Read the error message** in PowerShell - it usually tells you what's wrong
3. **Verify each step** was completed successfully before moving to the next
4. **Try restarting** - Close PowerShell and the browser, then try again

**Most common issue:** Not restarting PowerShell after installing Node.js!

---

**First Time Setup:** Follow steps 1-6 in order  
**After Setup:** Just run `npm run dev` to start the server

Good luck! 🚀
