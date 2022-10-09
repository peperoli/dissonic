// import BandCheckbox from "./ BandCheckbox"
import { useState } from "react"
import supabase from "../utils/supabase"
import BandCheckbox from "./BandCheckbox"

export default function NewConcertForm({ bands, cancelButton }) {
  let [selectedConcertBands, setSelectedConcertBands] = useState([])

  console.log(selectedConcertBands);

  async function handleSubmit(event) {
    event.preventDefault()

    const { data: insertConcert, insertConcertError } = await supabase
      .from('concerts')
      .insert([{
        date_start: event.target.dateStart.value,
        bands: selectedConcertBands,
        description: event.target.description.value
      }])
      .single()

    if (insertConcertError) {
      console.error(insertConcertError)
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
            {bands.find(band => band.id === concertBand).name}
          </li>
        )) : (
          <p className="text-red">Dieses Konzert hat noch keine Bands.</p>
        )}
      </ul>
      <div className="form-control">
        <label htmlFor="description">Beschreibung</label>
        <textarea name="description" id="description" placeholder="Schreib was Schönes ..." />
      </div>
      <fieldset className="form-control">
        <legend>Bands</legend>
        {bands.map(band => (
          <BandCheckbox
            key={band.id}
            band={band}
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