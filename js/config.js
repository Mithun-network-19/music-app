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
    // In production, use the same origin (e.g., Render URL)
    const origin = window.location.origin.replace(/^http:/, 'https:');
    return `${origin}/api/songs`;
  })(),
  
  DEFAULT_COVER: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80'
};
