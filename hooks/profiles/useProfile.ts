import { useQuery } from '@tanstack/react-query'
import { Profile } from '@/types/types'
import supabase from '@/utils/supabase/client'

const fetchProfile = async (userId: string | null, username?: string | null): Promise<Profile> => {
  let query = supabase
    .from('profiles')
    .select('id, username, role, avatar_path, created_at, updated_at, friends!receiver_id(count)')
    .eq('friends.pending', true)

  if (userId) {
    query = query.eq('id', userId)
  } else if (username) {
    query = query.eq('username', username)
  }

  const { data, error } = await query.single()

  if (error) {
    throw error
  }

  return data
}

export const useProfile = (
  userId: string | null,
  username?: string | null,
  initialProfile?: Profile
) => {
  return useQuery({
    queryKey: ['profile', userId || username],
    queryFn: () => fetchProfile(userId, username),
    enabled: !!(userId || username),
    placeholderData: initialProfile,
  })
}
