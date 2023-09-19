import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export function useUpdateSearchParams() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { push } = useRouter()

  function updateSearchParams(name: string, value: string | number) {
    const current = new URLSearchParams(Array.from(searchParams.entries())) // -> has to use this form
    // update as necessary
    if (!value) {
      current.delete(name)
    } else {
      current.set(name, String(value))
    }

    // cast to string
    const search = current.toString()
    const query = search ? `?${search}` : ''

    push(`${pathname}${query}`, { scroll: false })
  }

  return updateSearchParams
}
