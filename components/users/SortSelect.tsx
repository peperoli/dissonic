'use client'

import { parseAsBoolean, parseAsStringLiteral, useQueryStates } from 'nuqs'
import { Select } from '../forms/Select'
import { FilterButton } from '../FilterButton'

export const SortSelect = () => {
  const sortBy = ['username', 'concert_count', 'band_count', 'created_at'] as const
  const [sort, setSort] = useQueryStates(
    {
      sort_by: parseAsStringLiteral(sortBy).withDefault('concert_count'),
      sort_asc: parseAsBoolean.withDefault(false),
    },
    { shallow: false }
  )
  const sortItems = [
    { id: 0, value: 'concert_count,false', name: 'Meiste Konzerte' },
    { id: 1, value: 'concert_count,true', name: 'Wenigste Konzerte' },
    { id: 2, value: 'band_count,false', name: 'Meiste Bands' },
    { id: 3, value: 'band_count,true', name: 'Wenigste Bands' },
    { id: 4, value: 'created_at,false', name: 'Neuste' },
    { id: 5, value: 'created_at,true', name: 'Älteste' },
  ]
  return (
    <FilterButton
      label="Sortieren nach"
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
