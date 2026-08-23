/** @type {import('next').NextConfig} */

const nextConfig = {
  serverExternalPackages: ['wreq-js'],
  skipTrailingSlashRedirect: true,
  async headers() {
    return [
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ]
  },

  async rewrites() {
    return [
      {
        source: '/about',
        destination: '/terms/about',
      },
      {
        source: '/contact',
        destination: '/terms/contact',
      },
      {
        source: '/api/steam/game/',
        destination: '/api/steam/game',
      }
    ]
  },


  images: {
    qualities: [75, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static-cdn.jtvnw.net',
      },
      {
        protocol: 'https',
        hostname: '*.steamstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'media.valorant-api.com',
      },
      {
        protocol: 'https',
        hostname: 'user-images.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'yt3.ggpht.com',
      },
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
      }
    ],
  },
};

export default nextConfig;
