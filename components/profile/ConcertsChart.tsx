import React, { FC } from 'react'
import { IConcertsChart } from '../../models/types'

export const ConcertsChart: FC<IConcertsChart> = ({ concerts }) => {
  const years: { year: number; count: number }[] = []

  concerts.forEach(concert => {
    let year = years.find(item => item.year === Number(concert.date_start.slice(0, 4)))
    if (!year) {
      years.push({ year: Number(concert.date_start.slice(0, 4)), count: 1 })
    } else if (year?.count) {
      year.count += 1
    }
  })

  const highestCount = Math.max(...years.map(item => item.count))

  function compare(a: { year: number }, b: { year: number }): number {
    if (a.year > b.year) {
      return 1
    } else if (a.year < b.year) {
      return -1
    }
    return 0
  }
  return (
    <div>
      <h2>Besuchte Konzerte</h2>
      <div className="flex gap-4">
        {years.sort(compare).map(item => (
          <div key={item.year} className="flex-1 overflow-hidden">
            <div className="relative flex justify-center items-end h-24 mb-2">
              <div
                className="w-8 rounded bg-venom"
                style={{ height: (item.count / highestCount) * 100 + '%' }}
              />
              <p className="absolute w-full pb-1 text-center mix-blend-difference">{item.count}</p>
            </div>
            <p className="text-center text-ellipsis overflow-hidden">{item.year}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
