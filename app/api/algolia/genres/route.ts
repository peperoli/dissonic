import { AlgoliaIndex } from '@/lib/algolia'
import { GenreRecord } from '@/types/algolia'
import { createAlgoliaClient } from '@/utils/algolia/server'
import { createClient } from '@/utils/supabase/server'

const INDEX_NAME = AlgoliaIndex.Genres

export async function GET() {
  const supabase = await createClient()
  const algolia = await createAlgoliaClient()

  const { count, error: countError } = await supabase
    .from('genres')
    .select('*', { count: 'exact', head: true })

  if (countError) {
    console.error('Error counting genres:', countError)
    return new Response('Failed to count genres', { status: 500 })
  }

  const ROWS_PER_PAGE = 1000
  const maxPage = count ? Math.ceil(count / ROWS_PER_PAGE) : 1
  const filterQueries = []

  for (let page = 1; page <= maxPage; page++) {
    const query = supabase
      .from('genres')
      .select('id, name')
      .range((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE - 1)

    filterQueries.push(query)
  }

  const responses = await Promise.all(filterQueries)

  if (responses.some(({ error }) => error)) {
    console.error(
      'Error fetching genres:',
      responses.find(({ error }) => error)
    )
    return new Response('Failed to fetch genres', { status: 500 })
  }

  const genres = responses.flatMap(({ data }) => data || [])

  const algoliaRecords: GenreRecord[] = genres.map(genre => ({
    objectID: `${INDEX_NAME}-${genre.id}`,
    type: INDEX_NAME,
    ...genre,
  }))

  try {
    await algolia.replaceAllObjects({
      indexName: INDEX_NAME,
      objects: algoliaRecords,
    })
    await algolia.setSettings({
      indexName: INDEX_NAME,
      indexSettings: {
        searchableAttributes: ['name'],
        customRanking: ['asc(name)'],
      },
    })
    return new Response(`Successfully saved ${algoliaRecords.length} records!`, { status: 200 })
  } catch (err) {
    console.error('Error indexing objects:', err)
    return new Response('Failed to index objects', { status: 500 })
  }
}
