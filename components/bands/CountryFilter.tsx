import { useEffect, useState } from 'react'
import { FilterButton } from './../FilterButton'
import { useCountries } from './../../hooks/useCountries'
import { Select } from '../forms/Select'

type CountryMultiSelectProps = {
  selectedOptions: number[]
  setSelectedOptions: (value: number[]) => void
}

const CountryMultiSelect = ({ selectedOptions, setSelectedOptions }: CountryMultiSelectProps) => {
  const { data: countries, isLoading } = useCountries()
  const regionNames = new Intl.DisplayNames('de', { type: 'region' })
  return (
    <Select
      name="Land"
      items={countries?.map(item => ({
        id: item.id,
        name: regionNames.of(item.iso2) ?? item.iso2,
      }))}
      isLoading={isLoading}
      multiple
      values={selectedOptions}
      onValuesChange={setSelectedOptions}
      fixedHeight
    />
  )
}

type CountryFilterProps = {
  values: number[] | null
  onSubmit: (value: number[]) => void
}

export const CountryFilter = ({ values: submittedValues, onSubmit }: CountryFilterProps) => {
  const { data: countries } = useCountries({ ids: submittedValues })
  const [selectedIds, setSelectedIds] = useState(submittedValues ?? [])

  useEffect(() => {
    setSelectedIds(submittedValues ?? [])
  }, [submittedValues])
  return (
    <FilterButton
      label="Land"
      items={countries?.map(country => ({ id: country.id, name: country.iso2 }))}
      selectedIds={selectedIds}
      submittedValues={submittedValues}
      onSubmit={onSubmit}
    >
      <CountryMultiSelect selectedOptions={selectedIds} setSelectedOptions={setSelectedIds} />
    </FilterButton>
  )
}
