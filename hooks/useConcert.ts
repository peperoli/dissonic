import { useQuery } from '@tanstack/react-query'
import { Concert } from '../types/types'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '../types/supabase'

const fetchConcert = async (concertId: string) => {
  const supabase = createClientComponentClient<Database>()

  const { data, error } = await supabase
    .from('concerts')
    .select(
      `*,
      location:locations(*),
      bands:j_concert_bands(*, ...bands(*, genres(*))),
      bands_seen:j_bands_seen(*)`
    )
    .eq('id', concertId)
    .order('item_index', { referencedTable: 'j_concert_bands', ascending: true })
    .returns<Concert>()
    .single()

  if (error) {
    throw error
  }

  return data
}

export const useConcert = (initialConcert: Concert | null, concertId: string) => {
  return useQuery(['concert', concertId], () => fetchConcert(concertId), {
    initialData: initialConcert,
  })
}
