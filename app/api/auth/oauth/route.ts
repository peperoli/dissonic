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
    return NextResponse.json({ error: 'Invalid provider' }, { status: 400 })
  }

  const callbackUrl = new URL('/api/auth/callback', origin)
  callbackUrl.searchParams.set('next', next)

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: callbackUrl.toString(),
      scopes: provider === 'google' ? 'https://www.googleapis.com/auth/userinfo.email' : 'email',
    },
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  if (!data.url) {
    return NextResponse.json({ error: 'Missing OAuth redirect URL' }, { status: 500 })
  }

  return NextResponse.redirect(data.url)
}
