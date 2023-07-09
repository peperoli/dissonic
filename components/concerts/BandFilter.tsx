import { Dispatch, SetStateAction } from 'react'
import { Band } from '../../types/types'
import { FilterButton } from './../FilterButton'
import { MultiSelect } from './../MultiSelect'
import { useBands } from './../../hooks/useBands'

type BandMultiSelectProps = {
  selectedOptions: Band[]
  setSelectedOptions: Dispatch<SetStateAction<Band[]>>
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
  selectedOptions: Band[]
  setSelectedOptions: Dispatch<SetStateAction<Band[]>>
}

export const BandFilter = ({ selectedOptions, setSelectedOptions }: BandFilterProps) => {
  return (
    <FilterButton name="bands" selectedOptions={selectedOptions}>
      <BandMultiSelect selectedOptions={selectedOptions} setSelectedOptions={setSelectedOptions} />
    </FilterButton>
  )
}
