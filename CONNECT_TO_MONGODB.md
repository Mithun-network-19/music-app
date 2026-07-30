# 🚀 Quick MongoDB Connection Guide

## Current Status
Your `.env` file is set to: `mongodb://127.0.0.1:27017/music_db`  
This requires **local MongoDB** to be installed.

## ✅ Recommended: Use MongoDB Atlas (FREE Cloud Database)

### **5-Minute Setup:**

#### 1️⃣ Create Account
Go to: **https://www.mongodb.com/cloud/atlas/register**
- Sign up (free, no credit card needed)

#### 2️⃣ Create Cluster
- Click **"Build a Database"**
- Choose **FREE** (M0 tier)
- Click **"Create"** (wait 3-5 minutes)

#### 3️⃣ Create User
- Go to **"Database Access"**
- Click **"Add New Database User"**
- Username: `musicadmin`
- Click **"Autogenerate Secure Password"** → **COPY IT!**
- Click **"Add User"**

#### 4️⃣ Allow IP Access
- Go to **"Network Access"**
- Click **"Add IP Address"**
- Click **"Allow Access from Anywhere"** (0.0.0.0/0)
- Click **"Confirm"**

#### 5️⃣ Get Connection String
- Go to **"Database"** → Click **"Connect"**
- Choose **"Connect your application"**
- Copy the connection string:
  ```
  mongodb+srv://musicadmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
  ```

#### 6️⃣ Update `.env` File

Open `backend/.env` and replace with:

```env
PORT=5000
MONGODB_URI=mongodb+srv://musicadmin:YOUR_PASSWORD_HERE@cluster0.xxxxx.mongodb.net/music_db?retryWrites=true&w=majority
```

**Replace:**
- `YOUR_PASSWORD_HERE` with the password you copied
- `cluster0.xxxxx` with your actual cluster ID

**Example:**
```env
PORT=5000
MONGODB_URI=mongodb+srv://musicadmin:Abc123XyZ@cluster0.ab1cd.mongodb.net/music_db?retryWrites=true&w=majority
```

#### 7️⃣ Test Connection

Open terminal in the `backend` folder and run:

```bash
node test-connection.js
```

**Success looks like:**
```
✅ SUCCESS! Connected to MongoDB
Host: cluster0.xxxxx.mongodb.net
Database: music_db
```

**If it fails, see troubleshooting below.**

#### 8️⃣ Start Server

```bash
npm run dev
```

You should see:
```
✅ [MongoDB Connected]: Host -> cluster0.xxxxx.mongodb.net
```

---

## 🎉 Done! Now You Can:

1. Open: `http://localhost:5000/admin.html`
2. Login: Username `mithun`, Password `142011`
3. Upload songs - they'll be saved to MongoDB Atlas!

---

## 🐛 Troubleshooting

### Issue: "Authentication failed"
**Solution:**
- Go to MongoDB Atlas → Database Access
- Click "Edit" on your user → "Edit Password"
- Generate new password and update `.env`

### Issue: "Could not connect"
**Solution:**
- Go to MongoDB Atlas → Network Access
- Make sure `0.0.0.0/0` is listed
- Wait 2 minutes for it to activate

### Issue: Special characters in password
**Solution:**
If your password has `@`, `#`, `$`, etc., encode them:
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`

Example: `Pass@123` becomes `Pass%40123`

---

## 📚 Full Documentation

For detailed setup, see: `MONGODB_SETUP_GUIDE.md`

---

## 💰 Cost

**MongoDB Atlas Free Tier (M0):**
- ✅ FREE forever
- ✅ 512 MB storage
- ✅ Shared RAM
- ✅ No credit card required
- ✅ Perfect for thousands of songs

---

## 🔄 Alternative: Local MongoDB

If you want to use local MongoDB:

1. **Install MongoDB:**
   - Windows: https://www.mongodb.com/try/download/community
   - Mac: `brew install mongodb-community`
   - Linux: `sudo apt install mongodb`

2. **Start MongoDB service**

3. **Keep current `.env`:**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/music_db
   ```

4. **Test:**
   ```bash
   node test-connection.js
   ```

---

**Need help?** Run `node test-connection.js` for detailed error messages and solutions!
