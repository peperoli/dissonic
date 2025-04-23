import { useMutation } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'

export type SignUpFormData = {
  email: string
  password: string
  username: string
}

export async function signUp(formData: SignUpFormData) {
  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({
    ...formData,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
    },
  })

  console.log('hi')
  if (error || !user) {
    console.log(error)
    throw error
  }
  
  const { error: profileError } = await supabase
  .from('profiles')
  .insert({ id: user.id, username: formData.username })
  
  if (profileError) {
    console.log(error)
    throw profileError
  }
}

export function useSignUp() {
  return useMutation({
    mutationFn: signUp,
    onError: error => {
      console.log(error)
    },
  })
}
