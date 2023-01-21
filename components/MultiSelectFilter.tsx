import { Dispatch, FC, SetStateAction } from 'react'
import { useQuery } from 'react-query'
import { Option } from '../types/types'
import { FilterButton } from './FilterButton'
import { MultiSelect } from './MultiSelect'

interface MultiSelectFilterProps {
  name: string
  options: Option[]
  selectedOptions: Option[]
  setSelectedOptions: Dispatch<SetStateAction<any[]>>
}

export const MultiSelectFilter: FC<MultiSelectFilterProps> = ({
  name,
  options,
  selectedOptions,
  setSelectedOptions,
}) => {
  return (
    <FilterButton
      name={name}
      selectedOptions={selectedOptions}
      setSelectedOptions={setSelectedOptions}
    >
      <div className="relative h-full">
        <MultiSelect
          name={name}
          options={options}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
          alwaysOpen
          fullHeight
        />
      </div>
    </FilterButton>
  )
}
