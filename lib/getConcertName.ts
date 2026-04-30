import { Concert } from '@/types/types'
import { getMediumDate } from './date'
import { Temporal } from '@js-temporal/polyfill'

export function getConcertName(concert: Concert | undefined, locale: string) {
  if (!concert) {
    return null
  }

  const date = getMediumDate(concert.date_start, locale)

  if (concert.festival_root) {
    return `${concert.festival_root.name} ${Temporal.PlainDate.from(concert.date_start).year}`
  } else if (concert.name) {
    return `${concert.name} | ${date}`
  } else {
    return `${concert.bands?.map(band => band.name).join(', ')} | ${concert.location?.name} | ${date}`
  }
}
