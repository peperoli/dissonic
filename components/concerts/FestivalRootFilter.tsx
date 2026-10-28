import { useEffect, useState } from 'react'
import { FilterButton } from './../FilterButton'
import { Select } from '../forms/Select'
import { useFestivalRoots } from '../../hooks/concerts/useFestivalRoots'
import { useTranslations } from 'next-intl'
import { useSearchFacet } from '@/hooks/search/useSearchFacet'
import { AlgoliaIndex, parseFacetValue } from '@/lib/algolia'

type FestivalRootSelectProps = {
  values: number[]
  onValuesChange: (value: number[]) => void
  enabled: boolean
}

const FestivalRootSelect = ({ enabled, ...props }: FestivalRootSelectProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const { data: festivalRoots, isPending } = useSearchFacet(
    AlgoliaIndex.Concerts,
    'festival_root_facet',
    {
      search: searchQuery,
      enabled,
    }
  )
  return (
    <Select
      name="festivalRoot"
      items={
        festivalRoots
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

type FestivalRootFilterProps = {
  values: number[] | null
  onSubmit: (value: number[]) => void
}

export const FestivalRootFilter = ({
  values: submittedValues,
  onSubmit,
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
        <FestivalRootSelect values={selectedIds} onValuesChange={setSelectedIds} enabled={isOpen} />
      )}
    </FilterButton>
  )
}
