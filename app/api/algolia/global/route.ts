import { createAlgoliaClient } from '@/utils/algolia/server'
import { createClient } from '@/utils/supabase/server'

const INDEX_NAME = 'global_index'

export async function GET() {
  const supabase = await createClient()
  const algolia = await createAlgoliaClient()

  const { count, error: countError } = await supabase
    .from('search_records')
    .select('*', { count: 'exact', head: true })

  if (countError) {
    console.error('Error counting search records:', countError)
    return new Response('Failed to count search records', { status: 500 })
  }

  const ROWS_PER_PAGE = 1000
  const maxPage = count ? Math.ceil(count / ROWS_PER_PAGE) : 1
  const filterQueries = []

  for (let page = 1; page <= maxPage; page++) {
    const query = supabase
      .from('search_records')
      .select('*')
      .range((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE - 1)

    filterQueries.push(query)
  }

  const responses = await Promise.all(filterQueries)

  if (responses.some(({ error }) => error)) {
    console.error(
      'Error fetching search records:',
      responses.find(({ error }) => error)
    )
    return new Response('Failed to fetch search records', { status: 500 })
  }

  const searchRecords = responses.flatMap(({ data }) => data || [])

  const algoliaRecords = searchRecords.map(record => ({
    objectID: `${record.type}-${record.id}`,
    ...record,
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
          'bands',
          'location',
          'genres',
          'festival_root',
          'city',
          'country',
          'date_start',
          'date_end',
        ],
        attributesForFaceting: ['type'],
      },
    })
    return new Response(`Successfully saved ${algoliaRecords.length} records!`, { status: 200 })
  } catch (err) {
    console.error('Error indexing objects:', err)
    return new Response('Failed to index objects', { status: 500 })
  }
}
