# 🗄️ MongoDB Database Setup Guide

## Current Configuration

Your backend is currently configured to use:
```
mongodb://127.0.0.1:27017/music_db
```
This is a **local MongoDB** connection that requires MongoDB to be installed on your computer.

---

## ✅ Recommended: MongoDB Atlas (Cloud Database - FREE)

MongoDB Atlas is a free cloud database that doesn't require any local installation.

### Step 1: Create MongoDB Atlas Account

1. Go to **[https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)**
2. Sign up with:
   - Email address
   - Or Google account
   - Or GitHub account

3. Choose **FREE** tier (M0 Sandbox)
   - Storage: 512 MB (enough for thousands of songs)
   - Shared RAM
   - No credit card required

### Step 2: Create a Cluster

1. After signup, click **"Build a Database"**
2. Choose **FREE** (M0) tier
3. Select a cloud provider & region:
   - **AWS** (recommended)
   - Choose region closest to you (e.g., Mumbai, Singapore, US-East)
4. Cluster Name: `music-cluster` (or any name you want)
5. Click **"Create"** (takes 3-5 minutes)

### Step 3: Create Database User

1. Go to **"Database Access"** in the left sidebar
2. Click **"+ ADD NEW DATABASE USER"**
3. Choose **"Password"** authentication
4. Username: `musicadmin` (or any username you want)
5. Password: Click **"Autogenerate Secure Password"** and COPY IT!
   - Example: `Abc123XyZ789`
   - **IMPORTANT:** Save this password somewhere safe!
6. Database User Privileges: **"Read and write to any database"**
7. Click **"Add User"**

### Step 4: Whitelist IP Address

1. Go to **"Network Access"** in the left sidebar
2. Click **"+ ADD IP ADDRESS"**
3. Choose one:
   - **Option A (Recommended for development):** Click **"ALLOW ACCESS FROM ANYWHERE"**
     - IP Address: `0.0.0.0/0`
     - This allows connections from any IP
   - **Option B (More secure):** Click **"ADD CURRENT IP ADDRESS"**
     - Adds only your current IP address
4. Click **"Confirm"**

### Step 5: Get Connection String

1. Go to **"Database"** in the left sidebar
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Driver: **Node.js**
5. Version: **5.5 or later**
6. Copy the connection string (looks like this):
   ```
   mongodb+srv://musicadmin:<password>@music-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 6: Update Your .env File

1. Open `backend/.env` file
2. Replace the connection string:

**Before:**
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/music_db
```

**After:**
```env
PORT=5000
MONGODB_URI=mongodb+srv://musicadmin:Abc123XyZ789@music-cluster.xxxxx.mongodb.net/music_db?retryWrites=true&w=majority
```

**IMPORTANT Changes:**
- Replace `<password>` with your actual password (e.g., `Abc123XyZ789`)
- Replace `xxxxx` with your cluster ID (from the connection string)
- Add `/music_db` before the `?` to specify the database name

**Example:**
```env
PORT=5000
MONGODB_URI=mongodb+srv://musicadmin:MySecurePass123@music-cluster.abc1d.mongodb.net/music_db?retryWrites=true&w=majority
```

### Step 7: Test the Connection

1. Open terminal in the backend folder:
   ```bash
   cd backend
   ```

2. Start the server:
   ```bash
   npm run dev
   ```

3. You should see:
   ```
   ===================================================
   🚀 Music Server running on port: 5000
   🎵 API Endpoint: http://localhost:5000/api/songs
   ===================================================
   ✅ [MongoDB Connected]: Host -> music-cluster.xxxxx.mongodb.net
   ```

4. If you see the ✅ message, you're connected! 🎉

---

## Option 2: Local MongoDB (Not Recommended)

If you want to use local MongoDB instead of Atlas:

### Step 1: Install MongoDB

**Windows:**
1. Download: [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Run the installer
3. Choose "Complete" installation
4. Check "Install MongoDB as a Service"
5. Finish installation

**Mac (with Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

### Step 2: Verify MongoDB is Running

**Windows:**
- Check Task Manager → Services → MongoDB Server

**Mac/Linux:**
```bash
mongosh
# If it connects, MongoDB is running
```

### Step 3: Keep .env as is

Your current `.env` is already configured for local MongoDB:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/music_db
```

---

## 🧪 Testing Your Connection

### Method 1: Start the Backend Server

```bash
cd backend
npm run dev
```

**Success looks like:**
```
✅ [MongoDB Connected]: Host -> music-cluster.xxxxx.mongodb.net
```

**Failure looks like:**
```
❌ [MongoDB Error]: Could not connect to MongoDB
```

### Method 2: Check API Endpoint

Open your browser and go to:
```
http://localhost:5000/api/songs
```

You should see:
```json
{
  "success": true,
  "count": 6,
  "data": [...]
}
```

### Method 3: Use MongoDB Compass (GUI Tool)

1. Download: [https://www.mongodb.com/try/download/compass](https://www.mongodb.com/try/download/compass)
2. Install and open MongoDB Compass
3. Paste your connection string:
   ```
   mongodb+srv://musicadmin:Abc123XyZ789@music-cluster.xxxxx.mongodb.net/
   ```
4. Click "Connect"
5. You should see your databases on the left

---

## 🔧 Troubleshooting

### Error: "Could not connect to MongoDB"

**Cause 1: Wrong password in connection string**
- Solution: Double-check the password in your `.env` file
- Make sure there are no spaces or special characters that need encoding
- If password has special characters, URL encode them:
  - `@` → `%40`
  - `#` → `%23`
  - `$` → `%24`
  - Example: `Pass@123` → `Pass%40123`

**Cause 2: IP address not whitelisted**
- Solution: Go to MongoDB Atlas → Network Access
- Make sure `0.0.0.0/0` is added (allows all IPs)

**Cause 3: Cluster still spinning up**
- Solution: Wait 3-5 minutes after creating the cluster

**Cause 4: Wrong cluster name or ID**
- Solution: Go back to MongoDB Atlas and copy the connection string again

### Error: "MongooseServerSelectionError"

**Cause:** Network issue or firewall blocking MongoDB
- Solution: 
  1. Check your internet connection
  2. Try disabling VPN temporarily
  3. Check if your firewall is blocking port 27017
  4. Use `0.0.0.0/0` in Network Access (MongoDB Atlas)

### Error: "Authentication failed"

**Cause:** Wrong username or password
- Solution: 
  1. Go to MongoDB Atlas → Database Access
  2. Click "Edit" on your user
  3. Reset the password
  4. Update `.env` with the new password

---

## 🎯 Quick Setup Script

Create a file `backend/test-connection.js`:

```javascript
const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing MongoDB connection...\n');
console.log('Connection string:', process.env.MONGODB_URI.replace(/:[^:@]+@/, ':****@'));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('\n✅ SUCCESS! Connected to MongoDB');
    console.log('Host:', mongoose.connection.host);
    console.log('Database:', mongoose.connection.name);
    process.exit(0);
  })
  .catch((err) => {
    console.error('\n❌ FAILED! Could not connect to MongoDB');
    console.error('Error:', err.message);
    process.exit(1);
  });
```

**Run it:**
```bash
cd backend
node test-connection.js
```

---

## 📊 MongoDB Atlas Dashboard Features

After connecting, you can:

1. **View Data:**
   - Go to "Database" → "Browse Collections"
   - See all your songs in the `songs` collection

2. **Query Data:**
   - Use the built-in query builder
   - Filter, sort, and search your data

3. **Monitor Performance:**
   - Real-time metrics
   - Connection statistics
   - Query performance

4. **Backup & Restore:**
   - Automatic backups (on paid plans)
   - Manual export/import

---

## 🔐 Security Best Practices

1. **Never commit .env file to Git**
   - Already in `.gitignore`
   
2. **Use strong passwords**
   - At least 12 characters
   - Mix of letters, numbers, and symbols

3. **Restrict IP access in production**
   - Use specific IP addresses instead of `0.0.0.0/0`
   - Update when deploying to Render/Vercel

4. **Rotate passwords regularly**
   - Change database password every 3-6 months

5. **Use environment-specific databases**
   - Development: `music_db_dev`
   - Production: `music_db_prod`

---

## 🎉 You're Ready!

Once you see the ✅ connection message, you can:

1. Start uploading songs through the admin panel
2. All data will be stored in MongoDB Atlas
3. Data is automatically synced to the cloud
4. Access your data from anywhere

**Connection String Template:**
```env
MONGODB_URI=mongodb+srv://[USERNAME]:[PASSWORD]@[CLUSTER-ID].mongodb.net/music_db?retryWrites=true&w=majority
```

**Need help?** Check the troubleshooting section above or MongoDB's official documentation: [https://docs.mongodb.com/](https://docs.mongodb.com/)
