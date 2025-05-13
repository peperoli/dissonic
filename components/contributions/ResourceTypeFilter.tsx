'use client'

import { useQueryState } from 'nuqs'
import { FilterButton } from '../FilterButton'
import { Select } from '../forms/Select'
import { useTranslations } from 'next-intl'

export const ResourceTypeFilter = () => {
  const t = useTranslations('ResourceTypeFilter')
  const resourceTypeItems = [
    'all',
    'concerts',
    'bands',
    'locations',
    'festival_roots',
  ].map((value, id) => ({ id, value, name: t(value) }))
  const [selectedResourceType, setSelectedResourceType] = useQueryState('resourceType', {
    defaultValue: 'all',
    shallow: false,
  })

  return (
    <FilterButton
      label={t('resourceType')}
      items={resourceTypeItems}
      type="singleselect"
      selectedId={resourceTypeItems.findIndex(item => item.value === selectedResourceType)}
    >
      <Select
        name="sort"
        items={resourceTypeItems}
        value={resourceTypeItems.findIndex(item => item.value === selectedResourceType)}
        onValueChange={value => setSelectedResourceType(resourceTypeItems[value].value)}
        searchable={false}
      />
    </FilterButton>
  )
}
