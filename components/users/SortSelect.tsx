'use client'

import { parseAsBoolean, parseAsStringLiteral, useQueryStates } from 'nuqs'
import { Select } from '../forms/Select'
import { FilterButton } from '../FilterButton'
import { useTranslations } from 'next-intl'

export const SortSelect = () => {
  const sortBy = ['username', 'concert_count', 'band_count', 'created_at'] as const
  const [sort, setSort] = useQueryStates(
    {
      sort_by: parseAsStringLiteral(sortBy).withDefault('concert_count'),
      sort_asc: parseAsBoolean.withDefault(false),
    },
    { shallow: false }
  )
  const t = useTranslations('SortSelect')
  const sortItems = [
    { id: 0, value: 'concert_count,false', name: t('mostConcerts') },
    { id: 1, value: 'concert_count,true', name: t('fewestConcerts') },
    { id: 2, value: 'band_count,false', name: t('mostBands') },
    { id: 3, value: 'band_count,true', name: t('fewestBands') },
    { id: 4, value: 'created_at,false', name: t('newest') },
    { id: 5, value: 'created_at,true', name: t('oldest') },
  ]
  return (
    <FilterButton
      label={t('sortBy')}
      items={sortItems}
      type="singleselect"
      selectedId={sortItems.findIndex(item => item.value === `${sort.sort_by},${sort.sort_asc}`)}
    >
      <Select
        name="sort"
        items={sortItems}
        value={sortItems.findIndex(item => item.value === `${sort.sort_by},${sort.sort_asc}`)}
        onValueChange={value =>
          setSort({
            sort_by: sortItems[value].value.split(',')[0] as (typeof sortBy)[number],
            sort_asc: sortItems[value].value.split(',')[1] === 'true',
          })
        }
        searchable={false}
      />
    </FilterButton>
  )
}
