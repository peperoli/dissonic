import { useMutation } from '@tanstack/react-query'
import { signUp } from '../actions/auth'

export function useSignUp() {
  return useMutation(signUp, {
    onError: error => console.error(error),
  })
}
