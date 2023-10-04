import clsx from 'clsx'
import { useEffect, useState, useRef } from 'react'
import { Band, Profile } from '../../types/types'
import { Button } from '../Button'

type GenreChartProps = {
  bands: Band[]
  uniqueBands?: Band[]
  profile?: Profile | null
}

export const GenreChart = ({ bands, uniqueBands, profile }: GenreChartProps) => {
  type TopGenre = {
    readonly id: number
    name: string
    count: number
    uniqueCount: number
  }
  const genres: TopGenre[] = []

  bands.forEach(band =>
    band.genres?.forEach(genre => {
      const topGenre = genres.find(item => item.id === genre.id)
      if (!topGenre) {
        genres.push({ id: genre.id, name: genre.name, count: 1, uniqueCount: 0 })
      } else if (topGenre?.count) {
        topGenre.count += 1
      }
    })
  )

  uniqueBands?.forEach(band =>
    band.genres?.forEach(genre => {
      const topGenre = genres.find(item => item.id === genre.id)
      if (topGenre) {
        topGenre.uniqueCount += 1
      }
    })
  )

  const highestCount = Math.max(...genres.map(item => item.count))

  function compare(a: TopGenre, b: TopGenre) {
    let comparison = 0
    if (uniqueBands ? a.uniqueCount > b.uniqueCount : a.count > b.count) {
      comparison = -1
    } else if (uniqueBands ? a.uniqueCount < b.uniqueCount : a.count < b.count) {
      comparison = 1
    }
    return comparison
  }

  const ref = useRef<HTMLDivElement>(null)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const height: number = ref.current ? ref.current.offsetHeight : 0

  useEffect(() => {
    if (height > 400) {
      setIsCollapsed(true)
    }
  }, [height])
  return (
    <section>
      <h2>Genres</h2>
      {uniqueBands && (
        <p>
          {profile ? `${profile.username}s` : 'Dein'} Top-Genre ist {genres.sort(compare)[0].name} mit{' '}
          {genres.sort(compare)[0].uniqueCount} verschiedenen Bands.
        </p>
      )}
      {uniqueBands && uniqueBands?.length > bands.length && (
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-1 rounded-full bg-venom" />
            <span className="text-sm text-slate-300">verschieden</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-1 rounded-full bg-slate-600" />
            <span className="text-sm text-slate-300">total</span>
          </div>
        </div>
      )}
      <div
        style={{ maxHeight: height !== 0 ? (isCollapsed ? 400 : height) : 400 }}
        className="my-4 overflow-hidden transition-all duration-300"
      >
        <div ref={ref} className="grid gap-2">
          {genres.sort(compare).map(genre => (
            <div key={genre.id} className="grid md:grid-cols-2 items-center">
              <div className="hidden md:block">{genre.name}</div>
              <div className="relative flex items-center mr-6">
                <div
                  className={clsx("absolute group h-6 md:h-4 rounded", uniqueBands ? 'bg-slate-600' : 'bg-venom')}
                  style={{ width: (genre.count / highestCount) * 100 + '%' }}
                >
                  <div className={clsx("absolute -right-1 translate-x-full md:text-xs invisible group-hover:visible", uniqueBands && 'text-slate-300')}>
                    {genre.count}
                  </div>
                </div>
                {uniqueBands && (
                  <div
                    className="absolute group h-6 md:h-4 rounded bg-venom"
                    style={{ width: (genre.uniqueCount / highestCount) * 100 + '%' }}
                  >
                    <div className="absolute -right-1 translate-x-full md:text-xs invisible group-hover:visible">
                      {genre.uniqueCount}
                    </div>
                  </div>
                )}
                <div className="md:hidden pl-2 whitespace-nowrap mix-blend-difference">
                  {genre.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {isCollapsed && <Button onClick={() => setIsCollapsed(false)} label="Mehr anzeigen" />}
      {!isCollapsed && height > 400 && (
        <Button onClick={() => setIsCollapsed(true)} label="Weniger anzeigen" />
      )}
    </section>
  )
}
