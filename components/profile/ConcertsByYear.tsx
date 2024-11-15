'use client'

import { useState } from 'react'
import { BarChart } from '../BarChart'
import { SegmentedControl } from '../controls/SegmentedControl'
import { useBandsSeen } from '@/hooks/bands/useBandsSeen'
import { getUniqueObjects } from '@/lib/getUniqueObjects'
import { getFullMonth } from '@/lib/getFullMonth'
import { Select } from '../forms/Select'
import { FilterButton } from '../FilterButton'
import { useLocale, useTranslations } from 'next-intl'

type ConcertsByYearProps = {
  profileId: string
}

export const ConcertsByYear = ({ profileId }: ConcertsByYearProps) => {
  const { data: bandsSeen } = useBandsSeen({ userId: profileId })
  const [selectedUnit, setSelectedUnit] = useState('concerts')
  const [selectedYear, setSelectedYear] = useState<number>(-1)
  const t = useTranslations('ConcertsByYear')
  const locale = useLocale()

  if (!bandsSeen || bandsSeen.length === 0) {
    return null
  }

  const concerts = getUniqueObjects(bandsSeen.map(band => band.concert))
  const start = Math.min(...concerts?.map(concert => parseInt(concert.date_start.slice(0, 4))))
  const end = Math.max(...concerts?.map(concert => parseInt(concert.date_start.slice(0, 4))))
  const years = Array.from({ length: end - start + 1 }, (_, i) => start + i)
  const months = Array.from({ length: 12 }, (_, i) => 0 + i)
  const yearItems = [
    { id: -1, name: t('allTime') },
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
    name: getFullMonth(month, locale),
    value: concerts.filter(
      concert =>
        new Date(concert.date_start).getFullYear() === selectedYear &&
        new Date(concert.date_start).getMonth() === month
    ).length,
  }))
  const bandsPerMonth = months.map(month => ({
    name: getFullMonth(month, locale),
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
      <h2>
        {t('unitPerTimeUnit', {
          unit: selectedUnit,
          timeUnit: selectedYear === -1 ? 'year' : 'month',
        })}
      </h2>
      <div className="mb-4 flex flex-wrap gap-3">
        <SegmentedControl
          options={[
            { value: 'concerts', label: t('concerts') },
            { value: 'bands', label: t('bands') },
          ]}
          value={selectedUnit}
          onValueChange={setSelectedUnit}
        />
        <FilterButton
          type="singleselect"
          label={t('timeFrame')}
          items={yearItems}
          selectedId={selectedYear}
        >
          <Select
            name="timeFrame"
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
                unit: 'nConcerts',
                color: 'venom',
                data: selectedYear === -1 ? concertsPerYear : concertsPerMonth,
              }
            : {
                unit: 'nBands',
                color: 'blue',
                data: selectedYear === -1 ? bandsPerYear : bandsPerMonth,
              },
        ]}
      />
    </div>
  )
}
