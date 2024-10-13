/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  scope: '/app',
  skipWaiting: true,
})

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.scdn.co' },
      { protocol: 'https', hostname: 'saehmgtoacwmofqbbaff.supabase.co' },
    ],
  },
  swcMinify: true,
  redirects: async () => {
    return [
      {
        source: '/concerts',
        destination: '/',
        permanent: true,
      },
    ]
  }
}

module.exports = withPWA(nextConfig)
