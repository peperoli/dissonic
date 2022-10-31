import supabase from "../../utils/supabase"
import Link from "next/link"
import EditConcertForm from "../../components/EditConcertForm"
import { ArrowLeftIcon, CalendarIcon, MapPinIcon } from "@heroicons/react/24/solid"
import { useEffect, useState } from "react"
import PageWrapper from "../../components/PageWrapper"
import Modal from "../../components/Modal"
import Button from "../../components/Button"
import dayjs from "dayjs"
import 'dayjs/locale/de'
import { useRouter } from "next/router"
import GenreChart from "../../components/GenreChart"

function BandSeenCheckbox({ band, bandsSeen, setBandsSeen }) {
  const isSeen = bandsSeen && bandsSeen.some(item => item === band.id) ? true : false

  function handleChange() {
    if (isSeen) {
      setBandsSeen(bandsSeen.filter(item => item !== band.id))
    } else {
      setBandsSeen([
        ...bandsSeen,
        band.id
      ])
    }
  }
  return (
    <label className={`btn btn-tag ${isSeen ? 'btn-seen' : ''}`}>
      <input
        type="checkbox"
        name="seenBands"
        value={`seenBand${band.id}`}
        checked={isSeen}
        onChange={handleChange}
        className="sr-only"
      />
      {band.name}
    </label>
  )
}

export default function ConcertPage({ initialConcert, bands, locations, allBandsSeen }) {
  const [concert, setConcert] = useState(initialConcert)
  const [bandsSeen, setBandsSeen] = useState([])
  const [editIsOpen, setEditIsOpen] = useState(false)
  const [deleteIsOpen, setDeleteIsOpen] = useState(false)

  const router = useRouter()
  const dateFormat = new Date(concert.date_start).getFullYear() === new Date().getFullYear() ? 'DD. MMM' : 'DD. MMM YYYY'

  // useEffect(() => {
  //   const user = supabase.auth.user()
  //   setBandsSeen(allBandsSeen.find(bandsSeen => bandsSeen.user_id === user?.id)?.band_ids || [])
  // }, [allBandsSeen])

  // useEffect(() => {
  //   async function updateBandsSeen() {
  //     const user = supabase.auth.user()
  //     const { data: updatedBandsSeen, error } = await supabase
  //       .from('bands_seen')
  //       .upsert({
  //         concert_id: concert.id,
  //         user_id: user?.id,
  //         band_ids: bandsSeen,
  //       },
  //         {
  //           onConflict: 'concert_id, user_id'
  //         })

  //     if (error) {
  //       console.error(error);
  //     }
  //   }

  //   updateBandsSeen()
  // }, [bandsSeen, concert])

  // useEffect(() => {
  //   const updateSubscription = supabase.from('concerts').on('UPDATE', payload => {
  //     setConcert(payload.new)
  //   }).subscribe()

  //   return () => supabase.removeSubscription(updateSubscription)
  // })

  async function deleteConcert() {
    try {
      const { error: deleteBandsSeenError } = await supabase.from('bands_seen').delete().eq('concert_id', concert.id)

      if (deleteBandsSeenError) {
        throw deleteBandsSeenError
      }
  
      const { error: deleteBandsError } = await supabase.from('j_concert_bands').delete().eq('concert_id', concert.id)

      if (deleteBandsError) {
        throw deleteBandsError
      }
  
      const { error: deleteConcertError } = await supabase.from('concerts').delete().eq('id', concert.id)

      if (deleteConcertError) {
        throw deleteConcertError
      }

      try {
        router.push('/')
      } catch {

      }
    } catch (error) {
      alert(error.message)
    }
  }
  return (
    <PageWrapper>
      <main className="max-w-2xl p-8">
        <Link href="/">
          <a className="btn btn-link">
            <ArrowLeftIcon className="h-text" />
            Go Back
          </a>
        </Link>
        {concert.name ? (
          <>
            {concert.is_festival && <p>Festival</p>}
            <h1>{concert.name}</h1>
          </>
        ) : (
          <h1>{concert.bands[0]?.name} @ {concert.location?.name}</h1>
        )}
        <div className="flex flex-wrap gap-2 mb-4">
          {concert.bands && concert.bands.map(band => (
            <BandSeenCheckbox
              key={band.id}
              band={band}
              bandsSeen={bandsSeen}
              setBandsSeen={setBandsSeen}
            />
          ))}
        </div>
        <div className="flex gap-4 w-full">
          <div className="inline-flex items-center">
            <CalendarIcon className="h-text mr-2" />
            {dayjs(concert.date_start).locale('de-ch').format(dateFormat)}
            {concert.date_end && <span>&nbsp;&ndash; {dayjs(concert.date_end).locale('de-ch').format(dateFormat)}</span>}
          </div>
          {concert.location && (
            <div className="inline-flex items-center">
              <MapPinIcon className="h-text mr-2" />
              {concert.location.name}
            </div>
          )}
        </div>
        {concert.description && <p>{concert.description}</p>}
        <GenreChart bands={concert.bands} />
        <div className="flex gap-4 mt-4">
          <Button onClick={() => setEditIsOpen(true)} label="Bearbeiten" />
          <Button onClick={() => setDeleteIsOpen(true)} label="Löschen" />
        </div>
        <pre className="text-slate-300">{JSON.stringify(concert, null, 2)}</pre>
        <Modal
          isOpen={editIsOpen}
          setIsOpen={setEditIsOpen}
        >
          <EditConcertForm
            concert={concert}
            bands={bands}
            locations={locations}
            setIsOpen={setEditIsOpen}
            setConcert={setConcert}
          />
        </Modal>
        <Modal isOpen={deleteIsOpen} setIsOpen={setDeleteIsOpen}>
          <div>
            <h2>Konzert löschen</h2>
            Willst du dieses Konzert wirklich löschen?
            <div className="flex justify-end gap-3 mt-4">
              <Button onClick={() => setDeleteIsOpen(false)} label="Abbrechen" />
              <button onClick={deleteConcert} className="btn btn-primary btn-danger">
                Löschen
              </button>
            </div>
          </div>
        </Modal>
      </main>
    </PageWrapper>
  )
}

export async function getServerSideProps({ params }) {

  const { data: concert, error } = await supabase
    .from('concerts')
    .select(`
      *,
      location(*),
      bands(
        *,
        genres(*)
      )
    `)
    .eq('id', params.id)
    .single()

  const { data: bands } = await supabase
    .from('bands')
    .select('*, genres(*)')
    .order('name')

  const { data: bandsSeen, bandsSeenError } = await supabase
    .from('bands_seen')
    .select('*')
    .eq('concert_id', params.id)

  const { data: locations } = await supabase
    .from('locations')
    .select('*')
    .order('name')

  if (error) {
    console.error(error);
  }

  if (bandsSeenError) {
    throw new Error(bandsSeenError)
  }

  return {
    props: {
      initialConcert: concert,
      bands,
      locations,
      allBandsSeen: bandsSeen,
    }
  }
}