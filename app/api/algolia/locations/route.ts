import { LocationRecord } from '@/types/algolia'
import { createAlgoliaClient } from '@/utils/algolia/server'
import { createClient } from '@/utils/supabase/server'

const INDEX_NAME = 'locations'

export async function GET() {
  const supabase = await createClient()
  const algolia = await createAlgoliaClient()

  const { count, error: countError } = await supabase
    .from('locations')
    .select('*', { count: 'exact', head: true })

  if (countError) {
    console.error('Error counting locations:', countError)
    return new Response('Failed to count locations', { status: 500 })
  }

  const ROWS_PER_PAGE = 1000
  const maxPage = count ? Math.ceil(count / ROWS_PER_PAGE) : 1
  const filterQueries = []

  for (let page = 1; page <= maxPage; page++) {
    const query = supabase
      .from('locations')
      .select(
        `id,
        name,
        alt_names,
        zip_code,
        city,
        country:countries(id, iso2),
        image,
        updated_at`
      )
      .neq('is_archived', true)
      .range((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE - 1)

    filterQueries.push(query)
  }

  const responses = await Promise.all(filterQueries)

  if (responses.some(({ error }) => error)) {
    console.error(
      'Error fetching locations:',
      responses.find(({ error }) => error)
    )
    return new Response('Failed to fetch locations', { status: 500 })
  }

  const locations = responses.flatMap(({ data }) => data || [])
  const regionNamesDe = new Intl.DisplayNames('de', { type: 'region' })
  const regionNamesEn = new Intl.DisplayNames('en', { type: 'region' })

  const algoliaRecords: LocationRecord[] = locations.map(location => ({
    objectID: location.id.toString(),
    ...location,
    country: location.country
      ? {
          ...location.country,
          name_de: regionNamesDe.of(location.country.iso2) ?? null,
          name_en: regionNamesEn.of(location.country.iso2) ?? null,
        }
      : null,
  }))

  try {
    await algolia.replaceAllObjects({
      indexName: INDEX_NAME,
      objects: algoliaRecords,
    })
    await algolia.setSettings({
      indexName: INDEX_NAME,
      indexSettings: {
        searchableAttributes: [
          'name',
          'alt_names',
          'zip_code',
          'city',
          'country.name_de',
          'country.name_en',
        ],
        attributesForFaceting: [
          'country.id',
          'searchable(country.name_de)',
          'searchable(country.name_en)',
        ],
        customRanking: ['asc(name)'],
      },
    })
    return new Response(`Successfully saved ${algoliaRecords.length} records!`, { status: 200 })
  } catch (err) {
    console.error('Error indexing objects:', err)
    return new Response('Failed to index objects', { status: 500 })
  }
}
