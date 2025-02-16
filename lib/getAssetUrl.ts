import supabase from '@/utils/supabase/client'

export function getAssetUrl(
  bucket: 'avatars' | 'ressources',
  path: string | null,
  updatedAt?: string | null
) {
  if (!path) {
    return null
  }

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(updatedAt ? `${path}?t=${updatedAt}` : path)

  return data.publicUrl
}
