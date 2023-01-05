import React, { useEffect, useState, useRef, FC } from 'react'
import { IGenreChart } from '../../models/types'
import { Button } from '../Button'

export const GenreChart: FC<IGenreChart> = ({ bands }) => {
  type TopGenre = {
    readonly id: number
    name: string
    count: number
  }
  const genres: TopGenre[] = []

  bands.forEach(band =>
    band.genres.forEach(genre => {
      const topGenre = genres.find(item => item.id === genre.id)
      if (!topGenre) {
        genres.push({ id: genre.id, name: genre.name, count: 1 })
      } else if (topGenre?.count) {
        topGenre.count += 1
      }
    })
  )

  const highestCount = Math.max(...genres.map(item => item.count))

  function compare(a: { count: number }, b: { count: number }) {
    let comparison = 0
    if (a.count > b.count) {
      comparison = -1
    } else if (a.count < b.count) {
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
      <div
        style={{ maxHeight: height !== 0 ? (isCollapsed ? 400 : height) : 400 }}
        className="mb-4 overflow-hidden transition-all duration-300"
      >
        <div ref={ref} className="grid gap-2">
          {genres.sort(compare).map((genre, index) => (
            <div key={index} className="grid md:grid-cols-2 items-center">
              <div className="hidden md:block">{genre.name}</div>
              <div
                className="flex items-center h-6 md:h-4 rounded bg-venom"
                style={{ width: (genre.count / highestCount) * 100 + '%' }}
              >
                <div className="md:hidden pl-2 mix-blend-difference whitespace-nowrap">
                  {genre.name}
                </div>
                <span className="flex pl-2 md:pl-1 md:text-xs mix-blend-difference">
                  {genre.count}
                </span>
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
