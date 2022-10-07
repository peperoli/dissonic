import supabase from "../../utils/supabase"
import Link from "next/link"
import { ArrowLeftIcon } from "@heroicons/react/24/solid"
import Navigation from "../../components/navigation"
import Modal from "../../components/Modal"
import { Fragment, useState } from "react"
import { useRouter } from "next/router"
import EditBandForm from "../../components/EditBandForm"

export default function BandPage({ band, countries, genres }) {
  let [deleteIsOpen, setDeleteIsOpen] = useState(false)
  let [editIsOpen, setEditIsOpen] = useState(false)

  const router = useRouter()

  function updateBand(event) {
    const { error } = supabase
      .from('bands')
      .update({ name: event.target.name.value, })

    if (error) {
      console.error(error)
    }
  }

  async function deleteBand() {
    const { error } = await supabase
      .from('bands')
      .delete()
      .eq('id', band.id)

    if (error) {
      console.error(error)
    } else {
      router.push('/bands')
    }
  }
  return (
    <div className="flex">
      <Navigation />
      <main className="p-8">
        <Link href="/bands">
          <a className="btn btn-link">
            <ArrowLeftIcon className="h-text" />
            Go Back
          </a>
        </Link>
        <h1>{band.name} <span>({band.country})</span></h1>
        <ul className="flex gap-2">
          {band.genres && band.genres.map((genre, index) => (
            <Fragment key={index}>
              <li>{genre}</li>
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
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setDeleteIsOpen(false)} className="btn btn-link">
              Abbrechen
            </button>
            <button onClick={deleteBand} className="btn btn-primary btn-danger">
              Löschen
            </button>
          </div>
        </div>
      </Modal>
      <Modal isOpen={editIsOpen} setIsOpen={setEditIsOpen}>
        <div>
          <h2>Band bearbeiten</h2>
          <div className="flex justify-end gap-3 mt-4">
            <EditBandForm band={band} countries={countries} genres={genres} />
            <button onClick={() => setEditIsOpen(false)} className="btn btn-link">
              Abbrechen
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export async function getServerSideProps({ params }) {
  const { data: band, error } = await supabase
    .from('bands')
    .select('*')
    .eq('id', params.id)
    .single()

  const { data: countries } = await supabase
    .from('countries')
    .select('local_name,iso2')
    .neq('local_name', null)
    .neq('iso2', 'AQ')

  const { data: genres } = await supabase.from('genres').select('*')

  if (error) {
    console.error(error);
  }

  return {
    props: {
      band,
      countries,
      genres,
    }
  }
}