import { BandRecord } from '@/types/algolia'
import { createAlgoliaClient } from '@/utils/algolia/server'
import { createClient } from '@/utils/supabase/server'

const INDEX_NAME = 'bands'

export async function GET() {
  const supabase = await createClient()
  const algolia = await createAlgoliaClient()

  const { count, error: countError } = await supabase
    .from('bands')
    .select('*', { count: 'exact', head: true })

  if (countError) {
    console.error('Error counting bands:', countError)
    return new Response('Failed to count bands', { status: 500 })
  }

  const ROWS_PER_PAGE = 1000
  const maxPage = count ? Math.ceil(count / ROWS_PER_PAGE) : 1
  const filterQueries = []

  for (let page = 1; page <= maxPage; page++) {
    const query = supabase
      .from('bands')
      .select(
        `id,
        name,
        alt_names,
        country:countries(id, iso2),
        genres(id, name),
        spotify_artist_id,
        spotify_artist_images`
      )
      .neq('is_archived', true)
      .range((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE - 1)

    filterQueries.push(query)
  }

  const responses = await Promise.all(filterQueries)

  if (responses.some(({ error }) => error)) {
    console.error(
      'Error fetching bands:',
      responses.find(({ error }) => error)
    )
    return new Response('Failed to fetch bands', { status: 500 })
  }

  const bands = responses.flatMap(({ data }) => data || [])
  const regionNamesDe = new Intl.DisplayNames('de', { type: 'region' })
  const regionNamesEn = new Intl.DisplayNames('en', { type: 'region' })

  const algoliaRecords: BandRecord[] = bands.map(band => ({
    objectID: band.id.toString(),
    ...band,
    country: band.country
      ? {
          ...band.country,
          name_de: regionNamesDe.of(band.country.iso2) ?? null,
          name_en: regionNamesEn.of(band.country.iso2) ?? null,
        }
      : null,
    genres: band.genres,
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
          'country.name_de',
          'country.name_en',
          'genres.name',
        ],
        attributesForFaceting: [
          'country.id',
          'searchable(country.name_de)',
          'searchable(country.name_en)',
          'genres.id',
          'searchable(genres.name)',
        ],
      },
    })
    return new Response(`Successfully saved ${algoliaRecords.length} records!`, { status: 200 })
  } catch (err) {
    console.error('Error indexing objects:', err)
    return new Response('Failed to index objects', { status: 500 })
  }
}
