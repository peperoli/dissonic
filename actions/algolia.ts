'use server'

import { Database } from '@/types/supabase'
import { algoliasearch } from 'algoliasearch'

const INDEX_NAME = 'global_index'

export async function addSearchRecord(
  record: Database['public']['Views']['search_records']['Row']
) {
  const algolia = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.ALGOLIA_WRITE_API_KEY
  )

  const algoliaRecord = {
    objectID: `${record.type}-${record.id}`,
    ...record,
  }

  await algolia.saveObject({
    indexName: INDEX_NAME,
    body: algoliaRecord,
  })
}

export async function editSearchRecord(
  objectID: string,
  record: Partial<Database['public']['Views']['search_records']['Row']>
) {
  const algolia = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.ALGOLIA_WRITE_API_KEY
  )

  await algolia.partialUpdateObject({
    indexName: INDEX_NAME,
    objectID,
    attributesToUpdate: record,
    createIfNotExists: false,
  })
}

export async function deleteSearchRecord(objectID: string) {
  const algolia = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.ALGOLIA_WRITE_API_KEY
  )

  await algolia.deleteObject({
    indexName: INDEX_NAME,
    objectID,
  })
}
