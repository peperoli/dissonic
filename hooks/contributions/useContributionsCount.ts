import { ContributionFetchOptions } from '@/types/types'
import { useQuery } from '@tanstack/react-query'
import supabase from 'utils/supabase/client'

export const relatedRessourceTypes = {
  concerts: ['j_concert_bands'],
  bands: ['j_band_genres'],
  locations: [],
  festival_roots: [],
}

async function fetchContributionsCount({
  ressourceType,
  ressourceId,
  userId,
}: {
  ressourceType?: ContributionFetchOptions['ressourceType']
  ressourceId?: number
  userId?: ContributionFetchOptions['userId'] | null
}) {
  let query = supabase.from('contributions').select('*', { count: 'estimated', head: true })

  if (ressourceType && ressourceType !== 'all') {
    query = query.in('ressource_type', [ressourceType, ...relatedRessourceTypes[ressourceType]])
  }

  if (ressourceId) {
    query = query.eq('ressource_id', ressourceId)
  }

  if (userId) {
    query = query.eq('user_id', userId)
  }

  const { count, error } = await query

  if (error) {
    throw error
  }

  return count
}

export function useContributionsCount({
  ressourceType,
  ressourceId,
  userId,
}: {
  ressourceType?: ContributionFetchOptions['ressourceType']
  ressourceId?: number
  userId?: ContributionFetchOptions['userId'] | null
}) {
  return useQuery({
    queryKey: ['contributions-count', ressourceType, ressourceId, userId],
    queryFn: () => fetchContributionsCount({ ressourceType, ressourceId, userId }),
  })
}
