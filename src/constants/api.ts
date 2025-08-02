// API Configuration for Journi App
export const API_CONFIG = {
  // Nominatim Proxy (Vercel) - No CORS issues, better rate limiting
  NOMINATIM_PROXY_URL: 'https://nominatim-proxy-srutha-srinivasans-projects.vercel.app/api/geocode', // Your deployed Vercel URL
  
  // Direct Nominatim (fallback) - No API key required
  NOMINATIM_BASE_URL: 'https://nominatim.openstreetmap.org',
  
  // Unsplash - Free API key (50 requests/hour limit)
  // Get your free key at: https://unsplash.com/developers
  UNSPLASH_API_KEY: 'FQ7kWGLnQjYjeeYtiuHQORLrI3zTT5-mmnC9e28manw', // Replace with your actual key
  UNSPLASH_BASE_URL: 'https://api.unsplash.com',
  
  // Rate limiting
  NOMINATIM_RATE_LIMIT: 1000, // 1 request per second
  UNSPLASH_RATE_LIMIT: 50, // 50 requests per hour
};

// Fallback image URLs for when Unsplash fails
export const FALLBACK_IMAGES = {
  CITY: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
  LANDMARK: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
  COUNTRY: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop',
  DEFAULT: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
};

// Sample location data for offline fallback
export const SAMPLE_LOCATIONS = [
  {
    place_id: 1,
    display_name: 'Paris, France',
    lat: '48.8566',
    lon: '2.3522',
    type: 'city',
    class: 'place',
    imageUrl: 'https://images.unsplash.com/photo-1502602898535-0b4c4c8c8c8c?w=400&h=300&fit=crop',
  },
  {
    place_id: 2,
    display_name: 'Eiffel Tower, Paris, France',
    lat: '48.8584',
    lon: '2.2945',
    type: 'landmark',
    class: 'tourism',
    imageUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400&h=300&fit=crop',
  },
  {
    place_id: 3,
    display_name: 'Santorini, Greece',
    lat: '36.3932',
    lon: '25.4615',
    type: 'city',
    class: 'place',
    imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop',
  },
  {
    place_id: 4,
    display_name: 'New York City, NY, USA',
    lat: '40.7128',
    lon: '-74.0060',
    type: 'city',
    class: 'place',
    imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop',
  },
  {
    place_id: 5,
    display_name: 'Tokyo, Japan',
    lat: '35.6762',
    lon: '139.6503',
    type: 'city',
    class: 'place',
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop',
  },
]; 