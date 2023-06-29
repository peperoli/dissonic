'use client'

import Link from 'next/link'
import { ArrowLeftIcon, MapPinIcon, MusicalNoteIcon } from '@heroicons/react/20/solid'
import { FC, Fragment, useState } from 'react'
import { EditBandForm } from './EditBandForm'
import { PageWrapper } from '../layout/PageWrapper'
import { Button } from '../Button'
import { ConcertCard } from '../concerts/ConcertCard'
import { Band } from '../../types/types'
import { DeleteBandModal } from './DeleteBandModal'
import { useBand } from '../../hooks/useBand'
import { useConcerts } from '../../hooks/useConcerts'
import { useUser } from '../../hooks/useUser'
import { useSpotifyArtistEmbed } from '../../hooks/useSpotifyArtistEmbed'

export interface BandPageProps {
  initialBand: Band
}

export const BandPage: FC<BandPageProps> = ({ initialBand }) => {
  const { data: band, isLoading: bandIsLoading } = useBand(initialBand)
  const { data: concerts } = useConcerts()
  const { data: user } = useUser()
  const { data: spotifyArtistEmbed } = useSpotifyArtistEmbed(band?.spotify_artist_id)

  const [deleteIsOpen, setDeleteIsOpen] = useState(false)
  const [editIsOpen, setEditIsOpen] = useState(false)

  const bandConcerts = concerts?.filter(concert => concert.bands?.find(item => item.id === band?.id))

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
        <p>Konzert nicht gefunden</p>
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
          {spotifyArtistEmbed?.html && (
            <div dangerouslySetInnerHTML={{ __html: spotifyArtistEmbed.html }} />
          )}
          <div className="flex gap-4">
            <Button onClick={() => setEditIsOpen(true)} label="Bearbeiten" />
            <Button onClick={() => setDeleteIsOpen(true)} label="Löschen" danger />
          </div>
        </div>
        {bandConcerts && bandConcerts?.length > 0 && (
          <div className="grid gap-4 p-6">
            <h2 className='mb-0 text-slate-300'>Konzerte mit {band.name}</h2>
            {bandConcerts.map(item => (
              <ConcertCard key={item.id} concert={item} user={user} />
            ))}
          </div>
        )}
      </main>
      <DeleteBandModal band={band} isOpen={deleteIsOpen} setIsOpen={setDeleteIsOpen} />
      {editIsOpen && (
        <EditBandForm
          band={band}
          isOpen={editIsOpen}
          setIsOpen={setEditIsOpen}
        />
      )}
    </PageWrapper>
  )
}
