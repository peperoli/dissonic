import { Concert } from '@/types/types'
import { getMediumDate } from './date'

export function getConcertName(concert: Concert | undefined, locale: string) {
  if (!concert) {
    return null
  }

  const date = getMediumDate(concert.date_start, locale)

  if (concert.festival_root) {
    return `${concert.festival_root.name} ${new Date(concert.date_start).getFullYear()}`
  } else if (concert.name) {
    return `${concert.name} | ${date}`
  } else {
    return `${concert.bands?.map(band => band.name).join(', ')} | ${concert.location?.name} | ${date}`
  }
}
