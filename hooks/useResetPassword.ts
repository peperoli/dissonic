import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useMutation } from '@tanstack/react-query'

async function resetPassword(email: string) {
  const supabase = createClientComponentClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/update-password`,
  })

  if (error) {
    throw error
  }
}

export function useResetPassword() {
  return useMutation(resetPassword, { onError: error => console.error(error) })
}
