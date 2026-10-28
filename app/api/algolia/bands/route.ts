import { AlgoliaIndex } from '@/lib/algolia'
import { BandRecord } from '@/types/algolia'
import { createAlgoliaClient } from '@/utils/algolia/server'
import { createClient } from '@/utils/supabase/server'

const INDEX_NAME = AlgoliaIndex.Bands

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
        countries_iso2,
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
    objectID: `${INDEX_NAME}-${band.id}`,
    type: INDEX_NAME,
    ...band,
    countries_facet: band.countries_iso2.map(iso2 => ({
      de: `${iso2}||${regionNamesDe.of(iso2)}`,
      en: `${iso2}||${regionNamesEn.of(iso2)}`,
    })),
    genres_facet: band.genres.map(genre => `${genre.id}||${genre.name}` as const),
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
          'countries_facet.de',
          'countries_facet.en',
          'genres_facet',
        ],
        attributesForFaceting: [
          'countries_iso2',
          'searchable(countries_facet.de)',
          'searchable(countries_facet.en)',
          'genres.id',
          'searchable(genres_facet)',
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
