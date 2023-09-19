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
  const [selectedOptions, setSelectedOptions] = useState(value ?? [])

  useEffect(() => {
    setSelectedOptions(value ?? [])
  }, [value])
  return (
    <FilterButton name="locations" selectedOptions={selectedOptions} onSubmit={onSubmit}>
      <LocationMultiSelect selectedOptions={selectedOptions} setSelectedOptions={setSelectedOptions} />
    </FilterButton>
  )
}
