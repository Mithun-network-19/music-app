const mongoose = require('mongoose');
const Song = require('../models/Song');

// In-memory fallback dataset for offline/testing mode
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
    releaseYear: 2023,
    language: "English",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
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
    releaseYear: 2024,
    language: "English",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
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
    releaseYear: 2022,
    language: "Instrumental",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
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
    releaseYear: 2021,
    language: "English",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
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
    releaseYear: 2023,
    language: "English",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
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
    releaseYear: 2024,
    language: "Instrumental",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const isDBConnected = () => mongoose.connection.readyState === 1;

/**
 * GET /api/songs
 * Retrieve all songs with optional search/filtering
 */
exports.getAllSongs = async (req, res, next) => {
  try {
    const { search, artist, album, genre, language } = req.query;

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
      if (language) filter.language = { $regex: `^${language}$`, $options: 'i' };

      const songs = await Song.find(filter).sort({ createdAt: -1 });

      // Auto-seed if database is empty
      if (songs.length === 0 && !search && !artist && !album && !genre && !language) {
        const seeded = await Song.insertMany(mockSongs.map(({ id, ...rest }) => rest));
        return res.status(200).json({ success: true, count: seeded.length, data: seeded });
      }

      return res.status(200).json({ success: true, count: songs.length, data: songs });
    }

    // In-memory fallback
    let result = [...mockSongs];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.artist.toLowerCase().includes(q) ||
        (s.album && s.album.toLowerCase().includes(q))
      );
    }
    if (artist) result = result.filter(s => s.artist.toLowerCase() === artist.toLowerCase());
    if (album) result = result.filter(s => s.album && s.album.toLowerCase() === album.toLowerCase());
    if (genre) result = result.filter(s => s.genre && s.genre.toLowerCase() === genre.toLowerCase());
    if (language) result = result.filter(s => s.language && s.language.toLowerCase() === language.toLowerCase());

    res.status(200).json({ success: true, count: result.length, data: result, isMock: true });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/songs/:id
 * Retrieve a single song by ID
 */
exports.getSongById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDBConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: `Invalid Song ID format: ${id}` });
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
    next(error);
  }
};

/**
 * POST /api/songs
 * Add a new song with duplicate validation
 */
exports.createSong = async (req, res, next) => {
  try {
    const { title, artist, album, genre, duration, coverImage, audioUrl, releaseYear, language } = req.body;

    // Required Field Validation
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Song title is required' });
    }
    if (!artist || !artist.trim()) {
      return res.status(400).json({ success: false, message: 'Artist name is required' });
    }
    if (!audioUrl || !audioUrl.trim()) {
      return res.status(400).json({ success: false, message: 'Audio stream URL is required' });
    }

    const trimmedTitle = title.trim();
    const trimmedArtist = artist.trim();

    if (isDBConnected()) {
      // Check for duplicate title + artist
      const existing = await Song.findOne({
        title: { $regex: `^${trimmedTitle}$`, $options: 'i' },
        artist: { $regex: `^${trimmedArtist}$`, $options: 'i' }
      });

      if (existing) {
        return res.status(409).json({
          success: false,
          message: `A song titled "${trimmedTitle}" by "${trimmedArtist}" already exists.`
        });
      }

      const song = await Song.create({
        title: trimmedTitle,
        artist: trimmedArtist,
        album: album ? album.trim() : 'Single',
        genre: genre ? genre.trim() : 'Pop',
        duration: duration ? duration.trim() : '3:30',
        coverImage: coverImage ? coverImage.trim() : 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80',
        audioUrl: audioUrl.trim(),
        releaseYear: releaseYear ? Number(releaseYear) : new Date().getFullYear(),
        language: language ? language.trim() : 'English'
      });

      return res.status(201).json({ success: true, message: 'Song added successfully', data: song });
    }

    // In-memory fallback duplicate check
    const existingMock = mockSongs.find(s =>
      s.title.toLowerCase() === trimmedTitle.toLowerCase() &&
      s.artist.toLowerCase() === trimmedArtist.toLowerCase()
    );

    if (existingMock) {
      return res.status(409).json({
        success: false,
        message: `A song titled "${trimmedTitle}" by "${trimmedArtist}" already exists in memory.`
      });
    }

    const newMockSong = {
      id: 'mock-' + Date.now(),
      title: trimmedTitle,
      artist: trimmedArtist,
      album: album ? album.trim() : 'Single',
      genre: genre ? genre.trim() : 'Pop',
      duration: duration ? duration.trim() : '3:30',
      coverImage: coverImage ? coverImage.trim() : 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80',
      audioUrl: audioUrl.trim(),
      releaseYear: releaseYear ? Number(releaseYear) : new Date().getFullYear(),
      language: language ? language.trim() : 'English',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    mockSongs.unshift(newMockSong);
    res.status(201).json({ success: true, message: 'Song added in memory mode', data: newMockSong, isMock: true });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/songs/:id
 * Update an existing song
 */
exports.updateSong = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, artist, album, genre, duration, coverImage, audioUrl, releaseYear, language } = req.body;

    if (isDBConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: `Invalid Song ID format: ${id}` });
      }

      // Check duplicate title/artist if title or artist is being updated
      if (title || artist) {
        const currentSong = await Song.findById(id);
        if (!currentSong) {
          return res.status(404).json({ success: false, message: 'Song not found' });
        }

        const checkTitle = title ? title.trim() : currentSong.title;
        const checkArtist = artist ? artist.trim() : currentSong.artist;

        const duplicate = await Song.findOne({
          _id: { $ne: id },
          title: { $regex: `^${checkTitle}$`, $options: 'i' },
          artist: { $regex: `^${checkArtist}$`, $options: 'i' }
        });

        if (duplicate) {
          return res.status(409).json({
            success: false,
            message: `Another song titled "${checkTitle}" by "${checkArtist}" already exists.`
          });
        }
      }

      const updatedSong = await Song.findByIdAndUpdate(
        id,
        {
          ...(title && { title: title.trim() }),
          ...(artist && { artist: artist.trim() }),
          ...(album !== undefined && { album: album.trim() }),
          ...(genre !== undefined && { genre: genre.trim() }),
          ...(duration !== undefined && { duration: duration.trim() }),
          ...(coverImage !== undefined && { coverImage: coverImage.trim() }),
          ...(audioUrl && { audioUrl: audioUrl.trim() }),
          ...(releaseYear !== undefined && { releaseYear: Number(releaseYear) }),
          ...(language !== undefined && { language: language.trim() })
        },
        { new: true, runValidators: true }
      );

      if (!updatedSong) {
        return res.status(404).json({ success: false, message: 'Song not found' });
      }

      return res.status(200).json({ success: true, message: 'Song updated successfully', data: updatedSong });
    }

    // In-memory fallback
    const index = mockSongs.findIndex(s => s.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Song not found' });
    }

    mockSongs[index] = {
      ...mockSongs[index],
      ...(title && { title: title.trim() }),
      ...(artist && { artist: artist.trim() }),
      ...(album !== undefined && { album: album.trim() }),
      ...(genre !== undefined && { genre: genre.trim() }),
      ...(duration !== undefined && { duration: duration.trim() }),
      ...(coverImage !== undefined && { coverImage: coverImage.trim() }),
      ...(audioUrl && { audioUrl: audioUrl.trim() }),
      ...(releaseYear !== undefined && { releaseYear: Number(releaseYear) }),
      ...(language !== undefined && { language: language.trim() }),
      updatedAt: new Date().toISOString()
    };

    res.status(200).json({ success: true, message: 'Song updated in memory mode', data: mockSongs[index], isMock: true });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/songs/:id
 * Delete a song
 */
exports.deleteSong = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDBConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: `Invalid Song ID format: ${id}` });
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
    next(error);
  }
};

/**
 * POST /api/songs/seed
 * Seed sample songs
 */
exports.seedSongs = async (req, res, next) => {
  try {
    if (isDBConnected()) {
      await Song.deleteMany({});
      const seeded = await Song.insertMany(mockSongs.map(({ id, ...rest }) => rest));
      return res.status(200).json({ success: true, message: 'Database seeded successfully', count: seeded.length, data: seeded });
    }
    res.status(200).json({ success: true, message: 'Mock data reset successfully', count: mockSongs.length, data: mockSongs, isMock: true });
  } catch (error) {
    next(error);
  }
};
