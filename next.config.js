/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: '*.firebaseimg.com' },
      { protocol: 'https', hostname: '*.firebaseusercontent.com' },
      { protocol: 'https', hostname: 'img.gamepix.com' },
      { protocol: 'https', hostname: 'images.gamepix.com' },
    ],
  },

  async headers() {
    const cspHeader = `
      default-src 'self';
      
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https: 
        https://pagead2.googlesyndication.com 
        https://adservice.google.com 
        https://www.googletagmanager.com 
        https://www.google-analytics.com 
        https://*.disqus.com 
        https://*.disquscdn.com;
        
      style-src 'self' 'unsafe-inline' https: 
        https://fonts.googleapis.com 
        https://*.disquscdn.com;
        
      img-src 'self' blob: data: https: 
        https://res.cloudinary.com 
        https://*.firebaseimg.com 
        https://*.firebaseusercontent.com 
        https://*.disquscdn.com 
        https://pagead2.googlesyndication.com
        https://img.gamepix.com
        https://images.gamepix.com;
        
      frame-src 'self' blob: data: https: 
        https://*.firebaseapp.com 
        https://*.google.com 
        https://*.youtube.com 
        https://www.youtube-nocookie.com 
        https://disqus.com 
        https://googleads.g.doubleclick.net;
        
      connect-src 'self' blob: data: https:
        http://localhost:* ws://localhost:* http://127.0.0.1:* ws://127.0.0.1:*
        https://*.googleapis.com 
        https://*.firebaseio.com 
        https://*.firestore.googleapis.com 
        https://identitytoolkit.googleapis.com 
        https://links.services.disqus.com 
        https://www.google-analytics.com;
        
      font-src 'self' data: https: 
        https://fonts.gstatic.com;
        
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim();

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader,
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;