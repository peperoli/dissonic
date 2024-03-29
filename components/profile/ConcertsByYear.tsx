import { useState } from 'react'
import { Concert } from '../../types/types'
import { BarChart } from '../BarChart'
import { SegmentedControl } from '../controls/SegmentedControl'
import { useBandsSeen } from '@/hooks/bands/useBandsSeen'
import { getUniqueObjects } from '@/lib/getUniqueObjects'
import { getFullMonth } from '@/lib/getFullMonth'
import { Select } from '../forms/Select'
import { FilterButton } from '../FilterButton'

type ConcertsByYearProps = {
  userId: string
}

export const ConcertsByYear = ({ userId }: ConcertsByYearProps) => {
  const { data: bandsSeen } = useBandsSeen(userId)
  const [selectedUnit, setSelectedUnit] = useState('concerts')
  const [selectedYear, setSelectedYear] = useState<number>(-1)
  
  if (!bandsSeen || bandsSeen.length === 0) {
    return null
  }
  
  const concerts = getUniqueObjects(bandsSeen.map(band => band.concert) as Concert[])
  const start = Math.min(...concerts?.map(concert => parseInt(concert.date_start.slice(0, 4))))
  const end = Math.max(...concerts?.map(concert => parseInt(concert.date_start.slice(0, 4))))
  const years = Array.from({ length: end - start + 1 }, (_, i) => start + i)
  const months = Array.from({ length: 12 }, (_, i) => 0 + i)
  const yearItems = [
    { id: -1, name: 'Alle' },
    ...[...years].reverse().map(year => ({
      id: year,
      name: year.toString(),
    })),
  ]
  const concertsPerYear = years.map(year => ({
    name: year.toString(),
    value: concerts.filter(concert => parseInt(concert.date_start.slice(0, 4)) === year).length,
  }))
  const bandsPerYear = years.map(year => ({
    name: year.toString(),
    value:
      bandsSeen.filter(band => band.concert?.date_start.slice(0, 4) === year.toString()).length ||
      0,
  }))
  const concertsPerMonth = months.map(month => ({
    name: getFullMonth(month),
    value: concerts.filter(
      concert =>
        new Date(concert.date_start).getFullYear() === selectedYear &&
        new Date(concert.date_start).getMonth() === month
    ).length,
  }))
  const bandsPerMonth = months.map(month => ({
    name: getFullMonth(month),
    value:
      bandsSeen.filter(
        band =>
          band.concert &&
          new Date(band.concert.date_start).getFullYear() === selectedYear &&
          new Date(band.concert.date_start).getMonth() === month
      ).length || 0,
  }))

  return (
    <div className="rounded-lg bg-slate-800 p-6">
      <h2>{`${selectedUnit === 'concerts' ? 'Konzerte' : 'Bands'} pro ${selectedYear === -1 ? 'Jahr' : 'Monat'}`}</h2>
      <div className="mb-4 flex gap-3">
        <SegmentedControl
          options={[
            { value: 'concerts', label: 'Konzerte' },
            { value: 'bands', label: 'Bands' },
          ]}
          value={selectedUnit}
          onValueChange={setSelectedUnit}
        />
        <FilterButton type="singleselect" label="Jahr" items={yearItems} selectedId={selectedYear}>
          <Select
            name="Jahr"
            searchable={false}
            items={yearItems}
            value={selectedYear}
            onValueChange={setSelectedYear}
          />
        </FilterButton>
      </div>
      <BarChart
        datasets={[
          selectedUnit === 'concerts'
            ? {
                unit: ['Konzert', 'Konzerte'],
                color: 'venom',
                data: selectedYear === -1 ? concertsPerYear : concertsPerMonth,
              }
            : {
                unit: ['Band', 'Bands'],
                color: 'blue',
                data: selectedYear === -1 ? bandsPerYear : bandsPerMonth,
              },
        ]}
      />
    </div>
  )
}
