import { useEffect, useState } from 'react'
import { FilterButton } from './../FilterButton'
import { Select } from '../forms/Select'
import { useLocale, useTranslations } from 'next-intl'
import { getCountryName } from '@/lib/getCountryName'
import { useSearchCountries } from '@/hooks/countries/useSearchCountries'

const CountryMultiSelect = ({
  selectedOptions,
  setSelectedOptions,
  facetCounts,
}: {
  selectedOptions: string[]
  setSelectedOptions: (value: string[]) => void
  facetCounts: Record<string, number>
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const { data: countries, isPending } = useSearchCountries({ search: searchQuery })
  const locale = useLocale()
  return (
    <Select<string>
      name="Land"
      items={
        countries
          ?.data.map(item => ({
            id: item.iso2,
            name: getCountryName(item.iso2, locale) ?? item.iso2,
            count: facetCounts[item.iso2] ?? 0,
          }))
          .sort((a, b) => b.count - a.count) ?? []
      }
      searchable
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      isLoading={isPending}
      multiple
      values={selectedOptions}
      onValuesChange={setSelectedOptions}
      fixedHeight
    />
  )
}

export const CountryFilter = ({
  values: submittedValues,
  onSubmit,
  facetCounts,
}: {
  values: string[] | null
  onSubmit: (value: string[]) => void
  facetCounts: Record<string, number>
}) => {
  const { data: countries } = useSearchCountries({ iso2: submittedValues ?? [] })
  const [selectedIds, setSelectedIds] = useState(submittedValues ?? [])
  const t = useTranslations('CountryFilter')
  const locale = useLocale()

  useEffect(() => {
    setSelectedIds(submittedValues ?? [])
  }, [submittedValues])
  return (
    <FilterButton
      label={t('country')}
      items={countries?.data.map(country => ({
        id: country.iso2,
        name: getCountryName(country.iso2, locale),
      }))}
      selectedIds={selectedIds}
      submittedValues={submittedValues}
      onSubmit={onSubmit}
    >
      <CountryMultiSelect
        selectedOptions={selectedIds}
        setSelectedOptions={setSelectedIds}
        facetCounts={facetCounts}
      />
    </FilterButton>
  )
}
