'use client'

import Link from 'next/link'
import { ArrowLeftIcon, MapPinIcon, MusicalNoteIcon } from '@heroicons/react/20/solid'
import { Fragment, useState } from 'react'
import { EditBandForm } from './EditBandForm'
import { PageWrapper } from '../layout/PageWrapper'
import { Button } from '../Button'
import { ConcertCard } from '../concerts/ConcertCard'
import { Band } from '../../types/types'
import { DeleteBandModal } from './DeleteBandModal'
import { useBand } from '../../hooks/useBand'
import { useConcerts } from '../../hooks/useConcerts'
import { useSpotifyArtistEmbed } from '../../hooks/useSpotifyArtistEmbed'
import { SpinnerIcon } from '../layout/SpinnerIcon'
import { useRouter } from 'next/navigation'
import { useUser } from '../../hooks/useUser'

export interface BandPageProps {
  initialBand: Band
}

export const BandPage = ({ initialBand }: BandPageProps) => {
  const { data: band, isLoading: bandIsLoading } = useBand(initialBand)
  const { data: concerts } = useConcerts(undefined, {
    filter: { bands: [initialBand.id] },
    sort: ['date_start', false],
  })
  const { data: spotifyArtistEmbed, status: spotifyArtistEmbedStatus } = useSpotifyArtistEmbed(
    band?.spotify_artist_id
  )
  const [deleteIsOpen, setDeleteIsOpen] = useState(false)
  const [editIsOpen, setEditIsOpen] = useState(false)
  const { data: user } = useUser()
  const { push } = useRouter()

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
      <main className="grid gap-4 w-full max-w-2xl p-4 md:p-8">
        <div>
          <Link href="/bands" className="btn btn-link">
            <ArrowLeftIcon className="h-icon" />
            Zurück
          </Link>
        </div>
        <div className="grid gap-4 p-6 rounded-lg bg-slate-800">
          <h1>{band.name}</h1>
          <div className="flex gap-2 items-center">
            <MapPinIcon className="h-icon text-slate-300" />
            {band.country?.name}
          </div>
          <ul className="flex gap-2">
            <MusicalNoteIcon className="h-icon text-slate-300" />
            {band.genres &&
              band.genres.map((genre, index) => (
                <Fragment key={index}>
                  <li>{genre.name}</li>
                  {index + 1 !== band.genres?.length && <span>&bull;</span>}
                </Fragment>
              ))}
          </ul>
          {spotifyArtistEmbedStatus === 'loading' && (
            <div className="grid place-content-center h-72 rounded-lg text-slate-300 bg-slate-750">
              <SpinnerIcon className="h-8 animate-spin" />
            </div>
          )}
          {spotifyArtistEmbed?.html && (
            <div dangerouslySetInnerHTML={{ __html: spotifyArtistEmbed.html }} />
          )}
          <div className="flex gap-4">
            <Button
              onClick={user ? () => setEditIsOpen(true) : () => push('/login')}
              label="Bearbeiten"
            />
            <Button
              onClick={user ? () => setDeleteIsOpen(true) : () => push('/login')}
              label="Löschen"
              danger
            />
          </div>
        </div>
        {concerts?.data && concerts?.data?.length > 0 && (
          <div className="grid gap-4 p-6">
            <h2 className="mb-0 text-slate-300">Konzerte mit {band.name}</h2>
            {concerts?.data.map(item => (
              <ConcertCard key={item.id} concert={item} />
            ))}
          </div>
        )}
      </main>
      <DeleteBandModal band={band} isOpen={deleteIsOpen} setIsOpen={setDeleteIsOpen} />
      <EditBandForm band={band} isOpen={editIsOpen} setIsOpen={setEditIsOpen} />
    </PageWrapper>
  )
}
