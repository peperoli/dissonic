/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['i.scdn.co'],
  },
  swcMinify: true,
  experimental: {
    appDir: true,
  }
}

module.exports = nextConfig
