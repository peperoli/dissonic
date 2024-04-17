import { ModalProvider } from '@/components/helpers/ModalProvider'
import { TooltipProvider } from '@/components/helpers/TooltipProvider'
import { UserProvider } from '@/components/helpers/UserProvider'
import { createClient } from '@/utils/supabase/server'
import { Metadata, Viewport } from 'next'
import { Albert_Sans } from 'next/font/google'
import { cookies } from 'next/headers'
import { ReactNode } from 'react'
import { QueryProvider } from '../components/helpers/QueryProvider'
import '../styles/globals.scss'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Dissonic',
  description: 'Hier leben deine Konzerte und Festivals.',
  metadataBase: new URL('https://dissonic.ch'),
  applicationName: 'Dissonic',
  manifest: '/manifest.json',
  appleWebApp: {
    title: 'Dissonic',
    statusBarStyle: 'default',
  },
  icons: {
    icon: [
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/favicon/apple-touch-icon.png',
    other: [{ rel: 'mask-icon', url: '/favicon/safari-pinned-tab.svg', color: '#1f282e' }],
  },
}

export const viewport: Viewport = {
  themeColor: '#1f282e',
}

const albertSans = Albert_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-albert-sans',
})

async function fetchUser() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    throw error
  }

  return user
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const user = await fetchUser()
  return (
    <QueryProvider>
      <TooltipProvider>
        <UserProvider value={user}>
          <html lang="de-CH" className={`${albertSans.variable}`}>
            <body className="bg-slate-850 text-slate-50">{children}</body>
          </html>
        </UserProvider>
        <ModalProvider />
      </TooltipProvider>
    </QueryProvider>
  )
}
