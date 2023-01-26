import React, {
  Dispatch,
  FC,
  FocusEvent,
  MouseEvent as ReactMouseEvent,
  SetStateAction,
  useEffect,
  useRef,
} from 'react'
import { useState } from 'react'
import { FilterButton } from './FilterButton'
import { NumberField } from './NumberField'

interface ChartProps {
  options: number[]
  initialMin: number
  initialMax: number
  minValue: number
  maxValue: number
}

const Chart: FC<ChartProps> = ({ options, initialMin, initialMax, minValue, maxValue }) => {
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
    <div className="flex justify-between items-end gap-[2px]">
      {optionCounts.map(item => (
        <div
          key={item.id}
          style={{ height: (item.count / highestCount) * 100 }}
          className={`flex-1 max-w-[0.5rem] rounded-sm${
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

const RangeSliderHandle: FC<RangeSliderHandleProps> = ({
  side,
  startPosition,
  width,
  initialMin,
  initialMax,
  value,
  setValue,
  otherValue,
}) => {
  const [drag, setDrag] = useState(false)
  const ref = useRef<HTMLButtonElement>(null)

  function dragMouseDown(event: ReactMouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    document.addEventListener('mousemove', dragMouseMove)
    document.addEventListener('mouseup', dragMouseUp)
    ref.current?.focus()
    setDrag(true)
  }

  function dragMouseMove(event: MouseEvent) {
    event.preventDefault()

    const currentPosition = event.clientX - startPosition
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
    setDrag(false)
  }
  return (
    <button
      id="minHandle"
      ref={ref}
      onMouseDown={event => dragMouseDown(event)}
      className={`absolute w-5 h-5 rounded-full border-2 border-venom bg-slate-700 transform -translate-x-1/2 focus:z-10${
        drag ? ' transform origin-center scale-125' : ''
      }`}
      style={{ left: ((value - initialMin) / (initialMax - initialMin)) * 100 + '%' }}
    />
  )
}

interface RangeSliderProps {
  initialMin: number
  initialMax: number
  minPosition: number
  setMinPosition: Dispatch<SetStateAction<number>>
  maxPosition: number
  setMaxPosition: Dispatch<SetStateAction<number>>
}

const RangeSlider: FC<RangeSliderProps> = ({
  initialMin,
  initialMax,
  minPosition,
  setMinPosition,
  maxPosition,
  setMaxPosition,
}) => {
  const [startPosition, setStartPosition] = useState(0)
  const [width, setWidth] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      setWidth(ref.current.clientWidth)
      setStartPosition(ref.current.getBoundingClientRect().left)
    }
  }, [])
  return (
    <div ref={ref} className="relative flex items-center w-full h-1 my-4 rounded-full bg-slate-800">
      <div
        style={{
          left: ((minPosition - initialMin) / (initialMax - initialMin)) * 100 + '%',
          right: ((initialMax - maxPosition) / (initialMax - initialMin)) * 100 + '%',
        }}
        className="absolute h-1 bg-venom"
      />
      <RangeSliderHandle
        side="min"
        startPosition={startPosition}
        width={width}
        initialMin={initialMin}
        initialMax={initialMax}
        value={minPosition}
        setValue={setMinPosition}
        otherValue={maxPosition}
      />
      <RangeSliderHandle
        side="max"
        startPosition={startPosition}
        width={width}
        initialMin={initialMin}
        initialMax={initialMax}
        value={maxPosition}
        setValue={setMaxPosition}
        otherValue={minPosition}
      />
    </div>
  )
}

interface RangeSliderWrapperProps {
  unit: string
  options: number[]
  initialMin: number
  initialMax: number
  minValue: number
  setMinValue: Dispatch<SetStateAction<number>>
  maxValue: number
  setMaxValue: Dispatch<SetStateAction<number>>
}

const RangeSliderWrapper: FC<RangeSliderWrapperProps> = ({ options, unit, initialMin, initialMax, minValue, setMinValue, maxValue, setMaxValue }) => {
  const [minPosition, setMinPosition] = useState(initialMin)
  const [maxPosition, setMaxPosition] = useState(initialMax)

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
    if (minValue >= initialMin && minValue <= initialMax && minValue <= maxValue) {
      setMinPosition(minValue)
    }
  }, [minValue])

  useEffect(() => {
    if (maxValue >= initialMin && maxValue <= initialMax && maxValue >= minValue) {
      setMaxPosition(maxValue)
    }
  }, [maxValue])

  useEffect(() => {
    setMinValue(minPosition)
  }, [minPosition])

  useEffect(() => {
    setMaxValue(maxPosition)
  }, [maxPosition])
  return (
    <>
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
        minPosition={minPosition}
        setMinPosition={setMinPosition}
        maxPosition={maxPosition}
        setMaxPosition={setMaxPosition}
      />
      <div className="flex gap-8">
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
    </>
  )
}

interface RangeFilterProps {
  name: string
  unit: string
  options: number[] | undefined
  selectedOptions: number[]
  setSelectedOptions: Dispatch<SetStateAction<number[]>>
}

export const RangeFilter: FC<RangeFilterProps> = ({
  name,
  unit,
  options,
  selectedOptions,
  setSelectedOptions,
}) => {
  const [initialMin, setInitialMin] = useState(0)
  const [initialMax, setInitialMax] = useState(0)
  const [minValue, setMinValue] = useState(initialMin)
  const [maxValue, setMaxValue] = useState(initialMax)
  const uniqueOptions = [...new Set(options)]

  useEffect(() => {
    if (options) {
      setInitialMin(Math.min(...options))
      setInitialMax(Math.max(...options))
    }
  }, [options?.length])

  function submitSelectedOptions(min: number, max: number) {
    setSelectedOptions(uniqueOptions.filter(item => item >= min && item <= max))
  }
  return (
    <FilterButton
      name={name}
      selectedOptions={selectedOptions}
      setSelectedOptions={setSelectedOptions}
      handleSubmit={() => submitSelectedOptions(minValue, maxValue)}
    >
      {options && (
        <RangeSliderWrapper
          unit={unit}
          options={options}
          minValue={minValue}
          setMinValue={setMinValue}
          maxValue={maxValue}
          setMaxValue={setMaxValue}
          initialMin={initialMin}
          initialMax={initialMax}
        />
      )}
    </FilterButton>
  )
}
