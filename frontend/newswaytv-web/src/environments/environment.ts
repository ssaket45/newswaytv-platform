export const environment = {
  production: false,
  apiBaseUrl: (typeof window !== 'undefined' && window.location.hostname === 'localhost')
    ? 'http://localhost:3000/api'
    : 'https://YOUR-RENDER-URL/api',
  storageMode: 'api'
  
};
