import { useMutation } from '@tanstack/react-query'
import { signIn } from '../actions/auth'

export function useSignIn() {
  return useMutation(signIn, {
    onError: error => console.error(error),
  })
}
