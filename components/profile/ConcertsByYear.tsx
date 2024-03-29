import { useState } from 'react'
import { Concert } from '../../types/types'
import { BarChart } from '../BarChart'
import { SegmentedControl } from '../controls/SegmentedControl'
import { useBandsSeen } from '@/hooks/bands/useBandsSeen'
import { getUniqueObjects } from '@/lib/getUniqueObjects'

type ConcertsByYearProps = {
  userId: string
}

export const ConcertsByYear = ({ userId }: ConcertsByYearProps) => {
  const { data: bandsSeen } = useBandsSeen(userId)
  const [selected, setSelected] = useState('concerts')
  const concerts = getUniqueObjects(bandsSeen?.map(band => band.concert) as Concert[])

  if (!concerts) {
    return null
  }

  const start = Math.min(...concerts?.map(concert => parseInt(concert.date_start.slice(0, 4))))
  const end = Math.max(...concerts?.map(concert => parseInt(concert.date_start.slice(0, 4))))
  const years = Array.from({ length: end - start + 1 }, (_, i) => start + i)
  const concertsPerYear = years.map(year => ({
    name: year.toString(),
    value: concerts?.filter(concert => parseInt(concert.date_start.slice(0, 4)) === year)
      .length,
  }))
  const bandsPerYear = years.map(year => ({
    name: year.toString(),
    value:
      bandsSeen?.filter(band => band.concert?.date_start.slice(0, 4) === year.toString()).length ||
      0,
  }))
  return (
    <div>
      <h2>Konzerte pro Jahr</h2>
      <SegmentedControl
        options={[
          { value: 'concerts', label: 'Konzerte' },
          { value: 'bands', label: 'Bands' },
        ]}
        value={selected}
        onValueChange={setSelected}
      />
      <BarChart
        datasets={[
          selected === 'concerts'
            ? {
                unit: ['Konzert', 'Konzerte'],
                color: 'venom',
                data: concertsPerYear,
              }
            : {
                unit: ['Band', 'Bande'],
                color: 'blue',
                data: bandsPerYear,
              },
        ]}
      />
    </div>
  )
}
