import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Band, ExtendedRes, BandFetchOptions, QueryOptions } from '@/types/types'
import { getPagination } from '@/lib/getPagination'
import supabase from '@/utils/supabase/client'

const fetchBands = async (options?: BandFetchOptions): Promise<ExtendedRes<Band[]>> => {
  const [from, to] = getPagination(options?.page, options?.size)

  let countQuery = supabase.from('bands').select('*', { count: 'exact', head: true })

  if (options?.search && options.search.length > 1) {
    countQuery = supabase.rpc(
      'search_bands',
      { search_string: options.search },
      { count: 'exact', head: true }
    )
  }

  if (options?.ids && options.ids.length > 0) {
    countQuery = countQuery.in('id', options.ids)
  }

  if (options?.countries && options.countries.length > 0) {
    countQuery = countQuery.in('country_id', options.countries)
  }

  const { count } = await countQuery

  const ROWS_PER_PAGE = 1000
  const maxPage = count ? Math.ceil(count / ROWS_PER_PAGE) : 1
  const filterQueries = []

  for (let page = 1; page <= maxPage; page++) {
    let filterQuery = supabase
      .from('bands')
      .select('id, genres(id)')
      .eq('is_archived', false)
      .range((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE - 1)

    if (options?.search && options.search.length > 1) {
      // @ts-expect-error
      filterQuery = supabase.rpc('search_bands', { search_string: options.search })
    }

    if (options?.ids && options.ids.length > 0) {
      filterQuery = filterQuery.in('id', options.ids)
    }

    if (options?.countries && options.countries.length > 0) {
      filterQuery = filterQuery.in('country_id', options.countries)
    }

    filterQueries.push(filterQuery)
  }

  const responses = await Promise.all(filterQueries)

  if (responses.some(({ error }) => error)) {
    throw responses.find(({ error }) => error)
  }

  let filteredBands = responses.flatMap(({ data }) => data).filter(band => band !== null)

  if (options?.genres && options.genres.length > 0) {
    filteredBands = filteredBands?.filter(band =>
      band.genres.some(genre => options.genres?.includes(genre.id))
    )
  }

  const { data, error } = await supabase
    .from('bands')
    .select('*, country:countries(id, iso2), genres(*)')
    .in(
      'id',
      filteredBands?.map(item => item.id)
    )
    .order('name')
    .range(from, to)

  if (error) {
    throw error
  }

  return { data, count }
}

export const useBands = (options: BandFetchOptions & QueryOptions<ExtendedRes<Band[]>> = {}) => {
  const { placeholderData, enabled, ...fetchOptions } = options
  return useQuery({
    queryKey: ['bands', JSON.stringify(fetchOptions)],
    queryFn: () => fetchBands(fetchOptions),
    placeholderData: previousData => keepPreviousData(previousData || placeholderData),
    enabled: enabled !== false,
  })
}
