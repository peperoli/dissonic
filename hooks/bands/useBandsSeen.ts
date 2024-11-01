import { useQuery } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'

const fetchBandsSeen = async (options: {
  userId: string
  bandId?: number
  locationId?: number
}) => {
  const query = supabase
    .from('j_bands_seen')
    .select(
      `*,
      band:bands(*, genres(*), country:countries(id, iso2)),
      concert:concerts(
        *,
        festival_root:festival_roots(*),
        bands!j_concert_bands(*),
        location:locations(*)
      )`
    )
    .eq('user_id', options.userId)
    .limit(3, { referencedTable: 'bands' })

  if (options.bandId) {
    query.eq('band_id', options.bandId)
  }

  if (options.locationId) {
    query.eq('concert.location_id', options.locationId)
  }

  const { data, error } = await query

  if (error) {
    throw error
  }

  return data
}

export const useBandsSeen = (options: { userId: string; bandId?: number; locationId?: number }) => {
  return useQuery({
    queryKey: ['bandsSeen', JSON.stringify(options)],
    queryFn: () => fetchBandsSeen(options),
  })
}
