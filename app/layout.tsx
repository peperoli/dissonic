import '../styles/globals.scss'
import { Albert_Sans } from '@next/font/google'
import { ReactNode } from 'react'
import { QueryProvider } from '../components/helpers/QueryProvider'
import supabase from '../utils/supabase'
const albertSans = Albert_Sans({ subsets: ['latin'] })
import Cookies from 'js-cookie'

export default function RootLayout({ children }: { children: ReactNode }) {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
      Cookies.remove('my-access-token')
      Cookies.remove('my-refresh-token')
    } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
      const maxAge = 100 * 365 * 24 * 60 * 60 // 100 years, never expires
      if (!session) return
      Cookies.set('my-access-token', session.access_token, { expires: maxAge, secure: true })
      Cookies.set('my-refresh-token', session.refresh_token, { expires: maxAge, secure: true })
    }
  })
  return (
    <QueryProvider>
      <html lang="de-CH" className={`${albertSans.className}`}>
        <body className="text-slate-50 bg-slate-850">{children}</body>
      </html>
    </QueryProvider>
  )
}
