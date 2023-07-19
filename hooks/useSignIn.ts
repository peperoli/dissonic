import { useMutation } from '@tanstack/react-query'
import supabase from '../utils/supabase'

async function signIn(user: { email: string; password: string }) {
  const { error } = await supabase.auth.signInWithPassword(user)

  if (error) {
    throw error
  }
}

export function useSignIn() {
  return useMutation(signIn, {
    onError: error => console.log(error),
  })
}
