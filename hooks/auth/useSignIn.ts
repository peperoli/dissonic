import { useMutation } from '@tanstack/react-query'
import { signIn } from '@/actions/auth'
import { useRouter, useSearchParams } from 'next/navigation'

export function useSignIn() {
  const { push } = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect')
  return useMutation({
    mutationFn: signIn,
    onError: error => console.error(error),
    onSuccess: () => push(redirect ? redirect : '/'),
  })
}
