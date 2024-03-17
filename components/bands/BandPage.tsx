'use client'

import Link from 'next/link'
import { ArrowLeftIcon, MapPinIcon, MusicalNoteIcon } from '@heroicons/react/20/solid'
import { Fragment, useState } from 'react'
import { PageWrapper } from '../layout/PageWrapper'
import { Button } from '../Button'
import { ConcertCard } from '../concerts/ConcertCard'
import { Band } from '../../types/types'
import { useBand } from '../../hooks/bands/useBand'
import { useConcerts } from '../../hooks/concerts/useConcerts'
import { useSpotifyArtistEmbed } from '../../hooks/spotify/useSpotifyArtistEmbed'
import { SpinnerIcon } from '../layout/SpinnerIcon'
import { usePathname, useRouter } from 'next/navigation'
import { useSession } from '../../hooks/auth/useSession'
import { parseAsStringLiteral, useQueryState } from 'nuqs'
import { modalPaths } from '../shared/ModalProvider'

export interface BandPageProps {
  initialBand: Band
  bandQueryState?: string
}

export const BandPage = ({ initialBand, bandQueryState }: BandPageProps) => {
  const { data: band, isLoading: bandIsLoading } = useBand(initialBand.id, initialBand)
  const { data: concerts } = useConcerts(undefined, {
    bands: [initialBand.id],
    sort: { sort_by: 'date_start', sort_asc: false },
  })
  const { data: spotifyArtistEmbed, status: spotifyArtistEmbedStatus } = useSpotifyArtistEmbed(
    band?.spotify_artist_id
  )
  const [_, setModal] = useQueryState(
    'modal',
    parseAsStringLiteral(modalPaths).withOptions({ history: 'push' })
  )
  const { data: session } = useSession()
  const { push } = useRouter()
  const pathname = usePathname()
  const regionNames = new Intl.DisplayNames('de', { type: 'region' })

  if (bandIsLoading) {
    return (
      <PageWrapper>
        <p>Lade...</p>
      </PageWrapper>
    )
  }

  if (!band) {
    return (
      <PageWrapper>
        <p>Band nicht gefunden</p>
      </PageWrapper>
    )
  }
  return (
    <PageWrapper>
      <main className="container grid gap-4">
        <div>
          <Link href={`/bands${bandQueryState ?? ''}`} className="btn btn-link">
            <ArrowLeftIcon className="h-icon" />
            Zurück zu Bands
          </Link>
        </div>
        <div className="grid gap-4 rounded-lg bg-slate-800 p-6">
          <h1>{band.name}</h1>
          {band.country && (
            <div className="flex items-center gap-4">
              <MapPinIcon className="h-icon text-slate-300" />
              {regionNames.of(band.country.iso2)}
            </div>
          )}
          <div className="flex items-center gap-4">
            <MusicalNoteIcon className="h-icon text-slate-300" />
            <ul className="flex flex-wrap gap-x-2 gap-y-1">
              {band.genres &&
                band.genres.map((genre, index) => (
                  <Fragment key={index}>
                    <li>{genre.name}</li>
                    {index + 1 !== band.genres?.length && <span>&bull;</span>}
                  </Fragment>
                ))}
            </ul>
          </div>
          {band.spotify_artist_id && spotifyArtistEmbedStatus === 'loading' && (
            <div className="grid h-72 place-content-center rounded-lg bg-slate-750 text-slate-300">
              <SpinnerIcon className="h-8 animate-spin" />
            </div>
          )}
          {spotifyArtistEmbed?.html && (
            <div dangerouslySetInnerHTML={{ __html: spotifyArtistEmbed.html }} />
          )}
          <div className="flex gap-4">
            <Button
              onClick={
                session ? () => setModal('edit-band') : () => push(`/login?redirect=${pathname}`)
              }
              label="Bearbeiten"
            />
            <Button
              onClick={
                session ? () => setModal('delete-band') : () => push(`/login?redirect=${pathname}`)
              }
              label="Löschen"
              danger
            />
          </div>
        </div>
        {concerts?.data && concerts?.data?.length > 0 && (
          <div className="grid gap-4 p-6">
            <h2 className="mb-0 text-slate-300">Konzerte mit {band.name}</h2>
            {concerts?.data.map(item => <ConcertCard key={item.id} concert={item} />)}
          </div>
        )}
      </main>
    </PageWrapper>
  )
}
