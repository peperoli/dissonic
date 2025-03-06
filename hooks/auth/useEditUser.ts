import { useMutation } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'
import { useTranslations } from 'next-intl'
import toast from 'react-hot-toast';

const editUser = async (formData: { email?: string; password?: string }) => {
  const { error } = await supabase.auth.updateUser({
    email: formData.email,
    password: formData.password,
  })

  if (error) {
    throw error
  }
}

export const useEditUser = () => {
  const t = useTranslations('useEditUser')

  return useMutation({
    mutationFn: editUser,
    onError: error => console.error(error),
    onSuccess: () => toast.success(t('userSaved')),
  })
}
