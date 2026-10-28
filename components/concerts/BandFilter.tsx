import { useEffect, useState } from 'react'
import { FilterButton } from './../FilterButton'
import { useBands } from '@/hooks/bands/useBands'
import { Select } from '../forms/Select'
import { useTranslations } from 'next-intl'
import { useSearchFacet } from '@/hooks/search/useSearchFacet'
import { AlgoliaIndex, parseFacetValue } from '@/lib/algolia'

type BandMultiSelectProps = {
  values: number[]
  onValuesChange: (value: number[]) => void
  enabled: boolean
}

const BandMultiSelect = ({ enabled, ...props }: BandMultiSelectProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const { data: bands, isPending } = useSearchFacet(AlgoliaIndex.Concerts, 'bands_facet', {
    search: searchQuery,
    enabled,
  })
  return (
    <Select
      name="band"
      items={
        bands
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

type BandFilterProps = {
  values: number[] | null
  onSubmit: (value: number[]) => void
}

export const BandFilter = ({ values: submittedValues, onSubmit }: BandFilterProps) => {
  const { data: bands } = useBands({
    ids: submittedValues,
    enabled: !!submittedValues?.length,
  })
  const [selectedIds, setSelectedIds] = useState<number[]>(submittedValues ?? [])
  const t = useTranslations('BandFilter')

  useEffect(() => {
    setSelectedIds(submittedValues ?? [])
  }, [submittedValues])
  return (
    <FilterButton
      label={t('band')}
      items={bands?.data}
      selectedIds={selectedIds}
      submittedValues={submittedValues}
      onSubmit={onSubmit}
    >
      {({ isOpen }) => (
        <BandMultiSelect values={selectedIds} onValuesChange={setSelectedIds} enabled={isOpen} />
      )}
    </FilterButton>
  )
}
