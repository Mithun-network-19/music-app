const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Song = require('./models/Song');

dotenv.config();

const initialSongs = [
  {
    title: "Summer Chillout",
    artist: "Acoustic Vibe",
    album: "Sunset Sessions",
    genre: "Chillout",
    duration: "2:45",
    coverImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    title: "Midnight Beats",
    artist: "Lofi Dreamer",
    album: "Nightfall",
    genre: "Lo-Fi",
    duration: "3:12",
    coverImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    title: "Neon Horizons",
    artist: "Cyber Pulse",
    album: "Synthwave Dreams",
    genre: "Electronic",
    duration: "4:05",
    coverImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  },
  {
    title: "Acoustic Breeze",
    artist: "Harmony Echo",
    album: "Unplugged",
    genre: "Acoustic",
    duration: "3:30",
    coverImage: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=500&auto=format&fit=crop&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
  },
  {
    title: "Urban Funk",
    artist: "Groove Society",
    album: "City Lights",
    genre: "Funk",
    duration: "3:50",
    coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&auto=format&fit=crop&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
  },
  {
    title: "Starlight Serenade",
    artist: "Luna Eclipse",
    album: "Cosmic Odyssey",
    genre: "Ambient",
    duration: "3:18",
    coverImage: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
  }
];

const seedData = async () => {
  const connected = await connectDB();
  if (!connected) {
    console.error('Cannot seed data: MongoDB connection failed. Please check MONGODB_URI in backend/.env');
    process.exit(1);
  }

  try {
    await Song.deleteMany({});
    console.log('Existing songs cleared.');

    const created = await Song.insertMany(initialSongs);
    console.log(`Successfully seeded ${created.length} songs into MongoDB!`);
    process.exit(0);
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();
