import { Band, Genre, Country } from '@/types/types'
import clsx from 'clsx'
import { Chip } from '../Chip'

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
        <div className='ml-1 text-sm text-slate-850'>{item.count}</div>
      </div>
    </li>
  )
}

type ConcertStatsProps = {
  bands: Band[]
}

export const ConcertStats = ({ bands }: ConcertStatsProps) => {
  const genres = bands.map(band => band.genres).flat(1)
  const countries = bands.map(band => band.country as Country)
  const regionNames = new Intl.DisplayNames('de', { type: 'region' })

  function getCounts(items: Genre[] | Country[]) {
    const itemCounts: { id: number; name: string; count: number }[] = []
    items.forEach(item => {
      const matchingItem = itemCounts.find(itemCount => itemCount.id === item.id)
      if (!matchingItem) {
        itemCounts.push({
          id: item.id,
          name: 'name' in item ? item.name : regionNames.of(item.iso2) || item.iso2,
          count: 1,
        })
      } else if (matchingItem?.count) {
        matchingItem.count += 1
      }
    })

    return itemCounts
  }

  const genreCounts = getCounts(genres).sort((a, b) => b.count - a.count).slice(0, 10)
  const countryCounts = getCounts(countries).sort((a, b) => b.count - a.count).slice(0, 10)
  return (
    <section className="rounded-lg bg-slate-800 p-4 md:p-6">
      <h2>Details</h2>
      <div className="grid grid-cols-2 gap-4 md:gap-6">
        <div>
          <h3>Genres</h3>
          <ul className="flex flex-wrap gap-2">
            {genreCounts.map(item => {
              if (genreCounts.length >= 3) {
                return <Bar item={item} highestCount={genreCounts[0].count} key={item.id} />
              }
              return <Chip key={item.id} label={item.name} count={item.count} />
            })}
          </ul>
        </div>
        <div>
          <h3>Länder</h3>
          <ul className="flex flex-wrap gap-2">
            {countryCounts.map(item => {
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
      </div>
    </section>
  )
}
