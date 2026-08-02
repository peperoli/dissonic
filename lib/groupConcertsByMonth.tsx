import { getYearMonth } from './date'

export function groupConcertsByMonth<T extends { date_start: string }>(
  concerts: T[],
  locale: string
) {
  const groupedConcerts = concerts.reduce((acc: { [key: string]: T[] }, concert) => {
    const month = getYearMonth(concert.date_start, locale)
    if (!acc[month]) {
      acc[month] = []
    }
    acc[month].push(concert)
    return acc
  }, {})

  return Object.entries(groupedConcerts).map(([month, concerts]) => ({ month, concerts }))
}
