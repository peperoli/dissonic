import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useMutation } from '@tanstack/react-query'

async function signUp(formData: { email: string; username: string; password: string }) {
  const supabase = createClientComponentClient()

  const { data, error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
    },
  })

  if (error) {
    throw error
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .insert({ id: data.user?.id, username: formData.username })

  if (profileError) {
    throw profileError
  }

  return data
}

export function useSignUp() {
  return useMutation(signUp, {
    onError: error => console.error(error),
  })
}
