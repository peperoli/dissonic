import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useMutation } from '@tanstack/react-query'
import { Database } from '../types/supabase'

async function signIn(user: { email: string; password: string }) {
  const supabase = createClientComponentClient<Database>()

  const { error } = await supabase.auth.signInWithPassword(user)

  if (error) {
    throw error
  }
}

export function useSignIn() {
  return useMutation(signIn, {
    onError: error => console.error(error),
  })
}
