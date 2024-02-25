import { useEffect, useState } from 'react'
import { FilterButton } from './../FilterButton'
import { useGenres } from './../../hooks/useGenres'
import { Select } from '../forms/Select'

type GenreMultiSelectProps = {
  selectedOptions: number[]
  setSelectedOptions: (value: number[]) => void
}

const GenreMultiSelect = ({ selectedOptions, setSelectedOptions }: GenreMultiSelectProps) => {
  const { data: genres, isLoading } = useGenres()
  return (
    <Select
      name="Genre"
      items={genres}
      isLoading={isLoading}
      multiple
      values={selectedOptions}
      onValuesChange={setSelectedOptions}
      fixedHeight
    />
  )
}

type GenreFilterProps = {
  values: number[] | null
  onSubmit: (value: number[]) => void
}

export const GenreFilter = ({ values: submittedValues, onSubmit }: GenreFilterProps) => {
  const { data: genres } = useGenres({ ids: submittedValues })
  const [selectedIds, setSelectedIds] = useState(submittedValues ?? [])

  useEffect(() => {
    setSelectedIds(submittedValues ?? [])
  }, [submittedValues])
  return (
    <FilterButton
      label="Genre"
      items={genres}
      selectedIds={selectedIds}
      submittedValues={submittedValues}
      onSubmit={onSubmit}
    >
      <GenreMultiSelect selectedOptions={selectedIds} setSelectedOptions={setSelectedIds} />
    </FilterButton>
  )
}
