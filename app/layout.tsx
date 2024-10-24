import { Footer } from '@/components/layout/Footer'
import { NavBar } from '@/components/layout/NavBar'
import { Navigation } from '@/components/layout/Navigation'
import { ModalProvider } from '@/components/shared/ModalProvider'
import { TooltipProvider } from '@/components/shared/TooltipProvider'
import { Metadata, Viewport } from 'next'
import { Albert_Sans, Fira_Code } from 'next/font/google'
import { ReactNode, Suspense } from 'react'
import { QueryProvider } from '../components/helpers/QueryProvider'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import '../styles/globals.scss'

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

const firaCode = Fira_Code({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fira-code',
})

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <TooltipProvider>
        <html lang="de-CH" className={`${albertSans.variable} ${firaCode.variable}`}>
          <body className="flex min-h-screen flex-col bg-slate-850 text-white">
            <NavBar />
            <div className="md:flex">
              <Navigation />
              {children}
            </div>
            <Footer />
            <Analytics />
            <SpeedInsights />
          </body>
        </html>
        <Suspense>
          <ModalProvider />
        </Suspense>
      </TooltipProvider>
    </QueryProvider>
  )
}
