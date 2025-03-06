import { useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'
import { useTranslations } from 'next-intl'
import toast from 'react-hot-toast'

async function logOut() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw error
  }
}

export function useLogOut() {
  const queryClient = useQueryClient()
  const t = useTranslations('useLogOut')

  return useMutation({
    mutationFn: logOut,
    onSuccess: () => {
      queryClient.removeQueries()
      toast.success(t('loggedOut'))
    },
  })
}
