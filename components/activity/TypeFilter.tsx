'use client'

import { parseAsArrayOf, parseAsInteger, useQueryState } from 'nuqs'
import { Select } from '../forms/Select'
import { FilterButton } from '../FilterButton'
import { useState } from 'react'

export const typeItems = [
  { id: 0, value: 'j_bands_seen', name: 'Erlebte Bands' },
  { id: 1, value: 'comments', name: 'Kommentare' },
  { id: 2, value: 'friends', name: 'Freunde' },
]

export const TypeFilter = () => {
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [selectedTypes, setSelectedTypes] = useQueryState(
    'type',
    parseAsArrayOf(parseAsInteger).withOptions({ shallow: false })
  )
  return (
    <FilterButton
      label="Aktivitätstyp"
      items={typeItems}
      type="multiselect"
      selectedIds={selectedIds}
      submittedValues={selectedTypes}
      onSubmit={() => setSelectedTypes(selectedIds)}
    >
      <Select
        name="type"
        items={typeItems}
        multiple
        values={selectedIds}
        onValuesChange={setSelectedIds}
        searchable={false}
      />
    </FilterButton>
  )
}
