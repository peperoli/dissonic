import { useEffect, useState } from 'react'
import { FilterButton } from './../FilterButton'
import { useBands } from './../../hooks/bands/useBands'
import { Select } from '../forms/Select'

type BandMultiSelectProps = {
  values: number[]
  onValuesChange: (value: number[]) => void
}

const BandMultiSelect = ({ ...props }: BandMultiSelectProps) => {
  const { data: bands, isLoading } = useBands()
  return (
    <Select
      name="band"
      items={bands?.data}
      isLoading={isLoading}
      multiple
      fixedHeight
      {...props}
    />
  )
}

type BandFilterProps = {
  values: number[] | null
  onSubmit: (value: number[]) => void
}

export const BandFilter = ({ values: submittedValues, onSubmit }: BandFilterProps) => {
  const { data: bands } = useBands(null, { filter: { ids: submittedValues } })
  const [selectedIds, setSelectedIds] = useState<number[]>(submittedValues ?? [])

  useEffect(() => {
    setSelectedIds(submittedValues ?? [])
  }, [submittedValues])
  return (
    <FilterButton
      label="Band"
      items={bands?.data}
      selectedIds={selectedIds}
      submittedValues={submittedValues}
      onSubmit={onSubmit}
    >
      <BandMultiSelect values={selectedIds} onValuesChange={setSelectedIds} />
    </FilterButton>
  )
}
