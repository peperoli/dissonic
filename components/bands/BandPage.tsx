'use client'

import Link from 'next/link'
import { ArrowLeftIcon, MapPinIcon, MusicalNoteIcon } from '@heroicons/react/20/solid'
import React, { FC, Fragment, useState } from 'react'
import { EditBandForm } from './EditBandForm'
import { PageWrapper } from '../layout/PageWrapper'
import { Button } from '../Button'
import { ConcertCard } from '../concerts/ConcertCard'
import { Band, Concert, Country, Genre } from '../../types/types'
import { DeleteBandModal } from './DeleteBandModal'

export interface BandPageProps {
  initialBand: Band
  countries: Country[]
  genres: Genre[]
  concerts: Concert[]
}

export const BandPage: FC<BandPageProps> = ({ initialBand, countries, genres, concerts }) => {
  const [deleteIsOpen, setDeleteIsOpen] = useState(false)
  const [editIsOpen, setEditIsOpen] = useState(false)
  const [band, setBand] = useState(initialBand)
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
          <div className="flex gap-4">
            <Button onClick={() => setEditIsOpen(true)} label="Bearbeiten" />
            <Button onClick={() => setDeleteIsOpen(true)} label="Löschen" danger />
          </div>
        </div>
        <div className="grid gap-4 p-6">
          {concerts.map(item => (
            <ConcertCard key={item.id} concert={item} user={null} />
          ))}
        </div>
      </main>
      <DeleteBandModal band={band} isOpen={deleteIsOpen} setIsOpen={setDeleteIsOpen} />
      <EditBandForm
        band={band}
        countries={countries}
        genres={genres}
        isOpen={editIsOpen}
        setIsOpen={setEditIsOpen}
        setBand={setBand}
      />
    </PageWrapper>
  )
}
