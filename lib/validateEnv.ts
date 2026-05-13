import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_BASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_SPOTIFY_CLIENT_ID: z.string().min(1),
  NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET: z.string().min(1),
  CLOUDFLARE_ACCOUNT_ID: z.string().min(1),
  CLOUDFLARE_API_TOKEN: z.string().min(1),
  NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH: z.string().min(1),
  NEXT_PUBLIC_ALGOLIA_APP_ID: z.string().min(1),
  ALGOLIA_WRITE_API_KEY: z.string().min(1),
  NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY: z.string().min(1),
})

export type EnvSchema = z.infer<typeof envSchema>

export function validateEnv() {
  const parsed = envSchema.safeParse(process.env)

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:')
    console.error(z.flattenError(parsed.error).fieldErrors)
    process.exit(1)
  }

  console.log('✅ Environment variables loaded.')
}
