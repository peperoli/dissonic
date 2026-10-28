import { Control, Controller, FieldError, Merge } from 'react-hook-form'
import { SelectField } from '../forms/SelectField'
import { getCountryName } from '@/lib/getCountryName'
import { useSearchCountries } from '@/hooks/countries/useSearchCountries'
import { useState } from 'react'
import { useLocale } from 'next-intl'
import { BandFields } from './Form'

export function CountriesSelectField({
  control,
  ...props
}: {
  control: Control<BandFields, unknown, BandFields>
  label: string
  error?: Merge<FieldError, unknown>
}) {
  const [countriesSearchQuery, setCountriesSearchQuery] = useState('')
  const [size, setSize] = useState(50)
  const { data: countries } = useSearchCountries({ search: countriesSearchQuery, size })
  const locale = useLocale()

  return (
    <Controller
      name="countries"
      control={control}
      rules={{ required: true }}
      render={({ field: { value = [], onChange } }) => (
        <SelectField<string>
          name="countries"
          multiple={true}
          values={value}
          onValuesChange={onChange}
          items={
            countries?.data.map(item => ({
              id: item.iso2,
              name: getCountryName(item.iso2, locale) ?? item.iso2,
            })) ?? []
          }
          searchable
          searchQuery={countriesSearchQuery}
          setSearchQuery={setCountriesSearchQuery}
          onScrollToEnd={() => setSize(prevSize => prevSize + 50)}
          {...props}
        />
      )}
    />
  )
}
