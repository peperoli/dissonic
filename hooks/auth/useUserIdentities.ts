import { UserIdentity } from '@supabase/supabase-js'
import { useQuery } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'

async function fetchUserIdentities() {
  const { data, error } = await supabase.auth.getUserIdentities()

  if (error) {
    throw error
  }

  return data.identities
}

export function useUserIdentities(placeholderData: UserIdentity[]) {
  return useQuery({ queryFn: fetchUserIdentities, queryKey: ['user-identities'], placeholderData })
}
