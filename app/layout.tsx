import { Footer } from '@/components/layout/Footer'
import { NavBar } from '@/components/layout/NavBar'
import { Navigation } from '@/components/layout/Navigation'
import { ModalProvider } from '@/components/shared/ModalProvider'
import { Metadata, Viewport } from 'next'
import { Albert_Sans, Fira_Code } from 'next/font/google'
import { ReactNode, Suspense } from 'react'
import { QueryProvider } from '../components/helpers/QueryProvider'
import { Analytics } from '@vercel/analytics/next'
import '../styles/globals.css'
import { getLocale, getMessages, getTranslations } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'
import { Toaster } from 'react-hot-toast'
import resolveConfig from 'tailwindcss/resolveConfig'
import { content, theme } from '../tailwind.config'
import { AlertCircleIcon, CheckCircleIcon } from 'lucide-react'
import * as Tooltip from '@radix-ui/react-tooltip'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('RootLayout')
  return {
    title: t('title'),
    description: t('description'),
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
    openGraph: {
      images: [{ url: '/og.jpg' }],
    },
  }
}

export const viewport: Viewport = {
  themeColor: '#1f282e',
  interactiveWidget: 'resizes-content',
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
  const locale = await getLocale()
  const messages = await getMessages()
  const fullConfig = resolveConfig({ content, theme })

  return (
    <html lang={locale} className={`${albertSans.variable} ${firaCode.variable}`}>
      <body className="flex min-h-screen flex-col bg-slate-850 text-white">
        <QueryProvider>
          <NextIntlClientProvider messages={messages}>
            <Tooltip.Provider delayDuration={200}>
              <NavBar />
              <div className="md:flex">
                <Navigation />
                {children}
              </div>
              <Footer />
              <Suspense>
                <ModalProvider />
              </Suspense>
            </Tooltip.Provider>
            <Toaster
              toastOptions={{
                duration: 5000,
                style: {
                  background: fullConfig.theme.colors.slate['900'],
                  color: fullConfig.theme.colors.white,
                },
                success: {
                  icon: <CheckCircleIcon className="size-icon text-venom" />,
                },
                error: {
                  icon: <AlertCircleIcon className="size-icon text-red" />,
                },
              }}
            />
          </NextIntlClientProvider>
        </QueryProvider>
        <Analytics />
      </body>
    </html>
  )
}
