import supabase from '@/utils/supabase/client'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

type SearchResultFetchOptions = {
  searchString: string
  type?: string | null
}

async function fetchSearchResults(options: SearchResultFetchOptions) {
  let query = supabase.rpc('search_global', { search_string: options.searchString })

  if (options.type) {
    query = query.eq('type', options.type)
  }

  const { data, error } = await query

  if (error) {
    throw error
  }

  return data
}

export function useSearch(options: SearchResultFetchOptions) {
  return useQuery({
    queryKey: ['search', JSON.stringify(options)],
    queryFn: () => fetchSearchResults(options),
    enabled: options.searchString.length > 0,
    placeholderData: keepPreviousData,
  })
}
