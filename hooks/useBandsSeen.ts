import { useQuery } from 'react-query'
import { BandSeen } from '../types/types'
import supabase from '../utils/supabase'

const fetchBandsSeen = async (): Promise<BandSeen[]> => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError) {
    throw userError
  }

  const { data, error } = await supabase.from('j_bands_seen').select('*').eq('user_id', user?.id)

  if (error) {
    throw error
  }

  return data
}

export const useBandsSeen = () => {
  return useQuery('bandsSeen', () => fetchBandsSeen())
}
