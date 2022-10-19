import { useState } from "react"
import supabase from "../utils/supabase"
import MultiSelect from "./MultiSelect"
import dayjs from "dayjs"

export default function NewConcertForm({ bands, locations, cancelButton }) {
  const [selectedConcertBands, setSelectedConcertBands] = useState([])
  const [isFestival, setIsFestival] = useState(false)

  const [today] = dayjs().format().split('T')
  const [tomorrow] = dayjs().add(1, 'day').format().split('T')

  async function handleSubmit(event) {
    event.preventDefault()

    const { data: insertConcert, insertConcertError } = await supabase
      .from('concerts')
      .insert([{
        date_start: event.target.dateStart.value,
        date_end: event.target.dateEnd?.value,
        band_ids: selectedConcertBands.map(item => item.id),
        location: event.target.location.value,
        description: event.target.description.value,
        name: event.target.name.value,
        is_festival: event.target.isFestival.checked,
      }])
      .single()

    if (insertConcertError) {
      alert(insertConcertError.message)
    }
  }
  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <h2 className="mb-0">Konzert hinzufügen</h2>
      <div className="form-control">
        <input type="text" name="name" id="name" placeholder="Wacken Open Air" />
        <label htmlFor="name">Name (optional)</label>
      </div>
      <div className="form-control">
        <label>
          <input type="checkbox" name="isFestival" value="isFestival" checked={isFestival} onChange={() => setIsFestival(!isFestival)} />
          <span>Festival</span>
        </label>
      </div>
      <div className="flex gap-4">
        <div className="form-control">
          <input type="date" name="dateStart" id="dateStart" defaultValue={today} />
          <label htmlFor="dateStart">Datum</label>
        </div>
        {isFestival && (
          <div className="form-control">
            <input type="date" name="dateEnd" id="dateEnd" defaultValue={tomorrow} />
            <label htmlFor="dateEnd">Enddatum</label>
          </div>
        )}
      </div>
      <MultiSelect
        name="bands"
        options={bands}
        selectedOptions={selectedConcertBands}
        setSelectedOptions={setSelectedConcertBands}
      />
      <div className="form-control">
        <select name="location" id="location" defaultValue="">
          <option value="" disabled hidden>Bitte wählen ...</option>
          {locations && locations.map(location => (
            <option key={location.id} value={location.id}>{location.name}</option>
            ))}
        </select>
        <label htmlFor="location">Location</label>
      </div>
      <div className="form-control">
        <textarea name="description" id="description" placeholder="Schreib was Schönes ..." />
        <label htmlFor="description">Beschreibung</label>
      </div>
      <div className="flex justify-end gap-3">
        {cancelButton}
        <button type="submit" className="btn btn-primary">Konzert erstellen</button>
      </div>
    </form>
  )
}