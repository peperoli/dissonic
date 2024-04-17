'use client'

type UserContextProviderProps = {
  children: ReactNode
  value: User | null
}

import { User } from '@supabase/supabase-js'
import { createContext, ReactNode } from 'react'

export const UserContext = createContext<User | null>(null)

export function UserProvider({ children, value }: UserContextProviderProps) {
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
