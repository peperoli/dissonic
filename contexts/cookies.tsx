'use client'

import { createContext, useContext } from 'react'

export const CookiesContext = createContext<{
  concertsUserView: string | null
  concertsRange: string | null
} | null>(null)

export function CookiesProvider({
  children,
  cookies,
}: {
  children: React.ReactNode
  cookies: { concertsUserView: string | null; concertsRange: string | null }
}) {
  return <CookiesContext.Provider value={cookies}>{children}</CookiesContext.Provider>
}

export function useCookies() {
  const context = useContext(CookiesContext)
  if (!context) {
    throw new Error('Only use inside CookiesContext.')
  }
  return context
}
