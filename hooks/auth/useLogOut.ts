import { useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'

async function logOut() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw error
  }
}

export function useLogOut() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logOut,
    onSuccess: () => {
      queryClient.removeQueries()
    },
  })
}
