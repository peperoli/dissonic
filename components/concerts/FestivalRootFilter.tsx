import { useEffect, useState } from 'react'
import { FilterButton } from './../FilterButton'
import { Select } from '../forms/Select'
import { useFestivalRoots } from '../../hooks/concerts/useFestivalRoots'
import { useTranslations } from 'next-intl'

type FestivalRootSelectProps = {
  values: number[]
  onValuesChange: (value: number[]) => void
  facetCounts: Record<number, number>
  enabled: boolean
}

const FestivalRootSelect = ({ facetCounts, enabled, ...props }: FestivalRootSelectProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const { data: festivalRoots, isPending } = useFestivalRoots({
    search: searchQuery,
    sort: { sort_by: 'name', sort_asc: true },
    enabled,
  })
  return (
    <Select
      name="festivalRoot"
      items={
        festivalRoots?.data
          .map(item => ({
            id: item.id,
            name: item.name,
            count: facetCounts[item.id] ?? 0,
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

type FestivalRootFilterProps = {
  values: number[] | null
  onSubmit: (value: number[]) => void
  facetCounts: Record<number, number>
}

export const FestivalRootFilter = ({
  values: submittedValues,
  onSubmit,
  facetCounts,
}: FestivalRootFilterProps) => {
  const { data: festivalRoots } = useFestivalRoots({
    ids: submittedValues,
    enabled: !!submittedValues?.length,
  })
  const [selectedIds, setSelectedIds] = useState<number[]>(submittedValues ?? [])
  const t = useTranslations('FestivalRootFilter')

  useEffect(() => {
    setSelectedIds(submittedValues ?? [])
  }, [submittedValues])
  return (
    <FilterButton
      label={t('festival')}
      items={festivalRoots?.data}
      selectedIds={selectedIds}
      submittedValues={submittedValues}
      onSubmit={onSubmit}
    >
      {({ isOpen }) => (
        <FestivalRootSelect
          values={selectedIds}
          onValuesChange={setSelectedIds}
          facetCounts={facetCounts}
          enabled={isOpen}
        />
      )}
    </FilterButton>
  )
}
