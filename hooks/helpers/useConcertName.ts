import { Tables } from '@/types/supabase'
import { useLocale } from 'next-intl'

export function useConcertName(
  concert:
  | (Tables<'concerts'> & {
    festival_root?: { name: string } | null
    bands?: Tables<'bands'>[] | null
    location?: Tables<'locations'> | null
  })
  | undefined
) {
  const locale = useLocale()
  
  if (!concert) {
    return null
  }
  
  const date = new Date(concert.date_start).toLocaleDateString(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  if (concert.festival_root) {
    return `${concert.festival_root.name} ${new Date(concert.date_start).getFullYear()}`
  } else if (concert.name) {
    return `${concert.name} | ${date}`
  } else {
    return `${concert.bands?.map(band => band.name).join(', ')} | ${concert.location?.name} | ${date}`
  }
}
