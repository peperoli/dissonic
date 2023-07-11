import React, { Dispatch, SetStateAction } from 'react'
import { useConcertBands } from '../../hooks/useConcertBands'
import { SpinnerIcon } from '../layout/SpinnerIcon'
import { FilterButton } from './../FilterButton'
import { RangeSliderWrapper } from './../RangeFilter'

const BandCountRangeSlider = ({ ...props }: BandCountFilterProps) => {
  const { data: concertBands, isLoading } = useConcertBands()
  const bandCounts = concertBands
    ?.map(item => Array.isArray(item.bands_count) && item.bands_count[0]?.count)
    .filter(item => typeof item === 'number') as number[] | undefined

  if (!bandCounts || bandCounts.length === 0 || isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-56">
        <SpinnerIcon className="h-8 animate-spin" />
      </div>
    )
  }
  return <RangeSliderWrapper unit="Bands" options={bandCounts} isLoading={isLoading} {...props} />
}

interface BandCountFilterProps {
  selectedOptions: [number, number] | null
  setSelectedOptions: Dispatch<SetStateAction<[number, number] | null>>
}

export const BandCountFilter = ({ selectedOptions, setSelectedOptions }: BandCountFilterProps) => {
  return (
    <FilterButton name="Bands pro Konzert" selectedOptions={selectedOptions}>
      <BandCountRangeSlider
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
      />
    </FilterButton>
  )
}
