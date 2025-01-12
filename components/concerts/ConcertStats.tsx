import { getCounts } from '@/lib/getCounts'
import { Band } from '@/types/types'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import clsx from 'clsx'
import { useState } from 'react'
import { Button } from '../Button'
import { Chip } from '../Chip'
import { ToggleSwitch } from '../forms/ToggleSwitch'
import { useLocale, useTranslations } from 'next-intl'

type BarProps = {
  item: {
    id: number
    name: string
    count: number
  }
  highestCount: number
  bgColor?: 'venom' | 'blue'
}

const Bar = ({ item, highestCount, bgColor = 'venom' }: BarProps) => {
  return (
    <li key={item.id} className="group grid w-full grid-cols-2 items-center gap-2">
      <div className="truncate leading-tight">{item.name}</div>
      <div
        className={clsx(
          'h-5 rounded-r',
          bgColor === 'venom' && 'bg-venom',
          bgColor === 'blue' && 'bg-blue'
        )}
        style={{ width: (item.count / highestCount) * 100 + '%' }}
      >
        <div className="ml-1 text-sm text-slate-850">{item.count}</div>
      </div>
    </li>
  )
}

type ConcertStatsProps = {
  bands: Band[]
  uniqueBands?: Band[]
}

export const ConcertStats = ({ bands, uniqueBands }: ConcertStatsProps) => {
  const [showAll, setShowAll] = useState(false)
  const [visibleItems, setVisibleItems] = useState(10)
  const [animationParent] = useAutoAnimate()
  const t = useTranslations('ConcertStats')
  const locale = useLocale()
  const hasUniqueBands =
    uniqueBands && uniqueBands.length > 0 && uniqueBands.length !== bands.length
  const genres =
    hasUniqueBands && !showAll
      ? uniqueBands.map(band => band.genres).flat()
      : bands.map(band => band.genres).flat(1)
  const countries =
    hasUniqueBands && !showAll
      ? uniqueBands.map(band => band.country).filter(country => !!country)
      : bands.map(band => band.country).filter(country => !!country)
  const regionNames = new Intl.DisplayNames(locale, { type: 'region' })
  const genreCounts = getCounts(genres).sort((a, b) => b.count - a.count)
  const countryCounts = getCounts(
    countries.map(country => ({
      name: regionNames.of(country.iso2) || country.iso2,
      ...country,
    }))
  ).sort((a, b) => b.count - a.count)

  if (bands.length === 0) {
    return null
  }

  return (
    <section className="rounded-lg bg-slate-800 p-4 md:p-6">
      <h2>{t('genresAndCountries')}</h2>
      {hasUniqueBands && (
        <div className="mb-5">
          <ToggleSwitch
            label={t('includeRepeatedlySeenBands')}
            checked={showAll}
            onChange={setShowAll}
          />
        </div>
      )}
      <div className="grid items-start gap-5 md:grid-cols-2 md:gap-6">
        <ul ref={animationParent} className="flex flex-wrap gap-2">
          {genreCounts.slice(0, visibleItems).map(item => {
            if (genreCounts.length >= 3) {
              return <Bar item={item} highestCount={genreCounts[0].count} key={item.id} />
            }
            return <Chip key={item.id} label={item.name} count={item.count} />
          })}
        </ul>
        <ul className="flex flex-wrap gap-2">
          {countryCounts.slice(0, visibleItems).map(item => {
            if (countryCounts.length >= 3) {
              return (
                <Bar
                  item={item}
                  highestCount={countryCounts[0].count}
                  bgColor="blue"
                  key={item.id}
                />
              )
            }
            return <Chip key={item.id} label={item.name} count={item.count} />
          })}
        </ul>
      </div>
      {(genreCounts.length > 10 || countryCounts.length > 10) && (
        <div className="mt-5 flex justify-center">
          {visibleItems === 10 ? (
            <Button
              onClick={() => setVisibleItems(Math.max(genreCounts.length, countryCounts.length))}
              label={t('showAll')}
            />
          ) : (
            <Button onClick={() => setVisibleItems(10)} label={t('showLess')} />
          )}
        </div>
      )}
    </section>
  )
}
