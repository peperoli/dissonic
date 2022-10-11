import supabase from "../../utils/supabase"
import Link from "next/link"
import EditConcertForm from "../../components/EditConcertForm"
import { ArrowLeftIcon } from "@heroicons/react/24/solid"
import { useEffect, useState } from "react"

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
      />
      {band.name}
    </label>
  )
}

export default function ConcertPage({ concert, bands, locations, allBandsSeen }) {
  const [bandsSeen, setBandsSeen] = useState([])

  useEffect(() => {
    const user = supabase.auth.user()
    setBandsSeen(allBandsSeen.find(bandsSeen => bandsSeen.user_id === user?.id)?.band_ids)
  }, [allBandsSeen])

  return (
    <main className="max-w-2xl p-8">
      <Link href="/">
        <a className="btn btn-link">
          <ArrowLeftIcon className="h-text" />
          Go Back
        </a>
      </Link>
      <h1>Konzert<span className="ml-2 text-sm text-slate-500">{concert.id}</span></h1>
      {concert.bands && concert.bands.map(bandId => (
        <BandSeenCheckbox
          key={bandId}
          band={bands.find(item => item.id === bandId)}
          bands={bands}
          bandsSeen={bandsSeen}
          setBandsSeen={setBandsSeen}
        />
      ))}
      <EditConcertForm concert={concert} bands={bands} locations={locations} />
    </main>
  )
}

export async function getServerSideProps({ params }) {

  const { data: concert, error } = await supabase
    .from('concerts')
    .select('*')
    .eq('id', params.id)
    .single()

  const { data: bands } = await supabase
    .from('bands')
    .select('*')
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
    throw new Error(error.message)
  }

  if (bandsSeenError) {
    throw new Error(bandsSeenError)
  }

  return {
    props: {
      concert,
      bands,
      locations,
      allBandsSeen: bandsSeen,
    }
  }
}