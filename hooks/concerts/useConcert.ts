import { useQuery } from '@tanstack/react-query'
import { Concert } from '@/types/types'
import supabase from '@/utils/supabase/client'

const fetchConcert = async (concertId: Concert['id'] | null): Promise<Concert> => {
  if (!concertId) {
    throw new Error('Concert-ID is missing.')
  }

  const { data, error } = await supabase
    .from('concerts')
    .select(
      `*,
      festival_root:festival_roots(name),
      location:locations(*),
      bands:j_concert_bands(*, ...bands(*, country:countries(id, iso2), genres(*))),
      bands_seen:j_bands_seen(*),
      creator:profiles!concerts_creator_id_fkey(username)`
    )
    .eq('id', concertId)
    .order('item_index', { referencedTable: 'j_concert_bands', ascending: true })
    .single()

  if (error) {
    throw error
  }

  return data
}

export const useConcert = (concertId: Concert['id'] | null, initialConcert?: Concert | null, enabled?: boolean) => {
  return useQuery({
    queryKey: ['concert', concertId],
    queryFn: () => fetchConcert(concertId),
    placeholderData: initialConcert || undefined,
    enabled: !!concertId && enabled !== false,
  })
}
