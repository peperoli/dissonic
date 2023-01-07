'use client'

import supabase from '../../utils/supabase'
import Link from 'next/link'
import { ArrowLeftIcon, MapPinIcon, MusicalNoteIcon } from '@heroicons/react/20/solid'
import Modal from '../Modal'
import React, { FC, Fragment, useState } from 'react'
import { useRouter } from 'next/navigation'
import EditBandForm from './EditBandForm'
import { PageWrapper } from '../layout/PageWrapper'
import { Button } from '../Button'
import { ConcertCard } from '../concerts/ConcertCard'
import { IBandPage } from '../../models/types'

export const BandPage: FC<IBandPage> = ({ initialBand, countries, genres, concerts }) => {
  const [deleteIsOpen, setDeleteIsOpen] = useState(false)
  const [editIsOpen, setEditIsOpen] = useState(false)
  const [band, setBand] = useState(initialBand)

  const router = useRouter()

  async function deleteBand() {
    try {
      const { error: genresError } = await supabase
        .from('j_band_genres')
        .delete()
        .eq('band_id', band.id)

      if (genresError) {
        throw genresError
      }

      const { error: bandError } = await supabase.from('bands').delete().eq('id', band.id)

      if (bandError) {
        throw bandError
      }

      router.push('/bands')
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      } else {
        console.error('Unexpected error', error)
      }
    }
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
            {band.country.name}
          </div>
          <ul className="flex gap-2">
            <MusicalNoteIcon className="h-icon text-slate-300" />
            {band.genres &&
              band.genres.map((genre, index) => (
                <Fragment key={index}>
                  <li>{genre.name}</li>
                  {index + 1 !== band.genres.length && <span>&bull;</span>}
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
            <ConcertCard key={item.id} concert={item} />
          ))}
        </div>
      </main>
      <Modal isOpen={deleteIsOpen} setIsOpen={setDeleteIsOpen}>
        <div>
          <h2>Band löschen</h2>
          Willst du die Band wirklich löschen?
          <div className="sticky bottom-0 flex md:justify-end gap-4 [&>*]:flex-1 py-4 bg-slate-800 z-10">
            <Button label="Abbrechen" onClick={() => setDeleteIsOpen(false)} />
            <Button label="Löschen" onClick={deleteBand} style="primary" />
          </div>
        </div>
      </Modal>
      <Modal isOpen={editIsOpen} setIsOpen={setEditIsOpen}>
        <EditBandForm
          band={band}
          countries={countries}
          genres={genres}
          setIsOpen={setEditIsOpen}
          setBand={setBand}
        />
      </Modal>
    </PageWrapper>
  )
}
