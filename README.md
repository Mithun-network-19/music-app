# AuraSound - Full-Stack Music Streaming Web Application

A complete, modern, responsive full-stack music streaming application featuring a clean Spotify-inspired user interface, dark/light theme toggle, real-time search and filter capabilities, full REST API backend with Express and MongoDB (Mongoose), persistent audio player engine, and an interactive Admin Dashboard.

![AuraSound Architecture](https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1000&auto=format&fit=crop&q=80)

---

## 🌟 Key Features

* **Minimal & Modern UI**: Sleek Spotify-like aesthetic with rounded corners, soft glassmorphism shadows, and smooth micro-animations.
* **Light / Dark Mode**: Theme toggle with automatic state persistence in LocalStorage.
* **Persistent Music Player**: Bottom docked audio control bar with play/pause, previous/next track, scrubbable progress bar, volume control, mute, shuffle, and repeat modes.
* **Browse & Search**: Real-time search by track title, artist, or album, alongside dropdown filters for artist, album, and genre.
* **Admin Dashboard**: Full CRUD management interface allowing administrators to view, add, edit, and delete songs with immediate UI sync.
* **Robust REST API**: Built with Node.js and Express Router connected to MongoDB Atlas via Mongoose.
* **Offline / Fallback Resilience**: Built-in mock data fallback ensuring the web app works out of the box locally even before configuring database credentials.

---

## 📁 Directory & File Structure

```text
music-app/
├── frontend/
│   ├── index.html          # Homepage with Hero, Featured Songs & Popular Artists
│   ├── browse.html         # Browse Songs page with Search & Filters
│   ├── admin.html          # Admin Dashboard for track CRUD management
│   ├── 404.html            # Custom 404 Error page
│   ├── style.css           # Design system, CSS variables, Dark/Light modes & animations
│   └── js/
│       ├── config.js       # Dynamic API Base URL configuration
│       ├── api.js          # REST API client & Toast notification module
│       ├── player.js       # Core HTML5 Audio Player controller
│       ├── app.js          # Main page renderers & search/filter handlers
│       └── admin.js        # Admin CRUD operations logic
├── backend/
│   ├── package.json        # Node.js backend dependencies & scripts
│   ├── server.js           # Express app entry point
│   ├── seed.js             # Database seeder script
│   ├── .env.example        # Template for environment variables
│   ├── .env                # Local environment configuration
│   ├── config/
│   │   └── db.js           # MongoDB Mongoose connection setup
│   ├── models/
│   │   └── Song.js         # Mongoose Schema definition for Songs
│   ├── controllers/
│   │   └── songController.js# Controllers for CRUD API endpoints
│   └── routes/
│       └── songs.js        # Express Router for /api/songs
└── README.md               # Complete project documentation & deployment guide
```

---

## 🗄️ MongoDB Schema

### `Song` Schema (`backend/models/Song.js`)

| Field        | Type     | Required | Description |
|--------------|----------|----------|-------------|
| `title`      | String   | Yes      | Title of the song |
| `artist`     | String   | Yes      | Artist or Band name |
| `album`      | String   | No       | Album title (Default: `'Single'`) |
| `genre`      | String   | No       | Genre category (e.g. `'Chillout'`, `'Lo-Fi'`, `'Electronic'`) |
| `duration`   | String   | No       | Track duration (e.g. `'3:45'`) |
| `coverImage` | String   | No       | HTTPS URL to song cover artwork |
| `audioUrl`   | String   | Yes      | HTTPS URL to streaming audio file (.mp3) |
| `createdAt`  | Date     | Auto     | Timestamp of creation |

---

## 📡 REST API Documentation

Base Endpoint: `/api/songs`

### 1. Get All Songs
* **Method**: `GET /api/songs`
* **Query Parameters** *(Optional)*:
  * `search`: Filter by search keyword (matches title, artist, or album)
  * `artist`: Filter by exact artist name
  * `album`: Filter by album name
  * `genre`: Filter by genre
* **Response**:
  ```json
  {
    "success": true,
    "count": 6,
    "data": [
      {
        "id": "60d5ec49f1b2c80015f8e4a1",
        "title": "Summer Chillout",
        "artist": "Acoustic Vibe",
        "album": "Sunset Sessions",
        "genre": "Chillout",
        "duration": "2:45",
        "coverImage": "https://images.unsplash.com/...",
        "audioUrl": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        "createdAt": "2026-07-30T18:00:00.000Z"
      }
    ]
  }
  ```

### 2. Get Single Song
* **Method**: `GET /api/songs/:id`

### 3. Add New Song
* **Method**: `POST /api/songs`
* **Body Parameters**:
  ```json
  {
    "title": "Midnight Beats",
    "artist": "Lofi Dreamer",
    "album": "Nightfall",
    "genre": "Lo-Fi",
    "duration": "3:12",
    "coverImage": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
    "audioUrl": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  }
  ```

### 4. Update Song
* **Method**: `PUT /api/songs/:id`
* **Body Parameters**: Fields to update.

### 5. Delete Song
* **Method**: `DELETE /api/songs/:id`

### 6. Seed Initial Data
* **Method**: `POST /api/songs/seed`

---

## 🛠️ Local Installation & Setup

### Prerequisites
* [Node.js](https://nodejs.org/) (v16+ recommended)
* [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) Account or local MongoDB installation.

### Step 1: Install Backend Dependencies
Open your terminal and run:
```bash
cd backend
npm install
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Edit `backend/.env` with your MongoDB Atlas Connection URI:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/music_db?retryWrites=true&w=majority
```

### Step 3: Seed Database (Optional)
Populate your database with sample tracks:
```bash
npm run seed
```

### Step 4: Run the Backend Server
```bash
npm start
```
The server will start at `http://localhost:5000`.

### Step 5: Launch the Frontend
You can open `frontend/index.html` directly in your browser or serve it using any HTTP server (such as VS Code Live Server or Python `http.server`).

---

## 🚀 Deployment Guide

### A. Deploy Backend to Render (Render.com)

1. Push your repository to **GitHub**.
2. Log into [Render Dashboard](https://dashboard.render.com/) and click **New + -> Web Service**.
3. Connect your GitHub repository.
4. Set the following settings:
   * **Name**: `aurasound-api`
   * **Root Directory**: `backend`
   * **Environment**: `Node`
   * **Build Command**: `npm install`
   * **Start Command**: `node server.js`
5. Under **Environment Variables**, add:
   * `PORT`: `5000`
   * `MONGODB_URI`: `<Your MongoDB Atlas Connection String>`
6. Click **Create Web Service**. Once deployed, copy your Render URL (e.g. `https://aurasound-api.onrender.com`).

---

### B. Deploy Frontend to GitHub Pages

1. Open `frontend/js/config.js`.
2. Update `CONFIG.API_BASE_URL` with your Render backend URL:
   ```javascript
   API_BASE_URL: 'https://aurasound-api.onrender.com/api/songs'
   ```
3. Push your repository to **GitHub**.
4. Go to your repository **Settings** -> **Pages**.
5. Under **Build and deployment**:
   * **Source**: Deploy from a branch
   * **Branch**: `main` (or `master`) / `/frontend` folder (or root if using `gh-pages` branch).
6. Save and view your live site at `https://<username>.github.io/<repository-name>/frontend/`.

---

## 🎨 Technologies Used

* **Frontend**: HTML5, Vanilla CSS3 (Flexbox, Grid, CSS Variables, Glassmorphic Glass UI), Vanilla JavaScript (ES6+ Modules, Fetch API, HTML5 Audio Engine)
* **Backend**: Node.js, Express.js (Router, CORS middleware)
* **Database**: MongoDB Atlas, Mongoose ODM
* **Deployment**: GitHub Pages (Frontend), Render (Backend)

---

## 📄 License
ISC License. Free for educational and personal projects.
