import supabase from '@/utils/supabase/client'
import { useQuery } from '@tanstack/react-query'

const retrieveSession = async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  if (error) {
    throw error
  }

  return session
}

export const useSession = () => {
  return useQuery({ queryKey: ['session'], queryFn: retrieveSession })
}
