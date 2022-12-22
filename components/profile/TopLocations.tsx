import React from 'react'
import { FC } from 'react'
import { ITopLocations } from '../../models/types'

export const TopLocations: FC<ITopLocations> = ({ locations = [] }) => {
  type TopLocation = {
    id: string
    name: string
    count: number
  }
  const topLocations: TopLocation[] = []

  locations.forEach(location => {
    let TopLocation = topLocations.find(item => item.id === location.id)
    if (!TopLocation) {
      topLocations.push({ id: location.id, name: location.name, count: 1 })
    } else if (TopLocation?.count) {
      TopLocation.count += 1
    }
  })

  const highestCount = Math.max(...topLocations.map(item => item.count))

  function compare(a: { count: number }, b: { count: number }): number {
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
      <h2>Top Locations</h2>
      <div className="flex gap-4 overflow-auto">
        {topLocations
          .filter(item => item.count > 1)
          .sort(compare)
          .map(item => (
            <div key={item.id} className="flex-shrink-0 w-22 overflow-hidden">
              <div className="relative flex items-end h-24 mb-2">
                <div
                  className="w-full rounded bg-venom"
                  style={{ height: (item.count / highestCount) * 100 + '%' }}
                />
                <p className="absolute w-full pb-1 text-center mix-blend-difference">
                  {item.count}x
                </p>
              </div>
              <h3 className="text-center text-ellipsis overflow-hidden">{item.name}</h3>
            </div>
          ))}
      </div>
    </div>
  )
}
