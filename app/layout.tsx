'use client'

import '../styles/globals.scss'
import { Albert_Sans } from '@next/font/google'
const albertSans = Albert_Sans({ subsets: ['latin'] })
import React, { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  },
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <html lang="de" className={`${albertSans.className}`}>
        <body className="text-slate-50 bg-slate-850">{children}</body>
      </html>
    </QueryClientProvider>
  )
}
