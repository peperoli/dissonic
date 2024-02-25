import {
  Dispatch,
  FocusEvent,
  MouseEvent as ReactMouseEvent,
  TouchEvent as ReactTouchEvent,
  SetStateAction,
  useEffect,
  useRef,
} from 'react'
import { useState } from 'react'
import { NumberField } from './NumberField'

interface ChartProps {
  options: number[]
  initialMin: number
  initialMax: number
  minValue: number
  maxValue: number
}

const Chart = ({ options, initialMin, initialMax, minValue, maxValue }: ChartProps) => {
  const optionCounts: { id: number; count: number }[] = []

  for (let i = initialMin; i <= initialMax; i++) {
    optionCounts.push({ id: i, count: 0 })
  }

  options?.forEach(option => {
    const optionCount = optionCounts.find(item => item.id === option)
    if (optionCount) {
      optionCount.count += 1
    }
  })

  const highestCount = Math.max(...optionCounts.map(item => item.count))
  return (
    <div className="flex items-end justify-between gap-[2px]">
      {optionCounts.map(item => (
        <div
          key={item.id}
          style={{ height: (item.count / highestCount) * 100 }}
          className={`max-w-[0.5rem] flex-1 rounded-sm${
            item.id >= minValue && item.id <= maxValue ? ' bg-venom' : ' bg-slate-800'
          }`}
        />
      ))}
    </div>
  )
}

interface RangeSliderHandleProps {
  side: 'min' | 'max'
  startPosition: number
  width: number
  initialMin: number
  initialMax: number
  value: number
  setValue: Dispatch<SetStateAction<number>>
  otherValue: number
}

const RangeSliderHandle = ({
  side,
  startPosition,
  width,
  initialMin,
  initialMax,
  value,
  setValue,
  otherValue,
}: RangeSliderHandleProps) => {
  const [drag, setDrag] = useState(false)
  const ref = useRef<HTMLButtonElement>(null)

  function dragMouseDown(
    event: ReactMouseEvent<HTMLButtonElement> | ReactTouchEvent<HTMLButtonElement>
  ) {
    event.preventDefault()
    document.addEventListener('mousemove', dragMouseMove)
    document.addEventListener('touchmove', dragMouseMove)
    document.addEventListener('mouseup', dragMouseUp)
    document.addEventListener('touchend', dragMouseUp)
    ref.current?.focus()
    setDrag(true)
  }

  function dragMouseMove(event: MouseEvent | TouchEvent) {
    event.preventDefault()

    const currentPosition =
      event instanceof MouseEvent
        ? event.clientX - startPosition
        : event.touches[0].clientX - startPosition
    const currentValue = Math.round(
      initialMin + (currentPosition / width) * (initialMax - initialMin)
    )
    const condition = side === 'min' ? currentValue <= otherValue : currentValue >= otherValue

    if (currentValue >= initialMin && currentValue <= initialMax && condition) {
      setValue(currentValue)
    }
  }

  function dragMouseUp() {
    document.removeEventListener('mousemove', dragMouseMove)
    document.removeEventListener('touchmove', dragMouseMove)
    setDrag(false)
  }
  return (
    <button
      id="minHandle"
      ref={ref}
      onMouseDown={event => dragMouseDown(event)}
      onTouchStart={event => dragMouseDown(event)}
      className={`absolute h-5 w-5 -translate-x-1/2 transform rounded-full border-2 border-venom bg-slate-700 focus:z-10${
        drag ? ' origin-center scale-125 transform' : ''
      }`}
      style={{ left: ((value - initialMin) / (initialMax - initialMin)) * 100 + '%' }}
    />
  )
}

interface RangeSliderProps {
  initialMin: number
  initialMax: number
  minValue: number
  setMinValue: Dispatch<SetStateAction<number>>
  maxValue: number
  setMaxValue: Dispatch<SetStateAction<number>>
}

const RangeSlider = ({
  initialMin,
  initialMax,
  minValue,
  setMinValue,
  maxValue,
  setMaxValue,
}: RangeSliderProps) => {
  const [startPosition, setStartPosition] = useState(0)
  const [width, setWidth] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const range = initialMax - initialMin

  function constrain(value: number) {
    if (value < initialMin) {
      return initialMin
    }
    if (value > initialMax) {
      return initialMax
    }
    return value
  }

  const constrainedMinValue = minValue <= maxValue ? constrain(minValue) : constrain(maxValue)
  const constrainedMaxValue = maxValue >= minValue ? constrain(maxValue) : constrain(minValue)

  useEffect(() => {
    if (ref.current) {
      setWidth(ref.current.clientWidth)
      setStartPosition(ref.current.getBoundingClientRect().left)
    }
  }, [])
  return (
    <div ref={ref} className="relative my-4 flex h-1 w-full items-center rounded-full bg-slate-800">
      <div
        style={{
          left: ((constrainedMinValue - initialMin) / range) * 100 + '%',
          right: ((initialMax - constrainedMaxValue) / range) * 100 + '%',
        }}
        className="absolute h-1 bg-venom"
      />
      <RangeSliderHandle
        side="min"
        startPosition={startPosition}
        width={width}
        initialMin={initialMin}
        initialMax={initialMax}
        value={constrainedMinValue}
        setValue={setMinValue}
        otherValue={maxValue}
      />
      <RangeSliderHandle
        side="max"
        startPosition={startPosition}
        width={width}
        initialMin={initialMin}
        initialMax={initialMax}
        value={constrainedMaxValue}
        setValue={setMaxValue}
        otherValue={minValue}
      />
    </div>
  )
}

interface RangeSliderWrapperProps {
  unit: string
  options: number[]
  isLoading?: boolean
  selectedOptions: number[]
  setSelectedOptions: Dispatch<SetStateAction<number[]>>
}

export const RangeSliderWrapper = ({
  unit,
  options,
  selectedOptions,
  setSelectedOptions,
}: RangeSliderWrapperProps) => {
  const initialMin = Math.min(...options)
  const initialMax = Math.max(...options)

  const [minValue, setMinValue] = useState(selectedOptions?.[0] || initialMin)
  const [maxValue, setMaxValue] = useState(selectedOptions?.[1] || initialMax)

  function handleMinBlur(event: FocusEvent<HTMLInputElement>) {
    const value = Number(event.target.value)
    if (value < initialMin) {
      setMinValue(initialMin)
    } else if (value > initialMax) {
      setMinValue(initialMax)
    }
    if (value > maxValue) {
      setMaxValue(value > initialMax ? initialMax : value)
    }
  }

  function handleMaxBlur(event: FocusEvent<HTMLInputElement>) {
    const value = Number(event.target.value)
    if (value < initialMin) {
      setMaxValue(initialMin)
    } else if (value > initialMax) {
      setMaxValue(initialMax)
    }
    if (value < minValue) {
      setMinValue(value < initialMin ? initialMin : value)
    }
  }

  useEffect(() => {
    setSelectedOptions([minValue, maxValue])
  }, [minValue, maxValue])
  return (
    <div className="size-full md:h-auto">
      <Chart
        options={options}
        initialMin={initialMin}
        initialMax={initialMax}
        minValue={minValue}
        maxValue={maxValue}
      />
      <RangeSlider
        initialMin={initialMin}
        initialMax={initialMax}
        minValue={minValue}
        setMinValue={setMinValue}
        maxValue={maxValue}
        setMaxValue={setMaxValue}
      />
      <div className="mb-2 flex gap-8">
        <NumberField
          id="min"
          unit={unit}
          min={initialMin}
          max={initialMax}
          value={minValue}
          setValue={setMinValue}
          onBlur={handleMinBlur}
        />
        <NumberField
          id="max"
          unit={unit}
          min={initialMin}
          max={initialMax}
          value={maxValue}
          setValue={setMaxValue}
          onBlur={handleMaxBlur}
        />
      </div>
    </div>
  )
}
