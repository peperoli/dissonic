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

interface RangeSliderProps {
  initialMin: number
  initialMax: number
  minValue: number
  setMinValue: Dispatch<SetStateAction<number>>
  maxValue: number
  setMaxValue: Dispatch<SetStateAction<number>>
}

const RangeSlider: FC<RangeSliderProps> = ({
  initialMin,
  initialMax,
  minValue,
  setMinValue,
  maxValue,
  setMaxValue,
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

  function dragMouseDown(event: ReactMouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    document.addEventListener('mousemove', dragMouseMove)
    document.addEventListener('mouseup', dragMouseUp)
  }

  function dragMouseMove(event: MouseEvent) {
    event.preventDefault()

    const currentPosition = event.clientX - startPosition

    const currentValue = Math.round(
      initialMin + (currentPosition / width) * (initialMax - initialMin)
    )

    if (currentValue < initialMin) {
      setMinValue(initialMin)
    } else if (currentValue > initialMax) {
      setMinValue(initialMax)
    } else {
      setMinValue(currentValue)
    }
  }

  function dragMouseUp() {
    document.removeEventListener('mousemove', dragMouseMove)
  }

  return (
    <div ref={ref} className="relative flex items-center w-full h-1 my-4 rounded-full bg-venom">
      <button
        onMouseDown={event => dragMouseDown(event)}
        className="absolute w-6 h-6 rounded-full border border-venom bg-slate-800 transform -translate-x-1/2"
        style={{ left: ((minValue - initialMin) / (initialMax - initialMin)) * 100 + '%' }}
      />
    </div>
  )
}

interface RangeFilterProps {
  name: string
  options: number[]
  selectedOptions: number[]
  setSelectedOptions: Dispatch<SetStateAction<number[]>>
}

export const RangeFilter: FC<RangeFilterProps> = ({
  name,
  options,
  selectedOptions,
  setSelectedOptions,
}) => {
  const initialMin = Math.min(...options)
  const initialMax = Math.max(...options)
  const [minValue, setMinValue] = useState(initialMin)
  const [maxValue, setMaxValue] = useState(initialMax)

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

    setSelectedOptions(options.filter(item => item >= minValue && item <= maxValue))
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

    setSelectedOptions(options.filter(item => item >= minValue && item <= maxValue))
  }

  return (
    <FilterButton
      name={name}
      selectedOptions={selectedOptions}
      setSelectedOptions={setSelectedOptions}
    >
      {/* <RangeSlider
        initialMin={initialMin}
        initialMax={initialMax}
        minValue={minValue}
        setMinValue={setMinValue}
        maxValue={maxValue}
        setMaxValue={setMaxValue}
      /> */}
      <div className="flex gap-8">
        <NumberField
          id="min"
          unit="Jahr"
          min={initialMin}
          max={initialMax}
          value={minValue}
          setValue={setMinValue}
          onBlur={handleMinBlur}
        />
        <NumberField
          id="max"
          unit="Jahr"
          min={initialMin}
          max={initialMax}
          value={maxValue}
          setValue={setMaxValue}
          onBlur={handleMaxBlur}
        />
      </div>
    </FilterButton>
  )
}
