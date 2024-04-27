import { useMutation } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'

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
  return useMutation({ mutationFn: editUser, onError: error => console.error(error) })
}
