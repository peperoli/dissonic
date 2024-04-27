import { useMutation } from '@tanstack/react-query'
import { signUp } from '@/actions/auth'

export function useSignUp() {
  return useMutation({ mutationFn: signUp, onError: error => console.error(error) })
}
