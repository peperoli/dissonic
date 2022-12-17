"use client"

import supabase from "../../utils/supabase"
import Link from "next/link"
import { ArrowLeftIcon } from "@heroicons/react/20/solid"
import Modal from "../Modal"
import { Fragment, useState } from "react"
import { useRouter } from "next/navigation"
import EditBandForm from "./EditBandForm"
import PageWrapper from "../layout/PageWrapper"
import { Button } from "../Button"

export default function BandPage({ initialBand, countries, genres }) {
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

      const { error: bandError } = await supabase
        .from('bands')
        .delete()
        .eq('id', band.id)

      if (bandError) {
        throw bandError
      }

      router.push('/bands')
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <PageWrapper>
      <main className="p-8">
        <Link href="/bands" className="btn btn-link">
          <ArrowLeftIcon className="h-icon" />
          Go Back
        </Link>
        <h1>{band.name} <span>({band.country?.iso2})</span></h1>
        <ul className="flex gap-2">
          {band.genres && band.genres.map((genre, index) => (
            <Fragment key={index}>
              <li>{genre.name}</li>
              {index + 1 !== band.genres.length && <span>&bull;</span>}
            </Fragment>
          ))}
        </ul>
        <button onClick={() => setEditIsOpen(true)} className="btn btn-link">
          Bearbeiten
        </button>
        <button onClick={() => setDeleteIsOpen(true)} className="btn btn-link btn-danger">
          Löschen
        </button>
      </main>
      <Modal isOpen={deleteIsOpen} setIsOpen={setDeleteIsOpen}>
        <div>
          <h2>Band löschen</h2>
          Willst du die Band wirklich löschen?
          <div className="sticky bottom-0 flex md:justify-end gap-4 [&>*]:flex-1 py-4 bg-slate-800 z-10">
            <Button
              label="Abbrechen"
              onClick={() => setDeleteIsOpen(false)}
            />
            <Button 
              label="Löschen"
              onClick={deleteBand}
              style="primary"
            />
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