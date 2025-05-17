/** @type {import('next').NextConfig} */
const nextConfig = {
  // Other Next.js configurations...
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rickandmortyapi.com',
        pathname: '/api/character/avatar/**',
      },
    ],
  },
};

module.exports = nextConfig;
