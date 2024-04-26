import { useEffect, useState } from 'react'
import { FilterButton } from './../FilterButton'
import { useLocations } from './../../hooks/locations/useLocations'
import { Select } from '../forms/Select'

type LocationMultiSelectProps = {
  values: number[]
  onValuesChange: (value: number[]) => void
}

const LocationMultiSelect = ({ ...props }: LocationMultiSelectProps) => {
  const { data: locations, isLoading } = useLocations()
  return (
    <Select
      name="location"
      items={locations?.data}
      isLoading={isLoading}
      multiple
      fixedHeight
      {...props}
    />
  )
}

type LocationFilterProps = {
  values: number[] | null
  onSubmit: (value: number[]) => void
}

export const LocationFilter = ({ values: submittedValues, onSubmit }: LocationFilterProps) => {
  const { data: locations } = useLocations(null, { ids: submittedValues })
  const [selectedIds, setSelectedIds] = useState(submittedValues ?? [])

  useEffect(() => {
    setSelectedIds(submittedValues ?? [])
  }, [submittedValues])
  return (
    <FilterButton
      label="Location"
      items={locations?.data}
      selectedIds={selectedIds}
      submittedValues={submittedValues}
      onSubmit={onSubmit}
    >
      <LocationMultiSelect values={selectedIds} onValuesChange={setSelectedIds} />
    </FilterButton>
  )
}
