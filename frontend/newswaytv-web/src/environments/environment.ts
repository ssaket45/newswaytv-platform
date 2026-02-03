export const environment = {
  production: false,
  apiBaseUrl: (typeof window !== 'undefined' && window.location.hostname === 'localhost')
    ? 'http://localhost:3000/api'
    : 'https://newswaytv-platform.onrender.com/api',
  storageMode: 'api',
  driveFolderUrl: 'https://drive.google.com/drive/u/0/folders/1Z-ytveQyLVvV8LQCg98VNSU5jKq9fzzl'
};
