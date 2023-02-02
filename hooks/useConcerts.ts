import { useQuery } from "react-query"
import { Concert } from "../types/types"
import supabase from "../utils/supabase"

const fetchConcerts = async (): Promise<Concert[]> => {
  const { data, error } = await supabase
    .from('concerts')
    .select('*, location:locations(*), bands!j_concert_bands(*), bandsSeen:j_bands_seen(band_id, user_id)')
    .order('date_start', { ascending: false })

  if (error) {
    throw error
  }

  return data
}

export const useConcerts = () => {
  return useQuery('concerts', fetchConcerts)
}