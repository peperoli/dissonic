import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useQuery } from '@tanstack/react-query'

const retrieveSession = async () => {
  const supabase = createClientComponentClient()

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
  return useQuery(['session'], retrieveSession)
}
