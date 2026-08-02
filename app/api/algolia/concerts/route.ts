import { AlgoliaIndex } from '@/lib/algolia'
import { getUnixTimestamp } from '@/lib/date'
import { ConcertRecord } from '@/types/algolia'
import { createAlgoliaClient } from '@/utils/algolia/server'
import { createClient } from '@/utils/supabase/server'

const INDEX_NAME = AlgoliaIndex.Concerts

export async function GET() {
  const supabase = await createClient()
  const algolia = await createAlgoliaClient()

  const { count, error: countError } = await supabase
    .from('concerts')
    .select('*', { count: 'exact', head: true })

  if (countError) {
    console.error('Error counting concerts:', countError)
    return new Response('Failed to count concerts', { status: 500 })
  }

  const ROWS_PER_PAGE = 1000
  const maxPage = count ? Math.ceil(count / ROWS_PER_PAGE) : 1
  const filterQueries = []

  for (let page = 1; page <= maxPage; page++) {
    const query = supabase
      .from('concerts')
      .select(
        `id,
        festival_root:festival_roots(id, name),
        date_start,
        date_end,
        bands:j_concert_bands(item_index, ...bands(id, name, alt_names, spotify_artist_id, spotify_artist_images)),
        bands_seen:j_bands_seen(user_id),
        location:locations(id, name, alt_names, city),
        name`
      )
      .neq('is_archived', true)
      .order('item_index', { referencedTable: 'j_concert_bands', ascending: true })
      .range((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE - 1)

    filterQueries.push(query)
  }

  const responses = await Promise.all(filterQueries)

  if (responses.some(({ error }) => error)) {
    console.error(
      'Error fetching concerts:',
      responses.find(({ error }) => error)
    )
    return new Response('Failed to fetch concerts', { status: 500 })
  }

  const concerts = responses.flatMap(({ data }) => data || [])

  const algoliaRecords: ConcertRecord[] = concerts.map(concert => ({
    objectID: `${INDEX_NAME}-${concert.id}`,
    type: INDEX_NAME,
    ...concert,
    date_start_unix: getUnixTimestamp(concert.date_start),
    date_end_unix: concert.date_end ? getUnixTimestamp(concert.date_end) : null,
    bands: concert.bands.map((band, index) => ({
      id: band.id,
      name: band.name,
      alt_names: band.alt_names,
      spotify_artist_id: index === 0 ? band.spotify_artist_id : null,
      spotify_artist_images: index === 0 ? band.spotify_artist_images : null,
    })),
    bands_count: concert.bands.length,
    fan_ids: [...new Set(concert.bands_seen.map(bandSeen => bandSeen.user_id))],
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
          'festival_root.name',
          'date_start',
          'date_end',
          'bands.name',
          'bands.alt_names',
          'location.name',
          'location.alt_names',
          'name',
        ],
        attributesForFaceting: ['date_start_unix', 'bands.id', 'location.id', 'festival_root.id', 'fan_ids'],
        customRanking: ['desc(date_start_unix)'],
        replicas: ['date_start_unix_asc', 'bands_count_desc', 'bands_count_asc'],
      },
    })
    return new Response(`Successfully saved ${algoliaRecords.length} records!`, { status: 200 })
  } catch (err) {
    console.error('Error indexing objects:', err)
    return new Response('Failed to index objects', { status: 500 })
  }
}
