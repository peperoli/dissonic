import { useState } from 'react'
import { Concert } from '../../types/types'
import clsx from 'clsx'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

export interface ConcertsByMonthProps {
  concerts: Concert[]
}

export const ConcertsByMonth = ({ concerts }: ConcertsByMonthProps) => {
  const years = new Set(
    concerts.map(concert => new Date(concert.date_start).getFullYear()).sort((a, b) => b - a)
  )
  const [selectedYear, setSelectedYear] = useState(Math.max(...years))
  const months: { month: number; count: number }[] = []

  concerts
    .filter(concert => new Date(concert.date_start).getFullYear() === selectedYear)
    .forEach(concert => {
      const month = new Date(concert.date_start).getMonth()
      const match = months.find(item => item.month === month)
      if (!match) {
        months.push({ month, count: 1 })
      } else if (match?.count) {
        match.count += 1
      }
    })

  const highestCount = Math.max(...months.map(item => item.count))
  return (
    <div>
      <h2 className="flex items-center gap-2">
        Konzerte im Jahr
        <div className="relative flex items-center">
          <select
            value={selectedYear}
            onChange={event => setSelectedYear(Number(event.target.value))}
            className="appearance-none pl-2 pr-8 py-1 rounded-md bg-slate-750"
          >
            {Array.from(years).map(year => (
              <option key={year}>{year}</option>
            ))}
          </select>
          <ChevronDownIcon className="absolute right-2 text-xs h-icon pointer-events-none" />
        </div>
      </h2>
      <div className="flex gap-4 -mx-6 px-6 overflow-auto scrollbar-hidden">
        {Array.from(Array(12).keys()).map(item => {
          const matchingMonth = months.find(month => month.month === item)
          return (
            <div key={item} className="flex-1 flex flex-col items-center">
              <div className="relative flex justify-center items-end h-24 mb-2">
                <div
                  className={clsx(
                    'w-6 md:w-8 rounded bg-venom-600',
                    (!matchingMonth || matchingMonth.count === 0) && 'border-b-2 border-slate-300'
                  )}
                  style={{
                    height: matchingMonth ? (matchingMonth.count / highestCount) * 100 + '%' : 0,
                  }}
                />
                <p className="absolute w-full pb-1 text-center font-bold">{matchingMonth?.count}</p>
              </div>
              <p className="text-vertical text-center text-sm">
                {new Date(`1970-${item + 1}-01`).toLocaleDateString('de-CH', { month: 'long' })}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
