/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. క్లౌడినరీ మరియు ఫైర్‌బేస్ ఇమేజ్ హోస్టింగ్ పర్మిషన్లు
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '*.firebaseimg.com',
      },
      {
        protocol: 'https',
        hostname: '*.firebaseusercontent.com',
      },
    ],
  },

  // 2. ఫైర్‌బేస్ అథెంటికేషన్ క్రాష్ అవ్వకుండా CSP ని అడ్జస్ట్ చేశాం
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
        https://pagead2.googlesyndication.com;
        
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
          // Content Security Policy (CSP)
          {
            key: 'Content-Security-Policy',
            value: cspHeader,
          },
          // క్లిక్‌జాకింగ్ ప్రొటెక్షన్ (ఫైర్‌బేస్ అథెంటికేషన్ ఐఫ్రేమ్స్ పని చేయడానికి దీన్ని కామెంట్ చేయడమే బెస్ట్)
          // { key: 'X-Frame-Options', value: 'DENY' },
          // బ్రౌజర్ XSS ప్రొటెక్షన్
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // MIME-Type స్నిఫింగ్ ప్రొటెక్షన్
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // సెక్యూర్ రెఫరర్ పాలసీ
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