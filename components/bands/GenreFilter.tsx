import { useEffect, useState } from 'react'
import { FilterButton } from './../FilterButton'
import { useGenres } from '../../hooks/genres/useGenres'
import { Select } from '../forms/Select'
import { useTranslations } from 'next-intl'

const GenreMultiSelect = ({
  selectedOptions,
  setSelectedOptions,
  facetCounts,
}: {
  selectedOptions: number[]
  setSelectedOptions: (value: number[]) => void
  facetCounts: Record<number, number>
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const { data: genres, isPending } = useGenres({ search: searchQuery })
  return (
    <Select
      name="Genre"
      items={genres
        ?.map(item => ({
          id: item.id,
          name: item.name,
          count: facetCounts[item.id] ?? 0,
        }))
        .sort((a, b) => b.count - a.count) ?? []}
      searchable
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      isLoading={isPending}
      multiple
      values={selectedOptions}
      onValuesChange={setSelectedOptions}
      fixedHeight
    />
  )
}

export const GenreFilter = ({
  values: submittedValues,
  onSubmit,
  facetCounts,
}: {
  values: number[] | null
  onSubmit: (value: number[]) => void
  facetCounts: Record<number, number>
}) => {
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
      <GenreMultiSelect
        selectedOptions={selectedIds}
        setSelectedOptions={setSelectedIds}
        facetCounts={facetCounts}
      />
    </FilterButton>
  )
}
