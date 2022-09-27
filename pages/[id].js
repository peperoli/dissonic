import supabase from "../utils/supabase"
import Link from "next/link"
import { useState } from "react"
import { v4 as uuidv4 } from 'uuid';

function Checkbox({ concert, band, concertBands, selectedConcertBands, setSelectedConcertBands }) {
  const isSelected = selectedConcertBands.some(item => item.band_id === band.id)

  function handleChange(bandId) {
    if (selectedConcertBands.some(item => item.band_id === bandId)) {
      setSelectedConcertBands(selectedConcertBands.filter(item => item.band_id !== bandId))
    } else {
      setSelectedConcertBands([
        ...selectedConcertBands,
        { id: concertBands.find(item => item.band_id === bandId)?.id || uuidv4() , gagu: concert.id, band_id: bandId, }
      ])
    }
  }

  return (
    <label key={band.id} className="block" htmlFor={`band${band.id}`}>
      <input
        type="checkbox"
        name="bands"
        value={`band${band.id}`}
        id={`band${band.id}`}
        checked={isSelected}
        onChange={() => handleChange(band.id)}
      />
      {band.name}
    </label>
  )
}

export default function ConcertPage({ concert, concertBands, bands }) {
  concertBands = concertBands || []
  let [selectedConcertBands, setSelectedConcertBands] = useState(concertBands)

  const deletedConcertBands = concertBands
    .filter(concertBand => !selectedConcertBands.find(selectedConcertBand => concertBand.id === selectedConcertBand.id))
  
  const deletedConcertBandIds = deletedConcertBands.map(item => (
    item.id
  ))

  async function handleSubmit(event) {
    event.preventDefault()
    
    const { data: oldConcertBands, error } = await supabase
    .from('concert_bands')
    .upsert(selectedConcertBands)

    const { data: newConcertBands, deleteError} = await supabase
      .from('concert_bands')
      .delete()
      .in('id', deletedConcertBandIds)

    if (error) {
      console.error(error);
    }
    if (deleteError) {
      console.deleteError(error);
    }
  }
  return (
    <main className="p-8">
      <Link href="/">
        <a className="underline text-blue-400">Go Back</a>
      </Link>
      <h1>{concert.headline}</h1>
      <p>{concert.content}</p>
      <h2>Ausgewählte Bands:</h2>
      <ul className="flex gap-2">
        {selectedConcertBands?.length > 0 ? selectedConcertBands.map((concertBand, index) => (
          <li key={index} className="btn btn-tag">
            {bands.find(band => band.id === concertBand.band_id).name}
          </li>
        )) : (
          <p className="text-red-400">Dieses Konzert hat noch keine Bands.</p>
        )}
      </ul>
      <form onSubmit={handleSubmit}>
        <fieldset className="mb-4">
          <legend>Bands</legend>
          {bands.map(band => (
            <Checkbox
              key={band.id}
              concert={concert}
              band={band}
              concertBands={concertBands}
              selectedConcertBands={selectedConcertBands}
              setSelectedConcertBands={setSelectedConcertBands} />
          ))}
        </fieldset>
        <button type="submit" className="btn">Speichern</button>
      </form>
    </main>
  )
}

export async function getServerSideProps({ params }) {

  const { data: concert, error } = await supabase
    .from('concerts')
    .select('*')
    .eq('id', params.id)
    .single()

  const { data: concertBands, concertBandsError } = await supabase
    .from('concert_bands')
    .select('*')
    .match({gagu: params.id})

  const { data: bands } = await supabase.from('bands').select('*')

  if (error) {
    throw new Error(error.message)
  }
  if (concertBandsError) {
    throw new Error(concertBandsError)
  }

  return {
    props: {
      concert,
      concertBands,
      bands,
    }
  }
}