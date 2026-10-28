import { useEffect, useState } from 'react'
import { FilterButton } from './../FilterButton'
import { useLocations } from './../../hooks/locations/useLocations'
import { Select } from '../forms/Select'
import { useTranslations } from 'next-intl'
import { useSearchFacet } from '@/hooks/search/useSearchFacet'
import { AlgoliaIndex, parseFacetValue } from '@/lib/algolia'

type LocationMultiSelectProps = {
  values: number[]
  onValuesChange: (value: number[]) => void
  enabled: boolean
}

const LocationMultiSelect = ({ enabled, ...props }: LocationMultiSelectProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const { data: locations, isPending } = useSearchFacet(AlgoliaIndex.Concerts, 'location_facet', {
    search: searchQuery,
    enabled,
  })
  return (
    <Select
      name="location"
      items={
        locations
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
      fixedHeight
      {...props}
    />
  )
}

type LocationFilterProps = {
  values: number[] | null
  onSubmit: (value: number[]) => void
}

export const LocationFilter = ({ values: submittedValues, onSubmit }: LocationFilterProps) => {
  const { data: locations } = useLocations({
    ids: submittedValues,
    enabled: !!submittedValues?.length,
  })
  const [selectedIds, setSelectedIds] = useState(submittedValues ?? [])
  const t = useTranslations('LocationFilter')

  useEffect(() => {
    setSelectedIds(submittedValues ?? [])
  }, [submittedValues])
  return (
    <FilterButton
      label={t('location')}
      items={locations?.data}
      selectedIds={selectedIds}
      submittedValues={submittedValues}
      onSubmit={onSubmit}
    >
      {({ isOpen }) => (
        <LocationMultiSelect
          values={selectedIds}
          onValuesChange={setSelectedIds}
          enabled={isOpen}
        />
      )}
    </FilterButton>
  )
}
