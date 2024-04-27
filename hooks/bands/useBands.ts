import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Band, ExtendedRes, BandFetchOptions } from '@/types/types'
import { getPagination } from '@/lib/getPagination'
import supabase from '@/utils/supabase/client'

const fetchBands = async (options?: BandFetchOptions): Promise<ExtendedRes<Band[]>> => {
  let filterQuery = supabase.from('bands').select('id, genres(id)', { count: 'estimated' })

  if (options?.search) {
    // @ts-expect-error
    filterQuery = supabase.rpc(
      'search_bands',
      { search_string: options.search },
      { count: 'estimated' }
    )
  }

  if (options?.ids && options.ids.length > 0) {
    filterQuery = filterQuery.in('id', options.ids)
  }

  if (options?.countries && options.countries.length > 0) {
    filterQuery = filterQuery.in('country_id', options.countries)
  }

  const { data: initialFilteredBands, count: initialCount, error: countError } = await filterQuery

  if (countError) {
    throw countError
  }

  const [from, to] = getPagination(options?.page ?? 0, options?.size ?? 25, initialCount ?? 0)

  let filteredBands = initialFilteredBands

  if (options?.genres && options.genres.length > 0) {
    filteredBands = filteredBands?.filter(band =>
      band.genres.some(genre => options.genres?.includes(genre.id))
    )
  }

  let query = supabase
    .from('bands')
    .select('*, country:countries(id, iso2), genres(*)', { count: 'estimated' })
    .in('id', filteredBands?.map(item => item.id) as number[])

  if (options?.page || options?.size) {
    query = query.range(from, to)
  }

  const { data, count, error } = await query.order('name')

  if (error) {
    throw error
  }

  return { data, count }
}

export const useBands = (
  initialBands?: ExtendedRes<Band[]>,
  options?: BandFetchOptions,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['bands', JSON.stringify(options)],
    queryFn: () => fetchBands(options),
    placeholderData: previousData => keepPreviousData(previousData || initialBands),
    enabled,
  })
}
