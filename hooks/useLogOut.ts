import { useMutation, useQueryClient } from 'react-query'
import supabase from '../utils/supabase'

async function logOut() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw error
  }
}

export function useLogOut() {
  const queryClient = useQueryClient()

  return useMutation(logOut, {
    onSuccess: () => {
      queryClient.removeQueries()
    },
  })
}