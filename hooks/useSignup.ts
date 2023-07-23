import { useMutation } from '@tanstack/react-query'
import supabase from '../utils/supabase'

async function signUp(credentials: { email: string; password: string }) {
  const { error } = await supabase.auth.signUp(credentials)

  if (error) {
    throw error
  }
}

export function useSignUp() {
  return useMutation(signUp, {
    onError: error => console.log(error),
  })
}
