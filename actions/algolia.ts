'use server'

import { Database } from '@/types/supabase'
import type { AddBand, EditBand } from '@/types/types'
import { BandRecord } from '@/types/algolia'
import { createAlgoliaClient } from '@/utils/algolia/server'

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
      country: {
        iso2: record.country?.iso2,
        name_de: record.country?.iso2 ? regionNamesDe.of(record.country.iso2) : null,
        name_en: record.country?.iso2 ? regionNamesEn.of(record.country.iso2) : null,
      },
      genres: record.genres,
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
      country: {
        iso2: record.country?.iso2,
        name_de: record.country?.iso2 ? regionNamesDe.of(record.country.iso2) : null,
        name_en: record.country?.iso2 ? regionNamesEn.of(record.country.iso2) : null,
      },
      genres: record.genres,
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
