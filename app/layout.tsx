import { Albert_Sans } from 'next/font/google'
import { ReactNode } from 'react'
import { QueryProvider } from '../components/helpers/QueryProvider'
import '../styles/globals.scss'
const albertSans = Albert_Sans({ subsets: ['latin'] })

export const dynamic = 'force-dynamic'

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <html lang="de-CH" className={`${albertSans.className}`}>
        <body className="text-slate-50 bg-slate-850">{children}</body>
      </html>
    </QueryProvider>
  )
}
