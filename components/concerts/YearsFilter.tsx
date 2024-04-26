import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useConcertDates } from '../../hooks/concerts/useConcertDates'
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
      <div className="flex h-56 w-full items-center justify-center">
        <SpinnerIcon className="h-8 animate-spin" />
      </div>
    )
  }
  return <RangeSliderWrapper unit="Jahr" options={concertYears} isLoading={isLoading} {...props} />
}

interface YearsFilterProps {
  values: number[] | null
  onSubmit: (value: number[]) => void
}

export const YearsFilter = ({ values: submittedValues, onSubmit }: YearsFilterProps) => {
  const [selectedOptions, setSelectedOptions] = useState(submittedValues ?? [])

  useEffect(() => {
    setSelectedOptions(submittedValues ?? [])
  }, [submittedValues])
  return (
    <FilterButton
      label="Jahr"
      type="range"
      selectedIds={selectedOptions}
      submittedValues={submittedValues}
      onSubmit={onSubmit}
    >
      <YearsRangeSlider selectedOptions={selectedOptions} setSelectedOptions={setSelectedOptions} />
    </FilterButton>
  )
}
