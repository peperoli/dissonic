import { useEffect, useState } from 'react'
import { FilterButton } from './../FilterButton'
import { useGenres } from '../../hooks/genres/useGenres'
import { Select } from '../forms/Select'
import { useTranslations } from 'next-intl'

type GenreMultiSelectProps = {
  selectedOptions: number[]
  setSelectedOptions: (value: number[]) => void
}

const GenreMultiSelect = ({ selectedOptions, setSelectedOptions }: GenreMultiSelectProps) => {
  const { data: genres, isPending } = useGenres()
  return (
    <Select
      name="Genre"
      items={genres}
      isLoading={isPending}
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
  const t = useTranslations('GenreFilter')

  useEffect(() => {
    setSelectedIds(submittedValues ?? [])
  }, [submittedValues])
  return (
    <FilterButton
      label={t('genre')}
      items={genres}
      selectedIds={selectedIds}
      submittedValues={submittedValues}
      onSubmit={onSubmit}
    >
      <GenreMultiSelect selectedOptions={selectedIds} setSelectedOptions={setSelectedIds} />
    </FilterButton>
  )
}
