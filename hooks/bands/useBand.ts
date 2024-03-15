import { useQuery } from '@tanstack/react-query'
import { Band } from '@/types/types'
import supabase from '@/utils/supabase/client'

const fetchBand = async (bandId: number): Promise<Band> => {
  const { data, error } = await supabase
    .from('bands')
    .select('*, country:countries(id, iso2), genres(*), concerts!j_concert_bands(*)')
    .eq('id', bandId)
    .single()

  if (error) {
    throw error
  }

  return data
}

export const useBand = (id: number, initialData?: Band) => {
  return useQuery(['band', id], () => fetchBand(id), { initialData, enabled: !!id })
}
