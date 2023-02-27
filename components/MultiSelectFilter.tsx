import { Dispatch, FC, SetStateAction } from 'react'
import { Option } from '../types/types'
import { FilterButton } from './FilterButton'
import { MultiSelect } from './MultiSelect'

interface MultiSelectFilterProps {
  name: string
  options: Option[] | undefined
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
    <FilterButton name={name} selectedOptions={selectedOptions}>
      <div className="relative h-full">
        {options && (
          <MultiSelect
            name={name}
            options={options}
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
            alwaysOpen
            fullHeight
          />
        )}
      </div>
    </FilterButton>
  )
}
