import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

function sanitizeNext(nextParam: string | null): string {
  if (!nextParam) return '/'
  // allow only same-origin paths like "/foo", not "//foo" or "http://..."
  return /^\/(?!\/)/.test(nextParam) ? nextParam : '/'
}

function slugUsername(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_') // spaces -> underscore
    .replace(/[^a-z0-9_]/g, '') // strip unsafe chars
    .slice(0, 32) // optional length limit
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = sanitizeNext(searchParams.get('next'))
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  if (error) {
    return NextResponse.redirect(
      `${origin}/api/auth/callback-error?${new URLSearchParams({
        error,
        error_description: errorDescription ?? '',
      }).toString()}`
    )
  }

  if (!code) {
    return NextResponse.redirect(
      `${origin}/api/auth/callback-error?${new URLSearchParams({
        error: 'No code provided in auth callback.',
      }).toString()}`
    )
  }

  const supabase = await createClient()

  const {
    data: { user },
    error: sessionError,
  } = await supabase.auth.exchangeCodeForSession(code)

  if (sessionError) {
    return NextResponse.redirect(
      `${origin}/api/auth/callback-error?${new URLSearchParams({
        error: 'Failed to exchange code for session.',
        error_description: sessionError.message,
      }).toString()}`
    )
  }

  if (user) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    if (profileError) {
      return NextResponse.redirect(
        `${origin}/api/auth/callback-error?${new URLSearchParams({
          error: 'Failed to lookup user profile.',
          error_description: profileError.message,
        }).toString()}`
      )
    }

    if (!profile) {
      // create a new profile for the user if it doesn't exist already
      const { error: insertProfileError } = await supabase.from('profiles').insert({
        id: user.id,
        username: user.user_metadata.full_name
          ? encodeURIComponent(slugUsername(user.user_metadata.full_name))
          : new Date().getTime().toString(),
      })

      if (insertProfileError) {
        return NextResponse.redirect(
          `${origin}/api/auth/callback-error?${new URLSearchParams({
            error: 'Failed to create user profile.',
            error_description: insertProfileError.message,
          }).toString()}`
        )
      }
    }
  }

  const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
  const isDevEnv = process.env.NODE_ENV === 'development'

  if (isDevEnv) {
    // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
    return NextResponse.redirect(`${origin}${next}`)
  } else if (forwardedHost) {
    return NextResponse.redirect(`https://${forwardedHost}${next}`, {
      headers: request.headers,
    })
  } else {
    return NextResponse.redirect(`${origin}${next}`, {
      headers: request.headers,
    })
  }
}
