import BandCheckbox from "./BandCheckbox"
import { useState } from "react"
import supabase from "../utils/supabase"

export default function EditConcertForm({ concert, bands }) {
  let [selectedConcertBands, setSelectedConcertBands] = useState(concert.bands || [])

  async function handleSubmit(event) {
    event.preventDefault()

    const { data: updateConcert, updateConcertError } = await supabase
      .from('concerts')
      .update({ 
        date_start: event.target.dateStart.value, 
        description: event.target.description.value,
        bands: selectedConcertBands,
      })
      .eq('id', concert.id)

    if (updateConcertError) {
      console.error(updateConcertError)
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-control">
        <label htmlFor="dateStart">Datum</label>
        <input type="date" name="dateStart" id="dateStart" defaultValue={concert.date_start} />
      </div>
      <p>Ausgewählte Bands:</p>
      <ul className="flex gap-2">
        {selectedConcertBands?.length > 0 ? selectedConcertBands.map(concertBand => (
          <li key={concertBand} className="btn btn-tag">
            {bands.find(band => band.id === concertBand)?.name}
          </li>
        )) : (
          <p className="text-red">Dieses Konzert hat noch keine Bands.</p>
        )}
      </ul>
      <div className="form-control">
        <label htmlFor="description">Beschreibung</label>
        <textarea name="description" id="description" defaultValue={concert.description} />
      </div>
      <fieldset className="form-control">
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