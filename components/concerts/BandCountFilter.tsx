import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useConcertBands } from '../../hooks/concerts/useConcertBands'
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
      <div className="flex h-56 w-full items-center justify-center">
        <SpinnerIcon className="h-8 animate-spin" />
      </div>
    )
  }
  return <RangeSliderWrapper unit="Bands" options={bandCounts} isLoading={isLoading} {...props} />
}

interface BandCountFilterProps {
  values: number[] | null
  onSubmit: (value: number[]) => void
}

export const BandCountFilter = ({ values: submittedValues, onSubmit }: BandCountFilterProps) => {
  const [selectedIds, setSelectedIds] = useState(submittedValues ?? [])

  useEffect(() => {
    setSelectedIds(submittedValues ?? [])
  }, [submittedValues])
  return (
    <FilterButton
      label="Anzahl Bands"
      submittedValues={submittedValues}
      selectedIds={selectedIds}
      onSubmit={onSubmit}
    >
      <BandCountRangeSlider selectedOptions={selectedIds} setSelectedOptions={setSelectedIds} />
    </FilterButton>
  )
}
