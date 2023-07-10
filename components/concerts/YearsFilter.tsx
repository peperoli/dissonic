import React, { Dispatch, SetStateAction } from 'react'
import { useConcertDates } from '../../hooks/useConcertDates'
import { SpinnerIcon } from '../layout/SpinnerIcon'
import { FilterButton } from './../FilterButton'
import { RangeSliderWrapper } from './../RangeFilter'

const YearsRangeSlider = ({ ...props }: YearsFilterProps) => {
  const { data: concertDates, isLoading } = useConcertDates()
  const concertYears = concertDates?.map(
    item => item.date_start && new Date(item.date_start).getFullYear()
  ).filter(item => typeof item === 'number') as number[] | undefined

  if (!concertYears || isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-56">
        <SpinnerIcon className="h-8 animate-spin" />
      </div>
    )
  }
  return <RangeSliderWrapper unit="Jahr" options={concertYears} isLoading={isLoading} {...props} />
}

interface YearsFilterProps {
  selectedOptions: [number, number] | null
  setSelectedOptions: Dispatch<SetStateAction<[number, number] | null>>
}

export const YearsFilter = ({ selectedOptions, setSelectedOptions }: YearsFilterProps) => {
  return (
    <FilterButton name="Jahre" selectedOptions={selectedOptions}>
      <YearsRangeSlider selectedOptions={selectedOptions} setSelectedOptions={setSelectedOptions} />
    </FilterButton>
  )
}
