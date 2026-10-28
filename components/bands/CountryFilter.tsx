import { useEffect, useState } from 'react'
import { FilterButton } from './../FilterButton'
import { Select } from '../forms/Select'
import { useLocale, useTranslations } from 'next-intl'
import { getCountryName } from '@/lib/getCountryName'
import { useSearchCountries } from '@/hooks/countries/useSearchCountries'
import { useSearchFacet } from '@/hooks/search/useSearchFacet'
import { AlgoliaIndex } from '@/lib/algolia'

type IndexName = AlgoliaIndex.Bands | AlgoliaIndex.Locations
type FacetName = `countries_facet.${string}` | `country_facet.${string}`

const CountryMultiSelect = ({
  indexName,
  facetName,
  selectedOptions,
  setSelectedOptions,
  enabled,
}: {
  indexName: IndexName
  facetName: FacetName
  selectedOptions: string[]
  setSelectedOptions: (value: string[]) => void
  enabled: boolean
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const { data: countries, isPending } = useSearchFacet(indexName, facetName, {
    search: searchQuery,
    enabled,
  })
  return (
    <Select<string>
      name="Land"
      items={
        countries
          ?.map(item => {
            const [iso2, name] = item.value.split('||')
            return {
              id: iso2,
              name: name,
              count: item.count,
            }
          })
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
  indexName,
  facetName,
  values: submittedValues,
  onSubmit,
}: {
  indexName: IndexName
  facetName: FacetName
  values: string[] | null
  onSubmit: (value: string[]) => void
}) => {
  const { data: countries } = useSearchCountries({
    iso2: submittedValues,
    enabled: !!submittedValues?.length,
  })
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
      {({ isOpen }) => (
        <CountryMultiSelect
          indexName={indexName}
          facetName={facetName}
          selectedOptions={selectedIds}
          setSelectedOptions={setSelectedIds}
          enabled={isOpen}
        />
      )}
    </FilterButton>
  )
}
