import supabase from "../../utils/supabase"
import Link from "next/link"
import { ArrowLeftIcon } from "@heroicons/react/24/solid"
import Modal from "../../components/Modal"
import { Fragment, useState } from "react"
import { useRouter } from "next/router"
import EditBandForm from "../../components/EditBandForm"
import PageWrapper from "../../components/PageWrapper"
import { toast } from "react-toastify"

export default function BandPage({ initialBand, countries, genres }) {
  const [deleteIsOpen, setDeleteIsOpen] = useState(false)
  const [editIsOpen, setEditIsOpen] = useState(false)
  const [band, setBand] = useState(initialBand)
  const [isSuccess, setIsSuccess] = useState(false)

  const router = useRouter()
  const notifyUpdate = () => toast.success("Band erfolgreich aktualisiert.")

  // if (isSuccess) {
  //   notifyUpdate()
  // }

  async function deleteBand() {
    try {
      const { error: genresError } = await supabase
        .from('j_band_genres')
        .delete()
        .eq('band_id', band.id)

      if (genresError) {
        throw uploadError
      }

      const { error: bandError } = await supabase
        .from('bands')
        .delete()
        .eq('id', band.id)

      if (bandError) {
        throw bandError
      }
    } catch (error) {
      alert('Löschen fehlgeschlagen. Kontaktiere Oli')
      console.log(error)
    } finally {
      router.push('/bands')
    }
  }

  return (
    <PageWrapper>
      <main className="p-8">
        <Link href="/bands">
          <a className="btn btn-link">
            <ArrowLeftIcon className="h-text" />
            Go Back
          </a>
        </Link>
        <h1>{band.name} <span>({band.da_real_country?.iso2})</span></h1>
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
        <pre className="text-slate-300">{JSON.stringify(band, null, 2)}</pre>
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
        <EditBandForm
          band={band}
          countries={countries}
          genres={genres}
          setIsOpen={setEditIsOpen}
          setIsSuccess={setIsSuccess}
          setBand={setBand}
        />
      </Modal>
    </PageWrapper>
  )
}

export async function getServerSideProps({ params }) {
  const { data: band, error } = await supabase
    .from('bands')
    .select('*, da_real_country(id, iso2), genres(*)')
    .eq('id', params.id)
    .single()

  const { data: countries } = await supabase
    .from('countries')
    .select('id, name, iso2')
    .neq('local_name', null)
    .neq('iso2', 'AQ')

  const { data: genres } = await supabase
    .from('genres')
    .select('*')

  if (error) {
    console.error(error);
  }

  return {
    props: {
      initialBand: band,
      countries,
      genres,
    }
  }
}