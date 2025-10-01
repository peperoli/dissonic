import { useQuery } from '@tanstack/react-query'
import { Profile } from '@/types/types'
import supabase from '@/utils/supabase/client'

const fetchProfiles = async (options?: { ids?: string[] }): Promise<Profile[]> => {
  let query = supabase
    .from('profiles')
    .select('id, username, role, avatar_path, created_at, updated_at')

  if (options?.ids && options.ids.length > 0) {
    query = query.in('id', options.ids)
  }

  const { data, error } = await query

  if (error) {
    throw error
  }

  return data
}

export const useProfiles = (options?: { ids?: string[] }, enabled?: boolean) => {
  return useQuery({
    queryKey: ['profiles', JSON.stringify(options)],
    queryFn: () => fetchProfiles(options),
    enabled: enabled === undefined || enabled,
  })
}
