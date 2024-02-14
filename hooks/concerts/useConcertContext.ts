import { createContext, useContext } from "react"
import { Concert } from "@/types/types"

export const ConcertContext = createContext<{concert: Concert} | null>(null)

export function useConcertContext() {
  const context = useContext(ConcertContext)
  if (!context) {
    throw new Error('Only use inside ConcertContext.')
  }
  return context
}