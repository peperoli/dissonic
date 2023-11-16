import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useConcertDates } from '../../hooks/useConcertDates'
import { SpinnerIcon } from '../layout/SpinnerIcon'
import { FilterButton } from './../FilterButton'
import { RangeSliderWrapper } from './../RangeFilter'

type YearsRangeSliderProps = {
  selectedOptions: number[]
  setSelectedOptions: Dispatch<SetStateAction<number[]>>
}

const YearsRangeSlider = ({ ...props }: YearsRangeSliderProps) => {
  const { data: concertDates, isLoading } = useConcertDates()
  const concertYears = concertDates
    ?.map(item => item.date_start && new Date(item.date_start).getFullYear())
    .filter(item => typeof item === 'number') as number[] | undefined

  if (!concertYears || concertYears.length === 0 || isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-56">
        <SpinnerIcon className="h-8 animate-spin" />
      </div>
    )
  }
  return <RangeSliderWrapper unit="Jahr" options={concertYears} isLoading={isLoading} {...props} />
}

interface YearsFilterProps {
  value: number[] | null
  onSubmit: (value: number[]) => void
}

export const YearsFilter = ({ value, onSubmit }: YearsFilterProps) => {
  const [selectedOptions, setSelectedOptions] = useState(value ?? [])
  const count = value?.[1] && value?.[0] ? value[1] - value[0] + 1 : 0

  useEffect(() => {
    setSelectedOptions(value ?? [])
  }, [value])
  return (
    <FilterButton name="Jahre" selectedOptions={selectedOptions} onSubmit={onSubmit} count={count}>
      <YearsRangeSlider selectedOptions={selectedOptions} setSelectedOptions={setSelectedOptions} />
    </FilterButton>
  )
}
