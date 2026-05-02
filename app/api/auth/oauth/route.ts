import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

function sanitizeNext(nextParam: string | null): string {
  if (!nextParam) return '/'
  return /^\/(?!\/)/.test(nextParam) ? nextParam : '/'
}

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams, origin } = new URL(request.url)
  const provider = searchParams.get('provider')
  const next = sanitizeNext(searchParams.get('next'))

  if (provider !== 'azure' && provider !== 'google') {
    return NextResponse.redirect(
      `${origin}/api/auth/callback-error?${new URLSearchParams({
        error: 'Unsupported provider',
      }).toString()}`
    )
  }

  const callbackUrl = new URL('/api/auth/callback', origin)
  callbackUrl.searchParams.set('next', next)
  console.log('Callback URL:', callbackUrl.toString())

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: callbackUrl.toString(),
      scopes: provider === 'google' ? 'https://www.googleapis.com/auth/userinfo.email' : 'email',
    },
  })

  if (error) {
    console.error(error)
    return NextResponse.redirect(
      `${origin}/api/auth/callback-error?${new URLSearchParams({
        error: 'Failed to initiate OAuth sign-in.',
      }).toString()}`
    )
  }

  if (!data.url) {
    return NextResponse.redirect(
      `${origin}/api/auth/callback-error?${new URLSearchParams({
        error: 'Failed to initiate OAuth sign-in.',
      }).toString()}`
    )
  }

  return NextResponse.redirect(data.url, {
    headers: request.headers,
  })
}
