import { Dispatch, SetStateAction } from 'react'
import { Option } from '../../types/types'
import { FilterButton } from './../FilterButton'
import { MultiSelect } from './../MultiSelect'
import { useCountries } from './../../hooks/useCountries'

type CountryMultiSelectProps = {
  selectedOptions: Option[]
  setSelectedOptions: Dispatch<SetStateAction<Option[]>>
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
  selectedOptions: Option[]
  setSelectedOptions: Dispatch<SetStateAction<Option[]>>
}

export const CountryFilter = ({ selectedOptions, setSelectedOptions }: CountryFilterProps) => {
  return (
    <FilterButton name="Länder" selectedOptions={selectedOptions}>
      <CountryMultiSelect
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
      />
    </FilterButton>
  )
}
