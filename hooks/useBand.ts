import { useQuery } from 'react-query'
import { Band } from '../types/types'
import supabase from '../utils/supabase'

const fetchBand = async (bandId: number): Promise<Band> => {
  const { data, error } = await supabase
    .from('bands')
    .select('*, country:countries(id, iso2, name), genres(*), concerts:j_concert_bands(*)')
    .eq('id', bandId)
    .single()

  if (error) {
    throw error
  }

  return data
}

export const useBand = (band: Band) => {
  return useQuery(['band', band.id], () => fetchBand(band.id), { initialData: band })
}
