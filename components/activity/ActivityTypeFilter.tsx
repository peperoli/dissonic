'use client'

import { parseAsStringLiteral, useQueryState } from 'nuqs'
import { FilterButton } from '../FilterButton'
import { Select } from '../forms/Select'
import { useTranslations } from 'next-intl'
import { ActivityFetchOptions } from '@/types/types'

export function useActivityType() {
  const activityType = [
    'all',
    'j_bands_seen',
    'comments',
    'reactions',
    'friends',
    'profiles',
  ] as const
  return useQueryState('activityType', parseAsStringLiteral(activityType).withDefault('all'))
}

export const ActivityTypeFilter = () => {
  const t = useTranslations('ActivityTypeFilter')
  const activityTypeItems = [
    { id: 0, value: 'all', name: t('all') },
    { id: 1, value: 'j_bands_seen', name: t('bandsSeen') },
    { id: 2, value: 'comments', name: t('comments') },
    { id: 3, value: 'reactions', name: t('reactions') },
    { id: 4, value: 'friends', name: t('friendActions') },
    { id: 5, value: 'profiles', name: t('newUsers') },
  ]
  const [selectedActivityType, setSelectedActivityType] = useActivityType()

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
        onValueChange={value =>
          setSelectedActivityType(
            activityTypeItems[value].value as keyof ActivityFetchOptions['activityType']
          )
        }
        searchable={false}
      />
    </FilterButton>
  )
}
