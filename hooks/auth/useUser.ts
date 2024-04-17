import { UserContext } from "@/components/helpers/UserProvider"
import { useContext } from "react"

export function useUser() {
  const context = useContext(UserContext)

  return context
}