import supabase from '@/utils/supabase/client'

export function getAssetUrl(path: string | null | undefined) {
  if (!path) {
    return null
  }

  const { data } = supabase.storage.from('avatars').getPublicUrl(path)

  return data.publicUrl
}