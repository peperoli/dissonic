import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'

import { createClient } from '../../../utils/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  const redirectTo = request.nextUrl.clone()
  redirectTo.pathname = next
  redirectTo.searchParams.delete('token_hash')
  redirectTo.searchParams.delete('type')

  if (!token_hash || !type) {
    return NextResponse.redirect(
      `${baseUrl}/api/auth/error?${new URLSearchParams({
        error: 'Missing token_hash or type',
      }).toString()}`
    )
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.verifyOtp({
    type,
    token_hash,
  })

  if (error) {
    console.error(error)
    return NextResponse.redirect(
      `${baseUrl}/api/auth/error?${new URLSearchParams({
        error: error.message,
      }).toString()}`
    )
  }

  redirectTo.searchParams.delete('next')
  return NextResponse.redirect(redirectTo)
}
