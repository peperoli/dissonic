'use server'

import { Provider } from '@supabase/supabase-js'
import { createClient } from '../utils/supabase/server'
import { redirect } from 'next/navigation'

export type SignInFormData = {
  email: string
  password: string
}

export async function signIn(formData: SignInFormData) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword(formData)

  if (error) {
    throw error
  }
}

export type SignUpFormData = SignInFormData & {
  username: string
}

export async function signUp(formData: SignUpFormData) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    ...formData,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
    },
  })

  if (error) {
    throw error
  }

  if (!data.user) {
    throw new Error('Error: No user returned')
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .insert({ id: data.user.id, username: formData.username })

  if (profileError) {
    throw profileError
  }
}

export async function signInWithOAuth(provider: Provider) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
    },
  })

  if (error) {
    throw error
  }

  redirect(data.url)
}
