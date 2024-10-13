import { useQuery } from '@tanstack/react-query'
import { Genre } from '@/types/types'
import supabase from '@/utils/supabase/client'

async function fetchGenre(id: Genre['id'] | null) {
  if (!id) {
    throw new Error('Genre-ID is missing.')
  }

  const { data, error } = await supabase.from('genres').select('*').eq('id', id).single()

  if (error) {
    throw error
  }

  return data
}

export const useGenre = (id: Genre['id'] | null ) => {
  return useQuery({
    queryKey: ['genre', id],
    queryFn: () => fetchGenre(id),
  })
}
