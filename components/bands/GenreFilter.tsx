import { Dispatch, SetStateAction } from 'react'
import { Option } from '../../types/types'
import { FilterButton } from './../FilterButton'
import { MultiSelect } from './../MultiSelect'
import { useGenres } from './../../hooks/useGenres'

type GenreMultiSelectProps = {
  selectedOptions: Option[]
  setSelectedOptions: Dispatch<SetStateAction<Option[]>>
}

const GenreMultiSelect = ({ selectedOptions, setSelectedOptions }: GenreMultiSelectProps) => {
  const { data: genres, isLoading } = useGenres()
  return (
    <div className="relative h-full">
      <MultiSelect
        name="Genres"
        options={genres}
        isLoading={isLoading}
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
        alwaysOpen
        fullHeight
      />
    </div>
  )
}

type GenreFilterProps = {
  selectedOptions: Option[]
  setSelectedOptions: Dispatch<SetStateAction<Option[]>>
}

export const GenreFilter = ({ selectedOptions, setSelectedOptions }: GenreFilterProps) => {
  return (
    <FilterButton name="Genres" selectedOptions={selectedOptions}>
      <GenreMultiSelect
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
      />
    </FilterButton>
  )
}
