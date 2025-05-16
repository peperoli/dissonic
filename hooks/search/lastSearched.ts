import { SearchResult } from '@/components/layout/SearchForm'
import supabase from '@/utils/supabase/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useSession } from '../auth/useSession'
import { Session } from '@supabase/supabase-js'

async function fetchLastSearched(session: Session | null | undefined) {
  if (!session) return

  const { data, error } = await supabase
    .from('profiles')
    .select('last_searched')
    .eq('id', session.user.id)
    .single()

  if (error) {
    throw error
  }

  return data.last_searched as SearchResult[]
} 

export function useLastSearched() {
  const { data: session } = useSession()
  return useQuery({
    queryKey: ['lastSearched', session?.user.id],
    queryFn: () => fetchLastSearched(session),
  })
}

async function saveLastSearched(lastSearched: SearchResult[]) {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) return

  const { error } = await supabase
    .from('profiles')
    .update({ last_searched: lastSearched })
    .eq('id', session.user.id)

  if (error) {
    throw error
  }
}

export function useSaveLastSearched() {
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  return useMutation({
    mutationFn: saveLastSearched,
    onError: error => {
      console.error(error)
      toast.error(error.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['lastSearched', session?.user.id],
      })
    }
  })
}
