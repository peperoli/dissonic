import { AlgoliaIndex } from '@/lib/algolia'
import { FestivalRootRecord } from '@/types/algolia'
import { createAlgoliaClient } from '@/utils/algolia/server'
import { createClient } from '@/utils/supabase/server'

const INDEX_NAME = AlgoliaIndex.FestivalRoots

export async function GET() {
  const supabase = await createClient()
  const algolia = await createAlgoliaClient()

  const { count, error: countError } = await supabase
    .from('festival_roots')
    .select('*', { count: 'exact', head: true })

  if (countError) {
    console.error('Error counting festivalRoots:', countError)
    return new Response('Failed to count festivalRoots', { status: 500 })
  }

  const ROWS_PER_PAGE = 1000
  const maxPage = count ? Math.ceil(count / ROWS_PER_PAGE) : 1
  const filterQueries = []

  for (let page = 1; page <= maxPage; page++) {
    const query = supabase
      .from('festival_roots')
      .select(
        `id,
        name,
        default_location:locations(id, name, alt_names, city)`
      )
      .neq('is_archived', true)
      .range((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE - 1)

    filterQueries.push(query)
  }

  const responses = await Promise.all(filterQueries)

  if (responses.some(({ error }) => error)) {
    console.error(
      'Error fetching festivalRoots:',
      responses.find(({ error }) => error)
    )
    return new Response('Failed to fetch festivalRoots', { status: 500 })
  }

  const festivalRoots = responses.flatMap(({ data }) => data || [])

  const algoliaRecords: FestivalRootRecord[] = festivalRoots.map(festivalRoot => ({
    objectID: `${INDEX_NAME}-${festivalRoot.id}`,
    type: INDEX_NAME,
    ...festivalRoot,
  }))

  try {
    await algolia.replaceAllObjects({
      indexName: INDEX_NAME,
      objects: algoliaRecords,
    })
    await algolia.setSettings({
      indexName: INDEX_NAME,
      indexSettings: {
        searchableAttributes: ['name', 'default_location.name', 'default_location.alt_names', 'default_location.city'],
        attributesForFaceting: ['default_location.id'],
        customRanking: ['asc(name)'],
        decompoundedAttributes: { de: ['name'] },
      },
    })
    return new Response(`Successfully saved ${algoliaRecords.length} records!`, { status: 200 })
  } catch (err) {
    console.error('Error indexing objects:', err)
    return new Response('Failed to index objects', { status: 500 })
  }
}
