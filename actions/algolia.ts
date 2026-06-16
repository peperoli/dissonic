'use server'

import { Database } from '@/types/supabase'
import { searchClient } from '@algolia/client-search'
import type { AddBand, EditBand } from '@/types/types'
import { BandRecord } from '@/types/algolia'

async function createAlgoliaClient() {
  return searchClient(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.ALGOLIA_WRITE_API_KEY)
}

export async function addGlobalRecord(
  record: Database['public']['Views']['search_records']['Row']
) {
  const algolia = await createAlgoliaClient()

  const algoliaRecord = {
    objectID: `${record.type}-${record.id}`,
    ...record,
  }

  await algolia.saveObject({
    indexName: 'global_index',
    body: algoliaRecord,
  })
}

export async function addBandRecord(
  record: AddBand & { id: number; country?: { iso2: string } | null }
) {
  const algolia = await createAlgoliaClient()
  const regionNamesDe = new Intl.DisplayNames('de', { type: 'region' })
  const regionNamesEn = new Intl.DisplayNames('en', { type: 'region' })

  await algolia.saveObject({
    indexName: 'bands',
    body: {
      objectID: record.id.toString(),
      id: record.id,
      name: record.name,
      alt_names: record.alt_names,
      country_de: record.country?.iso2 ? regionNamesDe.of(record.country.iso2) : null,
      country_en: record.country?.iso2 ? regionNamesEn.of(record.country.iso2) : null,
      genres: record.genres.map(genre => genre.name),
      spotify_artist_id: record.spotify_artist_id,
      spotify_artist_images: record.spotify_artist_images,
    } as BandRecord,
  })
}

export async function editGlobalRecord(
  objectID: string,
  record: Partial<Database['public']['Views']['search_records']['Row']>
) {
  const algolia = await createAlgoliaClient()

  await algolia.partialUpdateObject({
    indexName: 'global_index',
    objectID,
    attributesToUpdate: record,
    createIfNotExists: false,
  })
}

export async function editBandRecord(
  objectID: string,
  record: EditBand & { id: number; country?: { iso2: string } | null }
) {
  const algolia = await createAlgoliaClient()
  const regionNamesDe = new Intl.DisplayNames('de', { type: 'region' })
  const regionNamesEn = new Intl.DisplayNames('en', { type: 'region' })

  await algolia.partialUpdateObject({
    indexName: 'bands',
    objectID,
    attributesToUpdate: {
      name: record.name,
      alt_names: record.alt_names,
      country_de: record.country?.iso2 ? regionNamesDe.of(record.country.iso2) : null,
      country_en: record.country?.iso2 ? regionNamesEn.of(record.country.iso2) : null,
      genres: record.genres.map(genre => genre.name),
      spotify_artist_id: record.spotify_artist_id,
      spotify_artist_images: record.spotify_artist_images,
    } as BandRecord,
    createIfNotExists: false,
  })
}

export async function deleteSearchRecord(indexName: 'global_index' | 'bands', objectID: string) {
  const algolia = await createAlgoliaClient()

  await algolia.deleteObject({
    indexName,
    objectID,
  })
}
