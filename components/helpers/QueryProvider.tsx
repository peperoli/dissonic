'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactElement } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  },
})

export function QueryProvider({ children }: { children: ReactElement }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
