'use server'

import { Database } from '@/types/supabase'
import type { AddBand, AddLocation, EditBand, EditLocation, Nullable } from '@/types/types'
import { BandRecord, LocationRecord } from '@/types/algolia'
import { createAlgoliaClient } from '@/utils/algolia/server'

// Global search index functions

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

export async function deleteSearchRecord(
  indexName: 'global_index' | 'bands' | 'locations',
  objectID: string
) {
  const algolia = await createAlgoliaClient()

  await algolia.deleteObject({
    indexName,
    objectID,
  })
}

// Band index functions

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
      alt_names: record.alt_names ?? null,
      country: record.country
        ? {
            id: record.country_id,
            iso2: record.country.iso2,
            name_de: regionNamesDe.of(record.country.iso2) ?? null,
            name_en: regionNamesEn.of(record.country.iso2) ?? null,
          }
        : null,
      genres: record.genres,
      spotify_artist_id: record.spotify_artist_id ?? null,
      spotify_artist_images: record.spotify_artist_images ?? null,
    } satisfies BandRecord,
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
      name: record.name ?? null,
      alt_names: record.alt_names ?? null,
      country: record.country
        ? {
            iso2: record.country.iso2,
            name_de: regionNamesDe.of(record.country.iso2) ?? null,
            name_en: regionNamesEn.of(record.country.iso2) ?? null,
          }
        : null,
      genres: record.genres,
      spotify_artist_id: record.spotify_artist_id ?? null,
      spotify_artist_images: record.spotify_artist_images ?? null,
    } as Nullable<BandRecord>,
    createIfNotExists: false,
  })
}

// Location index functions

export async function addLocationRecord(
  location: AddLocation & { id: number; country?: { iso2: string } | null }
) {
  const algolia = await createAlgoliaClient()
  const regionNamesDe = new Intl.DisplayNames('de', { type: 'region' })
  const regionNamesEn = new Intl.DisplayNames('en', { type: 'region' })

  await algolia.saveObject({
    indexName: 'locations',
    body: {
      objectID: location.id.toString(),
      id: location.id,
      name: location.name,
      alt_names: location.alt_names ?? null,
      zip_code: location.zip_code ?? null,
      city: location.city,
      country: location.country
        ? {
            id: location.country_id,
            iso2: location.country.iso2,
            name_de: regionNamesDe.of(location.country.iso2) ?? null,
            name_en: regionNamesEn.of(location.country.iso2) ?? null,
          }
        : null,
      image: location.image ?? null,
      updated_at: location.updated_at ?? null,
    } satisfies LocationRecord,
  })
}

export async function editLocationRecord(
  objectID: string,
  location: EditLocation & { id: number; country?: { iso2: string } | null }
) {
  const algolia = await createAlgoliaClient()
  const regionNamesDe = new Intl.DisplayNames('de', { type: 'region' })
  const regionNamesEn = new Intl.DisplayNames('en', { type: 'region' })

  await algolia.partialUpdateObject({
    indexName: 'locations',
    objectID,
    attributesToUpdate: {
      name: location.name ?? null,
      alt_names: location.alt_names ?? null,
      zip_code: location.zip_code ?? null,
      city: location.city ?? null,
      country: location.country
        ? {
            iso2: location.country.iso2,
            name_de: regionNamesDe.of(location.country.iso2) ?? null,
            name_en: regionNamesEn.of(location.country.iso2) ?? null,
          }
        : null,
      image: location.image ?? null,
      updated_at: location.updated_at ?? null,
    } as LocationRecord,
    createIfNotExists: false,
  })
}
