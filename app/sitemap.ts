import { createClient } from '@/utils/supabase/server'
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!

  const { data: concerts } = await supabase.from('concerts').select('id')
  const { data: bands } = await supabase.from('bands').select('id')
  const { data: locations } = await supabase.from('locations').select('id')
  const { data: profiles } = await supabase.from('profiles').select('id')

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    ...(concerts?.map(
      concert =>
        ({
          url: `${baseUrl}/concerts/${concert.id}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        }) as const
    ) ?? []),
    ...(bands?.map(
      band =>
        ({
          url: `${baseUrl}/bands/${band.id}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        }) as const
    ) ?? []),
    ...(locations?.map(
      location =>
        ({
          url: `${baseUrl}/locations/${location.id}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        }) as const
    ) ?? []),
    ...(profiles?.map(
      profile =>
        ({
          url: `${baseUrl}/profiles/${profile.id}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        }) as const
    ) ?? []),
  ]
}
