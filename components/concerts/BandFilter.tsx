import { Dispatch, SetStateAction } from 'react'
import { Band, Option } from '../../types/types'
import { FilterButton } from './../FilterButton'
import { MultiSelect } from './../MultiSelect'
import { useBands } from './../../hooks/useBands'

type BandMultiSelectProps = {
  selectedOptions: Option[]
  setSelectedOptions: Dispatch<SetStateAction<Option[]>>
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
  selectedOptions: Option[]
  setSelectedOptions: Dispatch<SetStateAction<Option[]>>
}

export const BandFilter = ({ selectedOptions, setSelectedOptions }: BandFilterProps) => {
  return (
    <FilterButton name="bands" selectedOptions={selectedOptions}>
      <BandMultiSelect selectedOptions={selectedOptions} setSelectedOptions={setSelectedOptions} />
    </FilterButton>
  )
}
