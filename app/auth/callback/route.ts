import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const supabase = createRouteHandlerClient({ cookies })
  
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      throw error
    }
  }

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_BASE_URL}/` ?? requestUrl.origin
  )
}
