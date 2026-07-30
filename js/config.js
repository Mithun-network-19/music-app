/**
 * Global Configuration for Music App API
 */
const CONFIG = {
  API_BASE_URL: (function() {
    const isLocal = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' || 
                    window.location.protocol === 'file:';
    if (isLocal) {
      return 'http://localhost:5000/api/songs';
    }
    // Update this to your deployed Render URL once deployed (e.g. 'https://music-app-backend.onrender.com/api/songs')
    return 'http://localhost:5000/api/songs';
  })(),
  
  DEFAULT_COVER: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80'
};
