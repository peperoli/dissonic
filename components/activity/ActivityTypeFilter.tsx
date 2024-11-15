'use client'

import { useQueryState } from 'nuqs'
import { FilterButton } from '../FilterButton'
import { Select } from '../forms/Select'
import { useTranslations } from 'next-intl'

export const ActivityTypeFilter = () => {
  const t = useTranslations('ActivityTypeFilter')
  const activityTypeItems = [
    { id: 0, value: 'all', name: t('all') },
    { id: 1, value: 'j_bands_seen', name: t('bandsSeen') },
    { id: 2, value: 'comments', name: t('comments') },
    { id: 3, value: 'friends', name: t('friendActions') },
  ]
  const [selectedActivityType, setSelectedActivityType] = useQueryState('activityType', {
    defaultValue: 'all',
    shallow: false,
  })
  return (
    <FilterButton
      label={t('activityType')}
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
