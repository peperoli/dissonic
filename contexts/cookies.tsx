'use client'

import { createContext, useContext } from 'react'

export const CookiesContext = createContext<{ lineupHintPreference: string | undefined } | null>(null)

export function CookiesProvider({
  children,
  cookies,
}: {
  children: React.ReactNode
  cookies: { lineupHintPreference: string | undefined }
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
