import { useQuery } from '@tanstack/react-query'
import { Profile } from '../types/types'
import supabase from '../utils/supabase'

const fetchProfile = async (userId: string | undefined): Promise<Profile> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, friends!receiver_id(count)')
    .eq('id', userId)
    .eq('friends.pending', true)
    .single()

  if (error) {
    throw error
  }

  return data
}

export const useProfile = (userId: string | undefined) => {
  return useQuery(['profile'], () => fetchProfile(userId), { enabled: !!userId })
}
