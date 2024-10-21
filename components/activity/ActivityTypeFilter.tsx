'use client'

import { useQueryState } from 'nuqs'
import { SegmentedControl } from '../controls/SegmentedControl'

export const activityTypeItems = [
  { value: 'all', label: 'Alle' },
  { value: 'j_bands_seen', label: 'Erlebte Bands' },
  { value: 'comments', label: 'Kommentare' },
  { value: 'friends', label: 'Freunde' },
]

export const ActivityTypeFilter = () => {
  const [selectedActivityType, setSelectedActivityType] = useQueryState('activityType', {
    defaultValue: 'all',
    shallow: false,
  })
  return (
    <SegmentedControl
      options={activityTypeItems}
      value={selectedActivityType}
      onValueChange={setSelectedActivityType}
    />
  )
}
