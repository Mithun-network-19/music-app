# 📦 Install Node.js and npm

## Problem
You're getting this error:
```
npm : The term 'npm' is not recognized...
```

This means **Node.js** is not installed on your computer.

---

## ✅ Solution: Install Node.js

Node.js includes `npm` (Node Package Manager) which you need to run the backend server.

### Step 1: Download Node.js

**Go to:** [https://nodejs.org/](https://nodejs.org/)

You'll see two versions:
- **LTS (Long Term Support)** ← **DOWNLOAD THIS ONE** (Recommended)
- Current (Latest features)

**Choose LTS** - it's more stable (e.g., v20.x.x or v18.x.x)

### Step 2: Install Node.js

1. **Run the installer** (the .msi file you downloaded)
2. Click **"Next"** through the installation wizard
3. **Accept the license agreement**
4. Keep the default installation path: `C:\Program Files\nodejs\`
5. **Important:** Make sure these boxes are checked:
   - ✅ Node.js runtime
   - ✅ npm package manager
   - ✅ Add to PATH
6. Click **"Install"**
7. Click **"Finish"** when done

### Step 3: Verify Installation

1. **Open a NEW PowerShell window** (close the old one)
2. Run these commands:

```powershell
node --version
```
**Should show:** `v20.x.x` or similar

```powershell
npm --version
```
**Should show:** `10.x.x` or similar

If you see version numbers, **Node.js is installed! ✅**

### Step 4: Install Backend Dependencies

Now you can install the project dependencies:

```powershell
cd D:\music_lai\backend
npm install
```

This will install all required packages (Express, MongoDB, Multer, etc.)

**You should see:**
```
added 150 packages in 30s
```

### Step 5: Start the Server

```powershell
npm run dev
```

**You should see:**
```
===================================================
🚀 Music Server running on port: 5000
🎵 API Endpoint: http://localhost:5000/api/songs
===================================================
```

---

## 🎉 Now You Can Use the Admin Panel!

1. Open your browser
2. Go to: `http://localhost:5000/admin.html`
3. Login: Username `mithun`, Password `142011`
4. Upload songs! 🎵

---

## 🐛 Troubleshooting

### Issue: "npm: command not found" after installing

**Cause:** PowerShell window was open during installation

**Solution:**
1. Close ALL PowerShell windows
2. Open a NEW PowerShell window
3. Try `npm --version` again

### Issue: Node.js installer won't run

**Cause:** Need administrator privileges

**Solution:**
1. Right-click the installer
2. Choose "Run as administrator"
3. Complete the installation

### Issue: "Add to PATH" was not checked during install

**Solution:**
1. Search for "Environment Variables" in Windows
2. Click "Edit the system environment variables"
3. Click "Environment Variables" button
4. Under "System variables", find "Path"
5. Click "Edit"
6. Click "New" and add: `C:\Program Files\nodejs\`
7. Click OK on all windows
8. Restart PowerShell

---

## 📋 Quick Reference

### Check if Node.js is installed:
```powershell
node --version
npm --version
```

### Install project dependencies:
```powershell
cd D:\music_lai\backend
npm install
```

### Start the development server:
```powershell
npm run dev
```

### Stop the server:
Press `Ctrl + C` in the terminal

### Check if server is running:
Open browser: `http://localhost:5000/api/health`

---

## 🔄 After Installing Node.js

Follow these steps in order:

1. ✅ Install Node.js from nodejs.org
2. ✅ Open NEW PowerShell window
3. ✅ Verify: `node --version` and `npm --version`
4. ✅ Navigate: `cd D:\music_lai\backend`
5. ✅ Install: `npm install`
6. ✅ Configure MongoDB (see CONNECT_TO_MONGODB.md)
7. ✅ Start server: `npm run dev`
8. ✅ Open admin: `http://localhost:5000/admin.html`
9. ✅ Login and upload! 🎵

---

## 📚 What is Node.js?

**Node.js** is a JavaScript runtime that lets you run JavaScript on your computer (not just in the browser). Your backend server is written in Node.js.

**npm** is the package manager that comes with Node.js. It installs libraries and tools your project needs.

---

## 💡 Quick Install Commands Summary

```powershell
# 1. Verify Node.js is installed
node --version
npm --version

# 2. Go to backend folder
cd D:\music_lai\backend

# 3. Install dependencies
npm install

# 4. Start the server
npm run dev
```

That's it! Once Node.js is installed, everything else will work! 🚀
