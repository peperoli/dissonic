const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  scope: '/app',
  skipWaiting: true,
})

const withNextIntl = require('next-intl/plugin')()

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.scdn.co' },
      { protocol: 'https', hostname: 'saehmgtoacwmofqbbaff.supabase.co' },
    ],
  },
  redirects: async () => {
    return [
      {
        source: '/concerts',
        destination: '/',
        permanent: true,
      },
    ]
  },
}

module.exports = withPWA(withNextIntl(nextConfig))
