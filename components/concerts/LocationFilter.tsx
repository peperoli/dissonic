import { Dispatch, SetStateAction } from 'react'
import { Option } from '../../types/types'
import { FilterButton } from './../FilterButton'
import { MultiSelect } from './../MultiSelect'
import { useLocations } from './../../hooks/useLocations'

type LocationMultiSelectProps = {
  selectedOptions: Option[]
  setSelectedOptions: Dispatch<SetStateAction<Option[]>>
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
  selectedOptions: Option[]
  setSelectedOptions: Dispatch<SetStateAction<Option[]>>
}

export const LocationFilter = ({ selectedOptions, setSelectedOptions }: LocationFilterProps) => {
  return (
    <FilterButton name="locations" selectedOptions={selectedOptions}>
      <LocationMultiSelect selectedOptions={selectedOptions} setSelectedOptions={setSelectedOptions} />
    </FilterButton>
  )
}
