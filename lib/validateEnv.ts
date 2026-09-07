import { z } from 'zod'

const envSchema = z.object({
  // General
  NEXT_PUBLIC_BASE_URL: z.url(),
  CRON_SECRET: z.string().min(1),
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  // Spotify
  NEXT_PUBLIC_SPOTIFY_CLIENT_ID: z.string().min(1),
  NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET: z.string().min(1),
  NEXT_PUBLIC_ALGOLIA_APP_ID: z.string().min(1),
  // Algolia
  ALGOLIA_WRITE_API_KEY: z.string().min(1),
  NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY: z.string().min(1),
  // Bunny
  BUNNY_STREAM_API_KEY: z.string().min(1),
  BUNNY_STREAM_READ_API_KEY: z.string().min(1),
  BUNNY_STORAGE_API_KEY: z.string().min(1),
})

export type EnvSchema = z.infer<typeof envSchema>

export function validateEnv() {
  const parsed = envSchema.safeParse(process.env)

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:')
    console.error(z.flattenError(parsed.error).fieldErrors)
    process.exit(1)
  }

  console.info('✅ Environment variables loaded.')
}
