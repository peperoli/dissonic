import { Control, Controller, FieldError, Merge } from 'react-hook-form'
import { SelectField } from '../forms/SelectField'
import { getCountryName } from '@/lib/getCountryName'
import { useSearchCountries } from '@/hooks/countries/useSearchCountries'
import { useState } from 'react'
import { useLocale } from 'next-intl'
import { LocationFields } from './Form'

export function CountrySelectField({
  control,
  ...props
}: {
  control: Control<LocationFields, unknown, LocationFields>
  label: string
  error?: Merge<FieldError, unknown>
}) {
  const [countriesSearchQuery, setCountriesSearchQuery] = useState('')
  const [size, setSize] = useState(50)
  const { data: countries } = useSearchCountries({ search: countriesSearchQuery, size })
  const locale = useLocale()

  return (
    <Controller
      name="country"
      control={control}
      rules={{ required: true }}
      render={({ field: { value = null, onChange } }) => (
        <SelectField<string>
          name="country"
          value={value}
          onValueChange={onChange}
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
