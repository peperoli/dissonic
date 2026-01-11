'use server'

import { Provider, UserIdentity } from '@supabase/supabase-js'
import { createClient } from '../utils/supabase/server'
import { redirect } from 'next/navigation'

export async function signInWithOAuth(provider: Provider, next: string | null) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback?next=${next ?? '/'}`,
      scopes: provider === 'azure' ? 'email' : undefined,
    },
  })

  if (error) {
    throw error
  }

  redirect(data.url)
}

export async function linkIdentity(provider: Provider) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.linkIdentity({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback?next=/settings#oauth`,
    },
  })

  if (error) {
    throw error
  }

  redirect(data.url)
}

export async function unlinkIdentity(identity: UserIdentity) {
  const supabase = await createClient()

  const { error } = await supabase.auth.unlinkIdentity(identity)

  if (error) {
    throw error
  }
}

export async function resendConfirmationEmail(formData: { email: string }) {
  const supabase = await createClient()

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: formData.email,
  })
  if (error) {
    throw error
  }
}
