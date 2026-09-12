import { useEffect, useState } from 'react'
import { FilterButton } from './../FilterButton'
import { useCountries } from './../../hooks/useCountries'
import { Select } from '../forms/Select'
import { useLocale, useTranslations } from 'next-intl'
import { Country } from '@/types/types'

const CountryMultiSelect = <TId extends string | number = number>({
  selectedOptions,
  setSelectedOptions,
  facetCounts,
  getId,
  getFacetKey,
}: {
  selectedOptions: TId[]
  setSelectedOptions: (value: TId[]) => void
  facetCounts: Record<string, number>
  getId: (country: Country) => TId
  getFacetKey: (country: Country) => string
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const { data: countries, isPending } = useCountries({ search: searchQuery })
  const locale = useLocale()
  const regionNames = new Intl.DisplayNames(locale, { type: 'region' })
  return (
    <Select<TId>
      name="Land"
      items={
        countries
          ?.map(item => ({
            id: getId(item),
            name: regionNames.of(item.iso2) ?? item.iso2,
            count: facetCounts[getFacetKey(item)] ?? 0,
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

export const CountryFilter = <TId extends string | number = number>({
  values: submittedValues,
  onSubmit,
  facetCounts,
  idType = 'id',
}: {
  values: TId[] | null
  onSubmit: (value: TId[]) => void
  facetCounts: Record<string, number>
  idType?: 'id' | 'iso2'
}) => {
  const { data: countries } = useCountries(
    idType === 'iso2'
      ? { iso2: submittedValues as string[] | null }
      : { ids: submittedValues as number[] | null }
  )
  const [selectedIds, setSelectedIds] = useState(submittedValues ?? [])
  const t = useTranslations('CountryFilter')
  const getCountryId = (country: Country) => (idType === 'iso2' ? country.iso2 : country.id) as TId
  const getFacetKey = (country: Country) => (idType === 'iso2' ? country.iso2 : String(country.id))

  useEffect(() => {
    setSelectedIds(submittedValues ?? [])
  }, [submittedValues])
  return (
    <FilterButton
      label={t('country')}
      items={countries?.map(country => ({
        id: getCountryId(country),
        name: country.iso2,
      }))}
      selectedIds={selectedIds}
      submittedValues={submittedValues}
      onSubmit={onSubmit}
    >
      <CountryMultiSelect
        selectedOptions={selectedIds}
        setSelectedOptions={setSelectedIds}
        facetCounts={facetCounts}
        getId={getCountryId}
        getFacetKey={getFacetKey}
      />
    </FilterButton>
  )
}
