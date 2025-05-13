import { ContributionFetchOptions } from '@/types/types'
import { useQuery } from '@tanstack/react-query'
import supabase from 'utils/supabase/client'

export const relatedResourceTypes = {
  concerts: ['j_concert_bands'],
  bands: ['j_band_genres'],
  locations: [],
  festival_roots: [],
}

async function fetchContributionsCount({
  resourceType,
  resourceId,
  userId,
}: {
  resourceType?: ContributionFetchOptions['resourceType']
  resourceId?: number
  userId?: ContributionFetchOptions['userId'] | null
}) {
  let query = supabase.from('contributions').select('*', { count: 'estimated', head: true })

  if (resourceType && resourceType !== 'all') {
    query = query.in('resource_type', [resourceType, ...relatedResourceTypes[resourceType]])
  }

  if (resourceId) {
    query = query.eq('resource_id', resourceId)
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
  resourceType,
  resourceId,
  userId,
}: {
  resourceType?: ContributionFetchOptions['resourceType']
  resourceId?: number
  userId?: ContributionFetchOptions['userId'] | null
}) {
  return useQuery({
    queryKey: ['contributions-count', resourceType, resourceId, userId],
    queryFn: () => fetchContributionsCount({ resourceType, resourceId, userId }),
  })
}
