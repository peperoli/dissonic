'use client'

import { useState } from 'react'
import { BarChart } from '../BarChart'
import { SegmentedControl } from '../controls/SegmentedControl'
import { getUniqueObjects } from '@/lib/getUniqueObjects'
import { getFullMonth } from '@/lib/date'
import { Select } from '../forms/Select'
import { FilterButton } from '../FilterButton'
import { useLocale, useTranslations } from 'next-intl'
import supabase from '@/utils/supabase/client'
import { useQuery } from '@tanstack/react-query'

async function fetchBandsSeen(profileId?: string) {
  let countQuery = supabase.from('j_bands_seen').select('*', { count: 'estimated', head: true })

  if (profileId) {
    countQuery = countQuery.eq('user_id', profileId)
  }

  const { count } = await countQuery
  const perPage = 1000
  const maxPage = count ? Math.ceil(count / perPage) : 1
  const queries = []

  for (let page = 1; page <= maxPage; page++) {
    let query = supabase
      .from('j_bands_seen')
      .select('*, concert:concerts(id, date_start)')
      .range((page - 1) * perPage, page * perPage - 1)

    if (profileId) {
      query = query.eq('user_id', profileId)
    }

    queries.push(query)
  }

  const responses = await Promise.all(queries)

  if (responses.some(({ error }) => error)) {
    throw responses.find(({ error }) => error)
  }

  return responses.flatMap(({ data }) => data).filter(bandSeen => bandSeen !== null)
}

export const ConcertsByYear = ({ profileId }: { profileId?: string }) => {
  const { data: bandsSeen } = useQuery({
    queryKey: ['bandsSeenConcertsByYear', profileId],
    queryFn: () => fetchBandsSeen(profileId),
  })
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
