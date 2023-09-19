import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useConcertBands } from '../../hooks/useConcertBands'
import { SpinnerIcon } from '../layout/SpinnerIcon'
import { FilterButton } from './../FilterButton'
import { RangeSliderWrapper } from './../RangeFilter'

type BandCountRangeSliderProps = {
  selectedOptions: number[]
  setSelectedOptions: Dispatch<SetStateAction<number[]>>
}

const BandCountRangeSlider = ({ ...props }: BandCountRangeSliderProps) => {
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
  value?: number[]
  onSubmit: (value: number[]) => void
}

export const BandCountFilter = ({ value, onSubmit }: BandCountFilterProps) => {
  const [selectedOptions, setSelectedOptions] = useState(value ?? [])

  useEffect(() => {
    setSelectedOptions(value ?? [])
  }, [value])
  return (
    <FilterButton name="Bands pro Konzert" selectedOptions={selectedOptions} onSubmit={onSubmit}>
      <BandCountRangeSlider
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
      />
    </FilterButton>
  )
}
