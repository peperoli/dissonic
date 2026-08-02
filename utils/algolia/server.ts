import { searchClient } from '@algolia/client-search'

export async function createAlgoliaClient() {
  return searchClient(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.ALGOLIA_WRITE_API_KEY)
}
