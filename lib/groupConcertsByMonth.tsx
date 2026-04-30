import { Concert } from '@/types/types'
import { Temporal } from '@js-temporal/polyfill'

export function groupConcertsByMonth(concerts: Concert[], locale: string) {
  const groupedConcerts = concerts.reduce((acc: { [key: string]: Concert[] }, concert) => {
    const month = Temporal.PlainDate.from(concert.date_start).toLocaleString(locale, {
      month: 'long',
      year: 'numeric',
    })
    if (!acc[month]) {
      acc[month] = []
    }
    acc[month].push(concert)
    return acc
  }, {})
  return Object.entries(groupedConcerts).map(([month, concerts]) => ({ month, concerts }))
}
