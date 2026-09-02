import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
// @ts-expect-error - don't care about types for next-pwa
import createNextPWAPlugin from 'next-pwa'
import { validateEnv } from './lib/validateEnv'

validateEnv()

const withPWA = createNextPWAPlugin({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  scope: '/app',
  skipWaiting: true,
})

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.scdn.co' },
      { protocol: 'https', hostname: 'saehmgtoacwmofqbbaff.supabase.co' },
      { protocol: 'https', hostname: 'dissonic.ch' },
      { protocol: 'https', hostname: 'concert-memories.b-cdn.net' },
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

export default withPWA(withNextIntl(nextConfig))
