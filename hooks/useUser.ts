import { User } from '@supabase/supabase-js'
import { useQuery } from '@tanstack/react-query'
import supabase from '../utils/supabase'

const fetchUser = async (): Promise<User | null> => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    throw error
  }

  return user
}

export function useUser(jwt?: string) {
  return useQuery(['user'], fetchUser, { enabled: !!jwt })
}
