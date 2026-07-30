# 🎵 AuraSound Backend API

A secure, production-ready **Node.js + Express** REST API for managing songs in a **MongoDB Atlas** database.

---

## 📁 Project Structure

```
backend/
│
├── server.js                  # Express app entry point
├── package.json               # Dependencies & scripts
├── .env                       # Environment variables (DO NOT COMMIT)
├── .env.example               # Example env template
├── seed.js                    # Database seeder script
├── README.md                  # This file
│
├── config/
│   └── db.js                  # MongoDB Atlas connection logic
│
├── models/
│   └── Song.js                # Mongoose Song schema & model
│
├── routes/
│   └── songs.js               # Express Router (API routes)
│
├── controllers/
│   └── songController.js      # CRUD controller functions
│
├── middleware/
│   └── errorHandler.js        # Centralized error handling
│
└── utils/                     # Utility helpers (future use)
```

---

## 🛠️ Installation

### Prerequisites

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **MongoDB Atlas** account ([Sign Up Free](https://www.mongodb.com/atlas))
- **Git** ([Download](https://git-scm.com/))

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/music-app.git
cd music-app/backend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

1. Copy the example env file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your MongoDB Atlas connection string:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/music_db?retryWrites=true&w=majority
   ```

   > **How to get your MongoDB Atlas URI:**
   > 1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/)
   > 2. Click **"Connect"** on your cluster
   > 3. Choose **"Connect your application"**
   > 4. Copy the connection string
   > 5. Replace `<username>`, `<password>`, and `<cluster>` with your actual credentials

### Step 4: Start the Server

```bash
# Development mode (auto-restart on file changes)
npm run dev

# Production mode
npm start
```

You should see:
```
===================================================
🚀 Music Server running on port: 5000
🎵 API Endpoint: http://localhost:5000/api/songs
===================================================
[MongoDB Connected]: Host -> <your-cluster>.mongodb.net
```

### Step 5: Seed Sample Data (Optional)

```bash
npm run seed
```

This populates the database with 6 sample songs.

---

## 📡 API Endpoints

| Method   | Endpoint            | Description               |
|----------|---------------------|---------------------------|
| `GET`    | `/api/songs`        | Retrieve all songs        |
| `GET`    | `/api/songs/:id`    | Retrieve a single song    |
| `POST`   | `/api/songs`        | Add a new song            |
| `PUT`    | `/api/songs/:id`    | Update an existing song   |
| `DELETE` | `/api/songs/:id`    | Delete a song             |
| `POST`   | `/api/songs/seed`   | Seed sample data          |
| `GET`    | `/api/health`       | API health check          |

### Query Parameters (GET /api/songs)

| Parameter  | Example                         | Description                     |
|------------|----------------------------------|---------------------------------|
| `search`   | `/api/songs?search=midnight`    | Search by title, artist, album  |
| `artist`   | `/api/songs?artist=Lofi Dreamer`| Filter by exact artist          |
| `album`    | `/api/songs?album=Nightfall`    | Filter by exact album           |
| `genre`    | `/api/songs?genre=Lo-Fi`        | Filter by genre                 |
| `language` | `/api/songs?language=English`   | Filter by language              |

---

## 🧪 Testing with Postman

### 1. Create a New Song (POST)

- **Method:** `POST`
- **URL:** `http://localhost:5000/api/songs`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**

```json
{
  "title": "Believer",
  "artist": "Imagine Dragons",
  "album": "Evolve",
  "genre": "Rock",
  "duration": "3:24",
  "coverImage": "https://example.com/images/believer.jpg",
  "audioUrl": "https://example.com/music/believer.mp3",
  "releaseYear": 2017,
  "language": "English"
}
```

- **Expected Response (201):**
```json
{
  "success": true,
  "message": "Song added successfully",
  "data": {
    "id": "64f...",
    "title": "Believer",
    "artist": "Imagine Dragons",
    "album": "Evolve",
    "genre": "Rock",
    "duration": "3:24",
    "coverImage": "https://example.com/images/believer.jpg",
    "audioUrl": "https://example.com/music/believer.mp3",
    "releaseYear": 2017,
    "language": "English",
    "createdAt": "2026-07-30T...",
    "updatedAt": "2026-07-30T..."
  }
}
```

### 2. Get All Songs (GET)

- **Method:** `GET`
- **URL:** `http://localhost:5000/api/songs`
- **Expected Response (200):**
```json
{
  "success": true,
  "count": 7,
  "data": [...]
}
```

### 3. Get a Single Song (GET)

- **Method:** `GET`
- **URL:** `http://localhost:5000/api/songs/<SONG_ID>`

### 4. Update a Song (PUT)

- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/songs/<SONG_ID>`
- **Body (raw JSON):**
```json
{
  "genre": "Alternative Rock",
  "duration": "3:25"
}
```

### 5. Delete a Song (DELETE)

- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/songs/<SONG_ID>`
- **Expected Response (200):**
```json
{
  "success": true,
  "message": "Song deleted successfully"
}
```

### 6. Test Duplicate Prevention (POST)

Send the same song twice (same title + artist). The second request should return:
- **Status:** `409 Conflict`
```json
{
  "success": false,
  "message": "A song titled \"Believer\" by \"Imagine Dragons\" already exists."
}
```

### 7. Test Validation (POST)

Send a request without required fields:
```json
{
  "album": "Test Album"
}
```
- **Expected Status:** `400 Bad Request`
```json
{
  "success": false,
  "message": "Song title is required"
}
```

---

## 🚀 Deployment on Render

### Step 1: Push to GitHub

Make sure your code is pushed to a GitHub repository. Ensure `.env` is in `.gitignore`.

### Step 2: Create a New Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:

| Setting         | Value                     |
|-----------------|---------------------------|
| **Name**        | `aurasound-api`           |
| **Region**      | Choose closest to you     |
| **Branch**      | `main`                    |
| **Root Directory** | `backend`              |
| **Runtime**     | `Node`                    |
| **Build Command** | `npm install`           |
| **Start Command** | `npm start`             |

### Step 3: Add Environment Variables

In the Render dashboard, go to **Environment** → **Add Environment Variable**:

| Key           | Value                                           |
|---------------|--------------------------------------------------|
| `PORT`        | `5000`                                           |
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/music_db?retryWrites=true&w=majority` |

### Step 4: Deploy

Click **"Create Web Service"**. Render will automatically build and deploy your app.

Your API will be live at:
```
https://aurasound-api.onrender.com/api/songs
```

### Step 5: Update Frontend API URL

Update the frontend's API configuration to point to the Render URL:
```javascript
// js/config.js
const API_BASE_URL = 'https://aurasound-api.onrender.com';
```

---

## 🔒 Security Notes

- **Never commit `.env`** — it's already in `.gitignore`
- **MongoDB Atlas IP Whitelist** — For Render, add `0.0.0.0/0` to allow all IPs (or use Render's static IPs)
- **CORS** is enabled to allow frontend requests from any origin
- All user inputs are **trimmed** to prevent whitespace issues
- **Duplicate prevention** via unique compound index on `title + artist`

---

## 📋 Song Schema Fields

| Field        | Type     | Required | Default                        |
|--------------|----------|----------|--------------------------------|
| `title`      | String   | ✅ Yes   | —                              |
| `artist`     | String   | ✅ Yes   | —                              |
| `album`      | String   | No       | `"Single"`                     |
| `genre`      | String   | No       | `"Pop"`                        |
| `duration`   | String   | No       | `"3:30"`                       |
| `coverImage` | String   | No       | Unsplash placeholder           |
| `audioUrl`   | String   | ✅ Yes   | —                              |
| `releaseYear`| Number   | No       | Current year                   |
| `language`   | String   | No       | `"English"`                    |
| `createdAt`  | Date     | Auto     | Mongoose timestamp             |
| `updatedAt`  | Date     | Auto     | Mongoose timestamp             |

---

## 🧰 Available Scripts

```bash
npm start      # Start production server
npm run dev    # Start dev server (auto-restart)
npm run seed   # Seed database with sample songs
```

---

## 🤝 Frontend Compatibility

This backend is designed to work with frontends hosted on:
- **GitHub Pages** (static HTML/CSS/JS)
- **Render** (static site or co-hosted)
- **Vercel / Netlify** (any static host)

CORS is enabled for all origins by default. For production, you can restrict it:

```javascript
// server.js
app.use(cors({
  origin: ['https://yourusername.github.io', 'https://your-app.onrender.com']
}));
```
