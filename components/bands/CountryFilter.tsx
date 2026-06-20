import { useEffect, useState } from 'react'
import { FilterButton } from './../FilterButton'
import { useCountries } from './../../hooks/useCountries'
import { Select } from '../forms/Select'
import { useLocale, useTranslations } from 'next-intl'

const CountryMultiSelect = ({
  selectedOptions,
  setSelectedOptions,
  facetCounts,
}: {
  selectedOptions: number[]
  setSelectedOptions: (value: number[]) => void
  facetCounts: Record<number, number>
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const { data: countries, isPending } = useCountries({ search: searchQuery })
  const locale = useLocale()
  const regionNames = new Intl.DisplayNames(locale, { type: 'region' })
  return (
    <Select
      name="Land"
      items={countries
        ?.sort((a, b) => (facetCounts[b.id] ?? 0) - (facetCounts[a.id] ?? 0))
        .map(item => ({
          id: item.id,
          name: regionNames.of(item.iso2) ?? item.iso2,
          count: facetCounts[item.id] ?? 0,
        }))}
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
  values: number[] | null
  onSubmit: (value: number[]) => void
  facetCounts: Record<number, number>
}) => {
  const { data: countries } = useCountries({ ids: submittedValues })
  const [selectedIds, setSelectedIds] = useState(submittedValues ?? [])
  const t = useTranslations('CountryFilter')

  useEffect(() => {
    setSelectedIds(submittedValues ?? [])
  }, [submittedValues])
  return (
    <FilterButton
      label={t('country')}
      items={countries?.map(country => ({
        id: country.id,
        name: country.iso2,
        count: facetCounts[country.id] ?? 0,
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
