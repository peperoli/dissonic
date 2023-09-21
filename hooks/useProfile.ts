import { useQuery } from '@tanstack/react-query'
import { Profile } from '../types/types'
import supabase from '../utils/supabase'

const fetchProfile = async (userId: string | null, username?: string | null): Promise<Profile> => {
  let query = supabase
    .from('profiles')
    .select('*, friends!receiver_id(count)')
    .eq('friends.pending', true)

  if (userId) {
    query = query.eq('id', userId)
  }

  if (username) {
    query = query.eq('username', username)
  }

  const { data, error } = await query.single()

  if (error) {
    throw error
  }

  return data
}

export const useProfile = (userId: string | null, username?: string | null, initialProfile?: Profile) => {
  return useQuery(['profile', userId], () => fetchProfile(userId, username), {
    enabled: !!(userId || username),
    initialData: initialProfile,
  })
}
