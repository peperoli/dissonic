import { useQuery } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'

const fetchBandsSeen = async (options: {
  userId?: string
  bandId?: number
  locationId?: number
  bandsSize?: number
}) => {
  let countQuery = supabase.from('j_bands_seen').select('*', { count: 'estimated', head: true })

  if (options.userId) {
    countQuery = countQuery.eq('user_id', options.userId)
  }

  if (options.bandId) {
    countQuery = countQuery.eq('band_id', options.bandId)
  }

  if (options.locationId) {
    countQuery = countQuery.eq('concert.location_id', options.locationId)
  }

  if (options.bandsSize) {
    countQuery = countQuery.limit(options.bandsSize, { referencedTable: 'concert.bands' })
  }

  const { count } = await countQuery
  const perPage = 1000
  const maxPage = count ? Math.ceil(count / perPage) : 1
  const queries = []

  for (let page = 1; page <= maxPage; page++) {
    let query = supabase
      .from('j_bands_seen')
      .select(
        `*,
      band:bands(*, genres(*), country:countries(id, iso2)),
      concert:concerts(
        *,
        festival_root:festival_roots(*),
        bands:j_concert_bands(*, ...bands(*)),
        location:locations(*)
      )`,
        { count: 'estimated' }
      )
      .limit(3, { referencedTable: 'bands' })
      .order('created_at')
      .order('item_index', { referencedTable: 'concert.bands' })
      .range((page - 1) * perPage, page * perPage - 1)

    if (options.userId) {
      query = query.eq('user_id', options.userId)
    }

    if (options.bandId) {
      query = query.eq('band_id', options.bandId)
    }

    if (options.locationId) {
      query = query.eq('concert.location_id', options.locationId)
    }

    if (options.bandsSize) {
      query = query.limit(options.bandsSize, { referencedTable: 'concert.bands' })
    }

    queries.push(query)
  }

  const responses = await Promise.all(queries)

  if (responses.some(({ error }) => error)) {
    throw responses.find(({ error }) => error)
  }

  return responses.flatMap(({ data }) => data).filter(bandSeen => bandSeen !== null)
}

export const useBandsSeen = (options: {
  userId?: string
  bandId?: number
  locationId?: number
  bandsSize?: number
}) => {
  const HOUR = 1000 * 3600
  return useQuery({
    queryKey: ['bandsSeen', JSON.stringify(options)],
    queryFn: () => fetchBandsSeen(options),
    staleTime: HOUR,
    gcTime: HOUR,

  })
}
