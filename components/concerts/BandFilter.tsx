import { useEffect, useState } from 'react'
import { FilterButton } from './../FilterButton'
import { MultiSelect } from './../MultiSelect'
import { useBands } from './../../hooks/useBands'

type BandMultiSelectProps = {
  selectedOptions: number[]
  setSelectedOptions: (value: number[]) => void
}

const BandMultiSelect = ({ selectedOptions, setSelectedOptions }: BandMultiSelectProps) => {
  const { data: bands, isLoading } = useBands()
  return (
    <div className="relative h-full">
      <MultiSelect
        name="bands"
        options={bands?.data}
        isLoading={isLoading}
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
        alwaysOpen
        fullHeight
      />
    </div>
  )
}

type BandFilterProps = {
  value?: number[]
  onSubmit: (value: number[]) => void
}

export const BandFilter = ({ value, onSubmit }: BandFilterProps) => {
  const [selectedIds, setSelectedIds] = useState<number[]>(value ?? [])

  useEffect(() => {
    setSelectedIds(value ?? [])
  }, [value])
  return (
    <FilterButton
      name="Bands"
      onSubmit={onSubmit}
      selectedOptions={selectedIds}
      count={value?.length ?? 0}
    >
      <BandMultiSelect selectedOptions={selectedIds} setSelectedOptions={setSelectedIds} />
    </FilterButton>
  )
}
