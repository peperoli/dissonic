import { useQuery } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'
import { Location } from '@/types/types'

async function fetchLocation(id: number) {
  const { data, error } = await supabase
    .from('locations')
    .select('*, country:countries(id, iso2)')
    .eq('id', id)
    .single()

  if (error) {
    throw error
  }

  return data
}

export function useLocation(id: number, initialData?: Location | null) {
  return useQuery({
    queryKey: ['location', id],
    queryFn: () => fetchLocation(id),
    enabled: !!id,
    initialData,
  })
}
