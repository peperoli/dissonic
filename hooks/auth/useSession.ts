import { Enums } from '@/types/supabase'
import supabase from '@/utils/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { jwtDecode } from 'jwt-decode'

const retrieveSession = async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  if (error) {
    throw error
  }

  if (!session) {
    return null
  }

  const jwt = jwtDecode(session.access_token)
  const sessionWithRole = {
    ...session,
    user_role: 'user_role' in jwt ? (jwt.user_role as Enums<'app_role'>) : null,
    isMod:
      'user_role' in jwt ? jwt.user_role === 'moderator' || jwt.user_role === 'developer' : false,
    isDev: 'user_role' in jwt ? jwt.user_role === 'developer' : false,
  }

  return sessionWithRole
}

export const useSession = () => {
  return useQuery({ queryKey: ['session'], queryFn: retrieveSession })
}
