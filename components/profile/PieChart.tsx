import clsx from 'clsx'
import { Tooltip } from '../shared/Tooltip'

const RADIUS = 100

const fillColors = ['fill-venom', 'fill-blue', 'fill-purple']
const bgColors = ['bg-venom', 'bg-blue', 'bg-purple']

type SectorProps = {
  name: string
  value: number
  percentage: number
  angle: number
  index: number
  totalAngle: number
}

const Sector = ({ name, value, percentage, angle, index, totalAngle }: SectorProps) => {
  function polarToCartesian(
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
  ) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0

    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    }
  }

  function describeSector(
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number
  ) {
    const start = polarToCartesian(x, y, radius, endAngle)
    const end = polarToCartesian(x, y, radius, startAngle)

    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'

    const d = [
      ['M', radius, radius],
      ['L', start.x, start.y],
      ['A', radius, radius, 0, largeArcFlag, 0, end.x, end.y],
      'Z',
    ]

    return d.flat().join(' ')
  }

  const d = describeSector(RADIUS, RADIUS, RADIUS, totalAngle, angle + totalAngle)
  const tooltipContent = (
    <>
      <div className="font-bold">
        {value} {name}
      </div>
      {percentage}%
    </>
  )

  if (angle === 0) {
    return null
  }

  if (angle === 360) {
    return (
      <Tooltip content={tooltipContent}>
        <circle cx={RADIUS} cy={RADIUS} r={RADIUS} className={fillColors[index]} />
      </Tooltip>
    )
  }

  return (
    <Tooltip content={tooltipContent}>
      <path d={d} className={fillColors[index]} />
    </Tooltip>
  )
}

type PieChartProps = {
  data: { name: string; value: number }[]
}

export const PieChart = ({ data }: PieChartProps) => {
  const sum = data.map(item => item.value).reduce((acc, value) => acc + value, 0)
  let totalAngle = 0

  return (
    <div className="grid grid-cols-3 items-center gap-4">
      <svg viewBox={`0 0 ${RADIUS * 2} ${RADIUS * 2}`}>
        {data
          .sort((a, b) => b.value - a.value)
          .map((item, index) => {
            const angle = (item.value / sum) * 360
            const percentage = Math.round((item.value / sum) * 100)
            const props = {
              ...item,
              percentage,
              angle,
              index,
              totalAngle,
            }
            totalAngle += angle

            return <Sector {...props} key={index} />
          })}
      </svg>
      <div className="col-span-2 grid gap-2">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className={clsx('size-2 flex-none rounded-full', bgColors[index])} />
            <div className="leading-tight">{item.name}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
