import supabase from '@/utils/supabase/client'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { FestivalRoot, QueryOptions } from '@/types/types'

async function fetchFestivalRoot(festivalRootId: number): Promise<FestivalRoot> {
  const { data, error } = await supabase
    .from('festival_roots')
    .select('*')
    .eq('id', festivalRootId)
    .single()

  if (error) {
    throw error
  }

  return data
}

export const useFestivalRoot = (festivalRootId: number, options?: QueryOptions<FestivalRoot>) => {
  return useQuery({
    queryKey: ['festivalRoot', festivalRootId],
    queryFn: () => fetchFestivalRoot(festivalRootId),
    placeholderData: previousData => keepPreviousData(previousData || options?.placeholderData),
    enabled: options?.enabled !== false && festivalRootId !== null,
  })
}
