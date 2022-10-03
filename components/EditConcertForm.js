import BandCheckbox from "./ BandCheckbox"
import { useState } from "react"
import supabase from "../utils/supabase"

export default function EditConcertForm({ concert, bands, concertBands }) {
  concertBands = concertBands || []
  let [selectedConcertBands, setSelectedConcertBands] = useState(concertBands)

  const deletedConcertBands = concertBands
    .filter(concertBand => !selectedConcertBands.find(selectedConcertBand => (concertBand === selectedConcertBand)))

  let deletedConcertBandConcertIds = []
  let deletedConcertBandBandIds = []

  deletedConcertBands.map(item => {
    deletedConcertBandConcertIds.push(item.concert_id)
    deletedConcertBandBandIds.push(item.band_id)
  })

  async function handleSubmit(event) {
    event.preventDefault()

    const { data: updateConcert, updateConcertError } = await supabase
      .from('concerts')
      .update({ date_start: event.target.dateStart.value, description: event.target.description.value })
      .eq('id', concert.id)

    const { data: upsertConcertBands, upsertConcertBandsError } = await supabase
      .from('concert_bands')
      .upsert(selectedConcertBands)

    const { data: deleteConcertBands, deleteConcertBandsError } = await supabase
      .from('concert_bands')
      .delete()
      .in('concert_id', deletedConcertBandConcertIds)
      .in('band_id', deletedConcertBandBandIds)

    if (updateConcertError) {
      console.error(updateConcertError)
    }
    if (upsertConcertBandsError) {
      console.error(upsertConcertBandsError);
    }
    if (deleteConcertBandsError) {
      console.error(deleteConcertBandsError);
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="dateStart">Datum</label>
      <input type="date" name="dateStart" id="dateStart" defaultValue={concert.date_start} />
      <p>Ausgewählte Bands:</p>
      <ul className="flex gap-2">
        {selectedConcertBands?.length > 0 ? selectedConcertBands.map((concertBand, index) => (
          <li key={index} className="btn btn-tag">
            {bands.find(band => band.id === concertBand.band_id).name}
          </li>
        )) : (
          <p className="text-red-400">Dieses Konzert hat noch keine Bands.</p>
        )}
      </ul>
      <label htmlFor="description">Beschreibung</label>
      <textarea name="description" id="description" defaultValue={concert.description} />
      <fieldset className="mb-4">
        <legend>Bands</legend>
        {bands.map(band => (
          <BandCheckbox
            key={band.id}
            concertId={concert.id}
            band={band}
            selectedConcertBands={selectedConcertBands}
            setSelectedConcertBands={setSelectedConcertBands}
          />
        ))}
      </fieldset>
      <button type="submit" className="btn btn-primary">Speichern</button>
    </form>
  )
}