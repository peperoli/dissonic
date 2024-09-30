import { useQuery } from '@tanstack/react-query'
import { Band } from '@/types/types'
import supabase from '@/utils/supabase/client'

const fetchBand = async (bandId: number | null): Promise<Band> => {
  if (!bandId) {
    throw new Error('Band-ID is missing.')
  }

  const { data, error } = await supabase
    .from('bands')
    .select(
      `*,
      country:countries(id, iso2),
      genres(*),
      concerts!j_concert_bands(*),
      creator:profiles!bands_creator_id_fkey(*)`
    )
    .eq('id', bandId)
    .single()

  if (error) {
    throw error
  }

  return data
}

export const useBand = (id: number | null, initialBand?: Band | null, enabled?: boolean) => {
  return useQuery({
    queryKey: ['band', id],
    queryFn: () => fetchBand(id),
    placeholderData: initialBand || undefined,
    enabled: !!id && enabled !== false,
  })
}
