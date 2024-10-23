'use client'

import { useQueryState } from 'nuqs'
import { FilterButton } from '../FilterButton'
import { Select } from '../forms/Select'

export const activityTypeItems = [
  { id: 0, value: 'all', name: 'Alle' },
  { id: 1, value: 'j_bands_seen', name: 'Erlebte Bands' },
  { id: 2, value: 'comments', name: 'Kommentare' },
  { id: 3, value: 'friends', name: 'Freundesaktionen' },
]

export const ActivityTypeFilter = () => {
  const [selectedActivityType, setSelectedActivityType] = useQueryState('activityType', {
    defaultValue: 'all',
    shallow: false,
  })
  return (
    <FilterButton
      label="Aktivitätstyp"
      items={activityTypeItems}
      type="singleselect"
      selectedId={activityTypeItems.findIndex(item => item.value === selectedActivityType)}
    >
      <Select
        name="sort"
        items={activityTypeItems}
        value={activityTypeItems.findIndex(item => item.value === selectedActivityType)}
        onValueChange={value => setSelectedActivityType(activityTypeItems[value].value)}
        searchable={false}
      />
    </FilterButton>
  )
}
