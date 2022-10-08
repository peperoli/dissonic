// import BandCheckbox from "./ BandCheckbox"
import { useState } from "react"
import { v4 as uuidv4 } from 'uuid'
import supabase from "../utils/supabase"
import BandCheckbox from "./BandCheckbox"

export default function NewConcertForm({ bands, cancelButton }) {
  let [selectedConcertBands, setSelectedConcertBands] = useState([])

  async function handleSubmit(event) {
    event.preventDefault()

    const concertId = uuidv4()

    const newArr =
      selectedConcertBands.map(item => {
        if (item.concert_id === null) {
          return { ...item, concert_id: concertId }
        }
      })

    const { data: insertConcert, insertConcertError } = await supabase
      .from('concerts')
      .insert([{
        id: concertId,
        date_start: event.target.dateStart.value,
        description: event.target.description.value
      }])
      .single()

    const { data: insertConcertBands, insertConcertBandsError } = await supabase
      .from('concert_bands')
      .insert(newArr)

    if (insertConcertError) {
      console.error(insertConcertError)
    }
    if (insertConcertBandsError) {
      console.error(insertConcertBandsError);
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-control">
        <label htmlFor="dateStart">Datum</label>
        <input type="date" name="dateStart" id="dateStart" />
      </div>
      <p>Ausgewählte Bands:</p>
      <ul className="flex flex-wrap gap-2">
        {selectedConcertBands?.length > 0 ? selectedConcertBands.map((concertBand, index) => (
          <li key={index} className="btn btn-tag">
            {bands.find(band => band.id === concertBand.band_id).name}
          </li>
        )) : (
          <p className="text-red-400">Dieses Konzert hat noch keine Bands.</p>
        )}
      </ul>
      <div className="form-control">
        <label htmlFor="description">Beschreibung</label>
        <textarea name="description" id="description" placeholder="Schreib was Schönes ..." />
      </div>
      <fieldset className="mb-4">
        <legend>Bands</legend>
        {bands.map(band => (
          <BandCheckbox
            key={band.id}
            band={band}
            concertId={null}
            selectedConcertBands={selectedConcertBands}
            setSelectedConcertBands={setSelectedConcertBands}
          />
        ))}
      </fieldset>
      <div className="flex justify-end gap-3">
        {cancelButton}
        <button type="submit" className="btn btn-primary">Konzert erstellen</button>
      </div>
    </form>
  )
}