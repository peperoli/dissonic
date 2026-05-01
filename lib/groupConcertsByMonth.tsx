import { Concert } from '@/types/types'
import { getYearMonth } from './date'

export function groupConcertsByMonth(concerts: Concert[], locale: string) {
  const groupedConcerts = concerts.reduce((acc: { [key: string]: Concert[] }, concert) => {
    const month = getYearMonth(concert.date_start, locale)
    if (!acc[month]) {
      acc[month] = []
    }
    acc[month].push(concert)
    return acc
  }, {})

  return Object.entries(groupedConcerts).map(([month, concerts]) => ({ month, concerts }))
}
