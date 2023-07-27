import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useMutation } from '@tanstack/react-query'

async function signUp(credentials: { email: string; password: string }) {
  const supabase = createClientComponentClient()

  const { error } = await supabase.auth.signUp({
    ...credentials,
    options: {
      emailRedirectTo: `${location.origin}/api/auth-callback`,
    },
  })

  if (error) {
    throw error
  }
}

export function useSignUp() {
  return useMutation(signUp, {
    onError: error => console.log(error),
  })
}
