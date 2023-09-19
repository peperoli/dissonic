import { useEffect, useState } from 'react'
import { FilterButton } from './../FilterButton'
import { MultiSelect } from './../MultiSelect'
import { useGenres } from './../../hooks/useGenres'

type GenreMultiSelectProps = {
  selectedOptions: number[]
  setSelectedOptions: (value: number[]) => void
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
  value?: number[]
  onSubmit: (value: number[]) => void
}

export const GenreFilter = ({ value, onSubmit }: GenreFilterProps) => {
  const [selectedOptions, setSelectedOptions] = useState(value ?? [])

  useEffect(() => {
    setSelectedOptions(value ?? [])
  }, [value])
  return (
    <FilterButton name="Genres" selectedOptions={selectedOptions} onSubmit={onSubmit}>
      <GenreMultiSelect
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
      />
    </FilterButton>
  )
}
