import { useEffect, useState } from 'react'
import { FilterButton } from './../FilterButton'
import { useBands } from './../../hooks/bands/useBands'
import { Select } from '../forms/Select'
import { useTranslations } from 'next-intl'

type BandMultiSelectProps = {
  values: number[]
  onValuesChange: (value: number[]) => void
  facetCounts: Record<number, number>
}

const BandMultiSelect = ({ facetCounts, ...props }: BandMultiSelectProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const { data: bands, isPending } = useBands({ search: searchQuery })
  return (
    <Select
      name="band"
      items={bands?.data
        .map(band => ({
          id: band.id,
          name: band.name,
          count: facetCounts[band.id] ?? 0,
        }))
        .sort((a, b) => b.count - a.count)}
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
  facetCounts: Record<number, number>
}

export const BandFilter = ({ values: submittedValues, onSubmit, facetCounts }: BandFilterProps) => {
  const { data: bands } = useBands({ ids: submittedValues })
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
      <BandMultiSelect
        values={selectedIds}
        onValuesChange={setSelectedIds}
        facetCounts={facetCounts}
      />
    </FilterButton>
  )
}
