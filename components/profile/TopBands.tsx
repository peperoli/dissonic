import { FC } from 'react'
import { ITopBands } from '../../models/types'

export const TopBands: FC<ITopBands> = ({ bands }) => {
  const topBands: { id: string; name: string; count: number }[] = []

  bands.forEach(band => {
    if (!topBands.find(item => item.id === band.id)) {
      topBands.push({ id: band.id, name: band.name, count: 1 })
    } else {
      topBands.find(item => item.id === band.id).count += 1
    }
  })

  const highestCount = Math.max(...topBands.map(item => item.count))

  function compare(a, b) {
    let comparison = 0
    if (a.count > b.count) {
      comparison = -1
    } else if (a.count < b.count) {
      comparison = 1
    }
    return comparison
  }
  return (
    <div>
      <h2 className="sr-only">Top Bands</h2>
      <div className="flex gap-4 overflow-auto">
        {topBands
          .filter(item => item.count > 1)
          .sort(compare)
          .map(item => (
            <div
              key={item.id}
              className="flex-shrink-0 w-22 overflow-hidden"
            >
              <div className="relative flex items-end h-24 mb-2">
                <div className="w-full rounded bg-venom" style={{ height: item.count / highestCount * 100 + '%' }} />
                <p className="absolute w-full pb-1 text-center mix-blend-difference">{item.count}x</p>
              </div>
              <h3 className="text-center text-ellipsis overflow-hidden">
                {item.name}
              </h3>
            </div>
          ))}
      </div>
    </div>
  )
}
