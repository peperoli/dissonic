'use client'

import { useQueryState } from 'nuqs'
import { FilterButton } from '../FilterButton'
import { Select } from '../forms/Select'
import { useTranslations } from 'next-intl'

export const RessourceTypeFilter = () => {
  const t = useTranslations('RessourceTypeFilter')
  const ressourceTypeItems = [
    'all',
    'concerts',
    'bands',
    'locations',
    'festival_roots',
  ].map((value, id) => ({ id, value, name: t(value) }))
  const [selectedRessourceType, setSelectedRessourceType] = useQueryState('ressourceType', {
    defaultValue: 'all',
    shallow: false,
  })

  return (
    <FilterButton
      label={t('ressourceType')}
      items={ressourceTypeItems}
      type="singleselect"
      selectedId={ressourceTypeItems.findIndex(item => item.value === selectedRessourceType)}
    >
      <Select
        name="sort"
        items={ressourceTypeItems}
        value={ressourceTypeItems.findIndex(item => item.value === selectedRessourceType)}
        onValueChange={value => setSelectedRessourceType(ressourceTypeItems[value].value)}
        searchable={false}
      />
    </FilterButton>
  )
}
