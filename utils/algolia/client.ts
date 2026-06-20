import { searchClient } from "@algolia/client-search";

export function createAlgoliaClient() {
  return searchClient(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY
  )
}