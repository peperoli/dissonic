import { useMutation } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { useTranslations } from 'next-intl'
import supabase from '@/utils/supabase/client'

export type SignInFormData = {
  email: string
  password: string
}

async function signIn(formData: SignInFormData) {
  const { error } = await supabase.auth.signInWithPassword(formData)

  if (error) {
    throw error
  }
}

export function useSignIn() {
  const { push } = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect')
  const t = useTranslations('useSignIn')

  return useMutation({
    mutationFn: signIn,
    onError: error => {
      console.error(error)
    },
    onSuccess: () => {
      push(redirect ? redirect : '/')
      toast.success(t('loggedIn'))
    },
  })
}
