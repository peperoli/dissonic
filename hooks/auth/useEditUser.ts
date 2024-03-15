import { useMutation } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'
import { useQueryState } from 'nuqs'

const editUser = async (newUser: { email?: string; password?: string }) => {
  const { error } = await supabase.auth.updateUser({
    email: newUser.email,
    password: newUser.password,
  })

  if (error) {
    throw error
  }
}

export const useEditUser = () => {
  const [_, setModal] = useQueryState('modal', { history: 'push' })
  return useMutation(editUser, {
    onError: error => console.error(error),
    onSuccess: () => setModal(null),
  })
}
