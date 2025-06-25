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
      { protocol: 'https', hostname: 'dissonic.ch' },
    ],
  },
  redirects: async () => {
    return [
      {
        source: '/',
        permanent: true,
        destination: '/concerts',
      },
      {
        source: '/concerts',
        has: [
          {
            type: 'cookie',
            key: 'concertsRange',
            value: 'future',
          },
        ],
        permanent: false,
        destination: '/concerts/future',
      },
      {
        source: '/concerts',
        missing: [
          {
            type: 'cookie',
            key: 'concertsRange',
            value: 'future',
          },
        ],
        permanent: false,
        destination: '/concerts/past',
      },
    ]
  },
}

module.exports = withPWA(withNextIntl(nextConfig))
