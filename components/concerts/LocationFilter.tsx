import React, { Dispatch, SetStateAction } from 'react'
import { Location } from '../../types/types'
import { FilterButton } from './../FilterButton'
import { MultiSelect } from './../MultiSelect'
import { useLocations } from './../../hooks/useLocations'

type LocationMultiSelectProps = {
  selectedOptions: Location[]
  setSelectedOptions: Dispatch<SetStateAction<Location[]>>
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
  selectedOptions: Location[]
  setSelectedOptions: Dispatch<SetStateAction<Location[]>>
}

export const LocationFilter = ({ selectedOptions, setSelectedOptions }: LocationFilterProps) => {
  return (
    <FilterButton name="locations" selectedOptions={selectedOptions}>
      <LocationMultiSelect selectedOptions={selectedOptions} setSelectedOptions={setSelectedOptions} />
    </FilterButton>
  )
}
