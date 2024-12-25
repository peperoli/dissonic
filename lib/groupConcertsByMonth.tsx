import { Concert } from "@/types/types"

export function groupConcertsByMonth(concerts: Concert[], locale: string) {
  const groupedConcerts = concerts.reduce((acc: { [key: string]: Concert[] }, concert) => {
    const month = new Date(concert.date_start).toLocaleDateString(locale, {
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
