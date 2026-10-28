import { useEffect, useState } from 'react'
import { FilterButton } from './../FilterButton'
import { Select } from '../forms/Select'
import { useTranslations } from 'next-intl'
import { useGenres } from '@/hooks/genres/useGenres'
import { AlgoliaIndex, parseFacetValue } from '@/lib/algolia'
import { useSearchFacet } from '@/hooks/search/useSearchFacet'

const GenreMultiSelect = ({
  selectedOptions,
  setSelectedOptions,
  enabled,
}: {
  selectedOptions: number[]
  setSelectedOptions: (value: number[]) => void
  enabled: boolean
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const { data: genres, isPending } = useSearchFacet(AlgoliaIndex.Bands, 'genres_facet', {
    search: searchQuery,
    enabled,
  })
  return (
    <Select
      name="Genre"
      items={
        genres
          ?.map(item => ({
            id: parseFacetValue(item.value).id,
            name: parseFacetValue(item.value).name,
            count: item.count,
          }))
          .sort((a, b) => b.count - a.count) ?? []
      }
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
}: {
  values: number[] | null
  onSubmit: (value: number[]) => void
}) => {
  const { data: genres } = useGenres({ ids: submittedValues, enabled: !!submittedValues?.length })
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
      {({ isOpen }) => (
        <GenreMultiSelect
          selectedOptions={selectedIds}
          setSelectedOptions={setSelectedIds}
          enabled={isOpen}
        />
      )}
    </FilterButton>
  )
}
