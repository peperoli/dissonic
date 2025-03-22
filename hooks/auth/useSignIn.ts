import { useMutation } from '@tanstack/react-query'
import { signIn } from '@/actions/auth'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { useTranslations } from 'next-intl'

export function useSignIn() {
  const { push } = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect')
  const t = useTranslations('useSignIn')

  return useMutation({
    mutationFn: signIn,
    onError: error => { console.error(error); toast.error(error.message)},
    onSuccess: () => {
      push(redirect ? redirect : '/')
      toast.success(t('loggedIn'))
    },
  })
}
