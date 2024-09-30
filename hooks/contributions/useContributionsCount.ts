import { useQuery } from '@tanstack/react-query'
import supabase from 'utils/supabase/client'

async function fetchContributionsCount({
  ressourceType,
  ressourceId,
}: {
  ressourceType: string
  ressourceId: number
}) {
  const { count, error } = await supabase
    .from('contributions')
    .select('*', { count: 'estimated', head: true })
    .eq('ressource_type', ressourceType)
    .eq('ressource_id', ressourceId)

  if (error) {
    throw error
  }

  return count
}

export function useContributionsCount({
  ressourceType,
  ressourceId,
}: {
  ressourceType: string
  ressourceId: number
}) {
  return useQuery({
    queryKey: ['contributions-count', ressourceType, ressourceId],
    queryFn: () => fetchContributionsCount({ ressourceType, ressourceId }),
  })
}
