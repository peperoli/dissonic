'use client'

import * as Tooltip from '@radix-ui/react-tooltip'
import clsx from 'clsx'
import { useTranslations } from 'next-intl'

const ASPECT_RATIO = 4 / 1
const GAP = 1
const GAP_SMALL = 0.5

const fillClasses = {
  venom: 'fill-venom',
  blue: 'fill-blue',
  purple: 'fill-purple',
} as const

type BarProps = {
  name: string
  value: number
  index: number
  max: number
  length: number
  datasetIndex: number
  datasetAmount: number
  unit: string
  color: 'venom' | 'blue' | 'purple'
}

const Bar = ({
  name,
  value,
  index,
  max,
  length,
  datasetIndex,
  datasetAmount,
  unit,
  color,
}: BarProps) => {
  const t = useTranslations('BarChart')
  const width = ((100 / length - GAP) * ASPECT_RATIO) / datasetAmount
  const height = (value / max) * 100 || 1
  const x = (100 / length) * index * ASPECT_RATIO + datasetIndex * (width + GAP_SMALL)
  const y = 100 - height
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          className={clsx('clip-rounded-t', value > 0 ? fillClasses[color] : 'fill-slate-500')}
        />
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content className="z-10 rounded-lg border border-slate-800 bg-slate-850 p-2 text-sm shadow-lg">
          <strong>
            {t(unit, { count: value })}
          </strong>
          <br />
          {name}
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  )
}

type DataSet = {
  unit: string
  color: 'venom' | 'blue' | 'purple'
  data: { name: string; value: number }[]
}

type BarChartProps = {
  datasets: DataSet[]
}

export const BarChart = ({ datasets }: BarChartProps) => {
  const maxValue = Math.max(...datasets.flatMap(item => item.data.map(({ value }) => value)))
  const largestDataset = datasets.reduce((prev, current) =>
    prev.data.length > current.data.length ? prev : current
  )
  const length = largestDataset.data.length
  return (
    <div>
      <svg viewBox={`0 0 ${100 * ASPECT_RATIO} 100`} xmlns="http://www.w3.org/2000/svg">
        {datasets.map(({ data, ...dataset }, datasetIndex) =>
          data.map((item, index) => (
            <Bar
              key={index}
              {...item}
              index={index}
              max={maxValue}
              length={length}
              datasetIndex={datasetIndex}
              datasetAmount={datasets.length}
              {...dataset}
            />
          ))
        )}
      </svg>
      <div className="mt-1 flex justify-between">
        <span>{largestDataset.data[0]?.name}</span>
        <span>{largestDataset.data[length - 1]?.name}</span>
      </div>
    </div>
  )
}
