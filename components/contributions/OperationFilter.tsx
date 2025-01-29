'use client'

import { useQueryState } from 'nuqs'
import { FilterButton } from '../FilterButton'
import { Select } from '../forms/Select'
import { useTranslations } from 'next-intl'

export const OperationFilter = () => {
  const t = useTranslations('OperationFilter')
  const operationItems = [
    { id: 0, value: 'all', name: t('all') },
    { id: 1, value: 'INSERT', name: t('insert') },
    { id: 2, value: 'UPDATE', name: t('update') },
    { id: 3, value: 'ARCHIVE', name: t('archive') },
    { id: 4, value: 'RESTORE', name: t('restore') },
    { id: 5, value: 'DELETE', name: t('delete') },
  ]
  const [selectedOperation, setSelectedOperation] = useQueryState('operation', {
    defaultValue: 'all',
    shallow: false,
  })

  return (
    <FilterButton
      label={t('operation')}
      items={operationItems}
      type="singleselect"
      selectedId={operationItems.findIndex(item => item.value === selectedOperation)}
    >
      <Select
        name="sort"
        items={operationItems}
        value={operationItems.findIndex(item => item.value === selectedOperation)}
        onValueChange={value => setSelectedOperation(operationItems[value].value)}
        searchable={false}
      />
    </FilterButton>
  )
}
