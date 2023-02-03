import { useQuery } from 'react-query'
import { Profile } from '../types/types'
import supabase from '../utils/supabase'

const fetchProfile = async (userId: string | undefined): Promise<Profile> => {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()

  if (error) {
    throw error
  }

  return data
}

export const useProfile = (userId: string | undefined) => {
  return useQuery('profile', () => fetchProfile(userId), { enabled: !!userId })
}
