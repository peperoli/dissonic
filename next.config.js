/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({ dest: 'public', scope: '/app' })

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['i.scdn.co'],
  },
  swcMinify: true,
  experimental: {
    appDir: true,
  },
}

module.exports = withPWA(nextConfig)
