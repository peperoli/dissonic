'use server'

import { Json } from '@/types/supabase'
import type {
  AddBand,
  AddConcert,
  AddLocation,
  EditBand,
  EditConcert,
  EditLocation,
} from '@/types/types'
import { BandRecord, ConcertRecord, LocationRecord } from '@/types/algolia'
import { createAlgoliaClient } from '@/utils/algolia/server'
import { getUnixTimestamp } from '@/lib/date'
import { AlgoliaIndex } from '@/lib/algolia'

export async function deleteSearchRecord(
  indexName: `${AlgoliaIndex}`,
  objectID: `${AlgoliaIndex}-${number}`
) {
  const algolia = await createAlgoliaClient()

  await algolia.deleteObject({
    indexName,
    objectID,
  })
}

// Concert index functions

export async function addConcertRecord(
  concert: AddConcert & {
    id: number
    festival_root: { id: number; name: string } | null
    bands: {
      id: number
      name: string
      alt_names: string | null
      spotify_artist_id: string | null
      spotify_artist_images: Json | null
    }[]
    location: { id: number; name: string; alt_names: string | null; city: string }
  }
) {
  const algolia = await createAlgoliaClient()

  await algolia.saveObject({
    indexName: AlgoliaIndex.Concerts,
    body: {
      objectID: `${AlgoliaIndex.Concerts}-${concert.id}`,
      type: AlgoliaIndex.Concerts,
      id: concert.id,
      festival_root: concert.festival_root,
      date_start: concert.date_start,
      date_start_unix: getUnixTimestamp(concert.date_start),
      date_end: concert.date_end ?? null,
      date_end_unix: concert.date_end ? getUnixTimestamp(concert.date_end) : null,
      bands: concert.bands.map((band, index) => ({
        id: band.id,
        name: band.name,
        alt_names: band.alt_names ?? null,
        spotify_artist_id: index === 0 ? band.spotify_artist_id : null,
        spotify_artist_images: index === 0 ? band.spotify_artist_images : null,
      })),
      bands_count: concert.bands.length,
      location: concert.location,
      name: concert.name ?? null,
      fan_ids: [],
    } satisfies ConcertRecord,
  })
}

export async function editConcertRecord(
  objectID: ConcertRecord['objectID'],
  concert: EditConcert & {
    id: number
    festival_root: { id: number; name: string } | null
    bands: {
      id: number
      name: string
      alt_names: string | null
      spotify_artist_id: string | null
      spotify_artist_images: Json | null
    }[]
    location: { id: number; name: string; alt_names: string | null; city: string }
    fan_ids?: { value: string; _operation: string }
  }
) {
  const algolia = await createAlgoliaClient()

  await algolia.partialUpdateObject({
    indexName: AlgoliaIndex.Concerts,
    objectID,
    attributesToUpdate: {
      festival_root: concert.festival_root,
      date_start: concert.date_start ?? null,
      date_start_unix: concert.date_start ? getUnixTimestamp(concert.date_start) : null,
      date_end: concert.date_end ?? null,
      date_end_unix: concert.date_end ? getUnixTimestamp(concert.date_end) : null,
      bands: concert.bands.map((band, index) => ({
        id: band.id,
        name: band.name,
        alt_names: band.alt_names ?? null,
        spotify_artist_id: index === 0 ? band.spotify_artist_id : null,
        spotify_artist_images: index === 0 ? band.spotify_artist_images : null,
      })),
      bands_count: concert.bands.length,
      location: concert.location,
      name: concert.name ?? null,
    } as ConcertRecord,
    createIfNotExists: false,
  })
}

export async function addConcertFanId(objectID: ConcertRecord['objectID'], userId: string) {
  const algolia = await createAlgoliaClient()

  await algolia.partialUpdateObject({
    indexName: AlgoliaIndex.Concerts,
    objectID,
    attributesToUpdate: {
      fan_ids: {
        value: userId,
        _operation: 'AddUnique',
      },
    },
  })
}

export async function updateConcertFanIds(objectID: ConcertRecord['objectID'], fanIds: string[]) {
  const algolia = await createAlgoliaClient()

  await algolia.partialUpdateObject({
    indexName: AlgoliaIndex.Concerts,
    objectID,
    attributesToUpdate: {
      fan_ids: fanIds,
    },
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
    indexName: AlgoliaIndex.Bands,
    body: {
      objectID: `${AlgoliaIndex.Bands}-${record.id}`,
      type: AlgoliaIndex.Bands,
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
  objectID: BandRecord['objectID'],
  record: EditBand & { id: number; country?: { iso2: string } | null }
) {
  const algolia = await createAlgoliaClient()
  const regionNamesDe = new Intl.DisplayNames('de', { type: 'region' })
  const regionNamesEn = new Intl.DisplayNames('en', { type: 'region' })

  await algolia.partialUpdateObject({
    indexName: AlgoliaIndex.Bands,
    objectID,
    attributesToUpdate: {
      name: record.name ?? null,
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
    } as BandRecord,
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
    indexName: AlgoliaIndex.Locations,
    body: {
      objectID: `${AlgoliaIndex.Locations}-${location.id}`,
      type: AlgoliaIndex.Locations,
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
  objectID: LocationRecord['objectID'],
  location: EditLocation & { id: number; country?: { iso2: string } | null }
) {
  const algolia = await createAlgoliaClient()
  const regionNamesDe = new Intl.DisplayNames('de', { type: 'region' })
  const regionNamesEn = new Intl.DisplayNames('en', { type: 'region' })

  await algolia.partialUpdateObject({
    indexName: AlgoliaIndex.Locations,
    objectID,
    attributesToUpdate: {
      name: location.name ?? null,
      alt_names: location.alt_names ?? null,
      zip_code: location.zip_code ?? null,
      city: location.city ?? null,
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
    } as LocationRecord,
    createIfNotExists: false,
  })
}
