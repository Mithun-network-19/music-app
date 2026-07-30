const mongoose = require('mongoose');
const Song = require('../models/Song');

// In-memory initial seed data fallback if MongoDB database is empty or offline
let mockSongs = [
  {
    id: "mock-1",
    title: "Summer Chillout",
    artist: "Acoustic Vibe",
    album: "Sunset Sessions",
    genre: "Chillout",
    duration: "2:45",
    coverImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    createdAt: new Date().toISOString()
  },
  {
    id: "mock-2",
    title: "Midnight Beats",
    artist: "Lofi Dreamer",
    album: "Nightfall",
    genre: "Lo-Fi",
    duration: "3:12",
    coverImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    createdAt: new Date().toISOString()
  },
  {
    id: "mock-3",
    title: "Neon Horizons",
    artist: "Cyber Pulse",
    album: "Synthwave Dreams",
    genre: "Electronic",
    duration: "4:05",
    coverImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    createdAt: new Date().toISOString()
  },
  {
    id: "mock-4",
    title: "Acoustic Breeze",
    artist: "Harmony Echo",
    album: "Unplugged",
    genre: "Acoustic",
    duration: "3:30",
    coverImage: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=500&auto=format&fit=crop&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    createdAt: new Date().toISOString()
  },
  {
    id: "mock-5",
    title: "Urban Funk",
    artist: "Groove Society",
    album: "City Lights",
    genre: "Funk",
    duration: "3:50",
    coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&auto=format&fit=crop&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    createdAt: new Date().toISOString()
  },
  {
    id: "mock-6",
    title: "Starlight Serenade",
    artist: "Luna Eclipse",
    album: "Cosmic Odyssey",
    genre: "Ambient",
    duration: "3:18",
    coverImage: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    createdAt: new Date().toISOString()
  }
];

// Helper to check MongoDB connection status
const isDBConnected = () => mongoose.connection.readyState === 1;

/**
 * GET /api/songs
 * Get all songs with optional search/filter support
 */
exports.getAllSongs = async (req, res) => {
  try {
    const { search, artist, album, genre } = req.query;

    if (isDBConnected()) {
      let filter = {};
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { artist: { $regex: search, $options: 'i' } },
          { album: { $regex: search, $options: 'i' } }
        ];
      }
      if (artist) filter.artist = { $regex: `^${artist}$`, $options: 'i' };
      if (album) filter.album = { $regex: `^${album}$`, $options: 'i' };
      if (genre) filter.genre = { $regex: `^${genre}$`, $options: 'i' };

      const songs = await Song.find(filter).sort({ createdAt: -1 });
      
      // Auto-seed if database is completely empty
      if (songs.length === 0 && !search && !artist && !album && !genre) {
        const seeded = await Song.insertMany(mockSongs.map(s => {
          const { id, ...rest } = s;
          return rest;
        }));
        return res.status(200).json({ success: true, count: seeded.length, data: seeded });
      }

      return res.status(200).json({ success: true, count: songs.length, data: songs });
    }

    // In-Memory Fallback Mode
    let result = [...mockSongs];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.artist.toLowerCase().includes(q) ||
        s.album.toLowerCase().includes(q)
      );
    }
    if (artist) {
      result = result.filter(s => s.artist.toLowerCase() === artist.toLowerCase());
    }
    if (album) {
      result = result.filter(s => s.album.toLowerCase() === album.toLowerCase());
    }
    if (genre) {
      result = result.filter(s => s.genre.toLowerCase() === genre.toLowerCase());
    }

    res.status(200).json({ success: true, count: result.length, data: result, isMock: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving songs', error: error.message });
  }
};

/**
 * GET /api/songs/:id
 * Get single song by ID
 */
exports.getSongById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDBConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid Song ID format' });
      }
      const song = await Song.findById(id);
      if (!song) {
        return res.status(404).json({ success: false, message: 'Song not found' });
      }
      return res.status(200).json({ success: true, data: song });
    }

    // In-memory fallback
    const song = mockSongs.find(s => s.id === id);
    if (!song) {
      return res.status(404).json({ success: false, message: 'Song not found' });
    }
    res.status(200).json({ success: true, data: song, isMock: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving song', error: error.message });
  }
};

/**
 * POST /api/songs
 * Add a new song
 */
exports.createSong = async (req, res) => {
  try {
    const { title, artist, album, genre, duration, coverImage, audioUrl } = req.body;

    if (!title || !artist || !audioUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, artist, and audioUrl'
      });
    }

    if (isDBConnected()) {
      const newSong = await Song.create({
        title,
        artist,
        album: album || 'Single',
        genre: genre || 'Pop',
        duration: duration || '3:30',
        coverImage: coverImage || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80',
        audioUrl
      });
      return res.status(201).json({ success: true, message: 'Song created successfully', data: newSong });
    }

    // In-memory fallback
    const newMockSong = {
      id: 'mock-' + Date.now(),
      title,
      artist,
      album: album || 'Single',
      genre: genre || 'Pop',
      duration: duration || '3:30',
      coverImage: coverImage || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80',
      audioUrl,
      createdAt: new Date().toISOString()
    };
    mockSongs.unshift(newMockSong);
    res.status(201).json({ success: true, message: 'Song created in memory mode', data: newMockSong, isMock: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating song', error: error.message });
  }
};

/**
 * PUT /api/songs/:id
 * Update an existing song
 */
exports.updateSong = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, artist, album, genre, duration, coverImage, audioUrl } = req.body;

    if (isDBConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid Song ID format' });
      }

      const song = await Song.findByIdAndUpdate(
        id,
        { title, artist, album, genre, duration, coverImage, audioUrl },
        { new: true, runValidators: true }
      );

      if (!song) {
        return res.status(404).json({ success: false, message: 'Song not found' });
      }

      return res.status(200).json({ success: true, message: 'Song updated successfully', data: song });
    }

    // In-memory fallback
    const index = mockSongs.findIndex(s => s.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Song not found' });
    }

    mockSongs[index] = {
      ...mockSongs[index],
      title: title !== undefined ? title : mockSongs[index].title,
      artist: artist !== undefined ? artist : mockSongs[index].artist,
      album: album !== undefined ? album : mockSongs[index].album,
      genre: genre !== undefined ? genre : mockSongs[index].genre,
      duration: duration !== undefined ? duration : mockSongs[index].duration,
      coverImage: coverImage !== undefined ? coverImage : mockSongs[index].coverImage,
      audioUrl: audioUrl !== undefined ? audioUrl : mockSongs[index].audioUrl
    };

    res.status(200).json({ success: true, message: 'Song updated in memory mode', data: mockSongs[index], isMock: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating song', error: error.message });
  }
};

/**
 * DELETE /api/songs/:id
 * Delete a song
 */
exports.deleteSong = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDBConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid Song ID format' });
      }

      const song = await Song.findByIdAndDelete(id);
      if (!song) {
        return res.status(404).json({ success: false, message: 'Song not found' });
      }

      return res.status(200).json({ success: true, message: 'Song deleted successfully' });
    }

    // In-memory fallback
    const index = mockSongs.findIndex(s => s.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Song not found' });
    }

    mockSongs.splice(index, 1);
    res.status(200).json({ success: true, message: 'Song deleted in memory mode', isMock: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting song', error: error.message });
  }
};

/**
 * POST /api/songs/seed
 * Reset/seed initial songs
 */
exports.seedSongs = async (req, res) => {
  try {
    if (isDBConnected()) {
      await Song.deleteMany({});
      const seeded = await Song.insertMany(mockSongs.map(s => {
        const { id, ...rest } = s;
        return rest;
      }));
      return res.status(200).json({ success: true, message: 'Database seeded successfully', count: seeded.length, data: seeded });
    }

    // Reset memory
    mockSongs = [
      {
        id: "mock-1",
        title: "Summer Chillout",
        artist: "Acoustic Vibe",
        album: "Sunset Sessions",
        genre: "Chillout",
        duration: "2:45",
        coverImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        createdAt: new Date().toISOString()
      },
      {
        id: "mock-2",
        title: "Midnight Beats",
        artist: "Lofi Dreamer",
        album: "Nightfall",
        genre: "Lo-Fi",
        duration: "3:12",
        coverImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        createdAt: new Date().toISOString()
      },
      {
        id: "mock-3",
        title: "Neon Horizons",
        artist: "Cyber Pulse",
        album: "Synthwave Dreams",
        genre: "Electronic",
        duration: "4:05",
        coverImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        createdAt: new Date().toISOString()
      },
      {
        id: "mock-4",
        title: "Acoustic Breeze",
        artist: "Harmony Echo",
        album: "Unplugged",
        genre: "Acoustic",
        duration: "3:30",
        coverImage: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=500&auto=format&fit=crop&q=80",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        createdAt: new Date().toISOString()
      },
      {
        id: "mock-5",
        title: "Urban Funk",
        artist: "Groove Society",
        album: "City Lights",
        genre: "Funk",
        duration: "3:50",
        coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&auto=format&fit=crop&q=80",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        createdAt: new Date().toISOString()
      },
      {
        id: "mock-6",
        title: "Starlight Serenade",
        artist: "Luna Eclipse",
        album: "Cosmic Odyssey",
        genre: "Ambient",
        duration: "3:18",
        coverImage: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
        createdAt: new Date().toISOString()
      }
    ];

    res.status(200).json({ success: true, message: 'Mock data reset successfully', count: mockSongs.length, data: mockSongs, isMock: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error seeding songs', error: error.message });
  }
};
