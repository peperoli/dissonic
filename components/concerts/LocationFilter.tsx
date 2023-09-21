import { useEffect, useState } from 'react'
import { FilterButton } from './../FilterButton'
import { MultiSelect } from './../MultiSelect'
import { useLocations } from './../../hooks/useLocations'

type LocationMultiSelectProps = {
  selectedOptions: number[]
  setSelectedOptions: (value: number[]) => void
}

const LocationMultiSelect = ({ selectedOptions, setSelectedOptions }: LocationMultiSelectProps) => {
  const { data: locations, isLoading } = useLocations()
  return (
    <div className="relative h-full">
      <MultiSelect
        name="locations"
        options={locations?.data}
        isLoading={isLoading}
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
        alwaysOpen
        fullHeight
      />
    </div>
  )
}

type LocationFilterProps = {
  value?: number[]
  onSubmit: (value: number[]) => void
}

export const LocationFilter = ({ value, onSubmit }: LocationFilterProps) => {
  const [selectedIds, setSelectedIds] = useState(value ?? [])

  useEffect(() => {
    setSelectedIds(value ?? [])
  }, [value])
  return (
    <FilterButton
      name="Locations"
      selectedOptions={selectedIds}
      count={value?.length ?? 0}
      onSubmit={onSubmit}
    >
      <LocationMultiSelect selectedOptions={selectedIds} setSelectedOptions={setSelectedIds} />
    </FilterButton>
  )
}
