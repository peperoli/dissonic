import { AlgoliaIndex } from '@/lib/algolia'
import { getCountryName } from '@/lib/getCountryName'
import { CountryRecord } from '@/types/algolia'
import { createAlgoliaClient } from '@/utils/algolia/server'

const INDEX_NAME = AlgoliaIndex.Countries

export async function GET() {
  const algolia = await createAlgoliaClient()

  const searchParams = new URLSearchParams({
    fields: 'name,alpha2Code',
    sort: 'name',
  })

  const response = await fetch(`https://countries.dev/countries?${searchParams.toString()}`, {
    method: 'GET',
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Error fetching countries:', errorText)
    return new Response('Failed to fetch countries', { status: 500 })
  }

  const countries: { name: string; alpha2Code: string }[] = await response.json()

  const algoliaRecords: CountryRecord[] = countries.map(country => ({
    objectID: `${INDEX_NAME}-${country.alpha2Code}`,
    type: INDEX_NAME,
    iso2: country.alpha2Code,
    names: {
      de: getCountryName(country.alpha2Code, 'de') ?? null,
      en: getCountryName(country.alpha2Code, 'en') ?? null,
    },
  }))

  try {
    await algolia.replaceAllObjects({
      indexName: INDEX_NAME,
      objects: algoliaRecords,
    })
    await algolia.setSettings({
      indexName: INDEX_NAME,
      indexSettings: {
        searchableAttributes: ['names.de', 'names.en'],
        customRanking: ['asc(names.en)'],
      },
    })
    return new Response(`Successfully saved ${algoliaRecords.length} records!`, { status: 200 })
  } catch (err) {
    console.error('Error indexing objects:', err)
    return new Response('Failed to index objects', { status: 500 })
  }
}
