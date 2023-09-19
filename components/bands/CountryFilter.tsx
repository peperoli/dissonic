import { useEffect, useState } from 'react'
import { FilterButton } from './../FilterButton'
import { MultiSelect } from './../MultiSelect'
import { useCountries } from './../../hooks/useCountries'

type CountryMultiSelectProps = {
  selectedOptions: number[]
  setSelectedOptions: (value: number[]) => void
}

const CountryMultiSelect = ({ selectedOptions, setSelectedOptions }: CountryMultiSelectProps) => {
  const { data: countries, isLoading } = useCountries()
  const regionNames = new Intl.DisplayNames('de', { type: 'region' })
  return (
    <div className="relative h-full">
      <MultiSelect
        name="Länder"
        options={countries?.map(item => ({ id: item.id, name: regionNames.of(item.iso2) ?? 'FEHLER' }))}
        isLoading={isLoading}
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
        alwaysOpen
        fullHeight
      />
    </div>
  )
}

type CountryFilterProps = {
  value?: number[]
  onSubmit: (value: number[]) => void
}

export const CountryFilter = ({ value, onSubmit }: CountryFilterProps) => {
  const [selectedOptions, setSelectedOptions] = useState(value ?? [])

  useEffect(() => {
    setSelectedOptions(value ?? [])
  }, [value])
  return (
    <FilterButton name="Länder" selectedOptions={selectedOptions} onSubmit={onSubmit}>
      <CountryMultiSelect
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
      />
    </FilterButton>
  )
}
