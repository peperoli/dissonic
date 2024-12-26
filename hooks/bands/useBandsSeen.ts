import { useQuery } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'

const fetchBandsSeen = async (options: {
  userId: string
  bandId?: number
  locationId?: number
  bandsSize?: number
}) => {
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
      )`
    )
    .eq('user_id', options.userId)
    .limit(3, { referencedTable: 'bands' })

  if (options.bandId) {
    query = query.eq('band_id', options.bandId)
  }

  if (options.locationId) {
    query = query.eq('concert.location_id', options.locationId)
  }

  if (options.bandsSize) {
    query = query.limit(options.bandsSize, { referencedTable: 'concert.bands' })
  }

  const { data, error } = await query.order('item_index', { referencedTable: 'concert.bands' })

  if (error) {
    throw error
  }

  return data
}

export const useBandsSeen = (options: {
  userId: string
  bandId?: number
  locationId?: number
  bandsSize?: number
}) => {
  return useQuery({
    queryKey: ['bandsSeen', JSON.stringify(options)],
    queryFn: () => fetchBandsSeen(options),
  })
}
