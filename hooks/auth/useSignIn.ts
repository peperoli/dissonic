import { useMutation } from '@tanstack/react-query'
import { signIn } from '@/actions/auth'

export function useSignIn() {
  return useMutation({ mutationFn: signIn, onError: error => console.error(error) })
}
