import { useState } from "react"
import supabase from "../../utils/supabase"
import Button from "../Button"
import MultiSelect from "../MultiSelect"

export default function EditConcertForm({ concert, bands, locations, setIsOpen, setConcert }) {
  const [selectedBands, setSelectedBands] = useState(concert.bands || [])
  const [isFestival, setIsFestival] = useState(concert.is_festival)

  const addBands = selectedBands.filter(item => !concert.bands.find(item2 => item.id === item2.id))
  const deleteBands = concert.bands.filter(item => !selectedBands.find(item2 => item.id === item2.id))
  async function handleSubmit(event) {
    event.preventDefault()

    try {
      const { error: editConcertError } = await supabase
        .from('concerts')
        .update({
          date_start: event.target.dateStart.value,
          date_end: event.target.dateEnd?.value,
          description: event.target.description.value,
          location: event.target.location.value,
          name: event.target.name.value,
          is_festival: isFestival,
        })
        .eq('id', concert.id)

      if (editConcertError) {
        throw editConcertError
      }

      const { error: addBandsError } = await supabase
        .from('j_concert_bands')
        .insert(addBands.map(band => ({ concert_id: concert.id, band_id: band.id })))

      if (addBandsError) {
        throw addBandsError
      }

      const { error: deleteBandsError } = await supabase
        .from('j_concert_bands')
        .delete()
        .eq('concert_id', concert.id)
        .in('band_id', deleteBands.map(item => item.id))

      if (deleteBandsError) {
        throw deleteBandsError
      }
      try {
        const { data: newConcert, error: newConcertError } = await supabase
          .from('concerts')
          .select('*, location(*), bands!j_concert_bands(*, genres(*))')
          .eq('id', concert.id)
          .single()

        if (newConcertError) {
          throw newConcertError
        }

        setConcert(newConcert)
        setIsOpen(false)
      } catch (error) {
        alert(error.message)
      }
    } catch (error) {
      alert(error.message)
    }

    setIsOpen(false)
  }
  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <h2>Konzert bearbeiten</h2>
      <div className="form-control">
        <input type="text" name="name" id="name" placeholder="Wacken Open Air" defaultValue={concert.name} />
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
          <input type="date" name="dateStart" id="dateStart" defaultValue={concert.date_start} />
          <label htmlFor="dateStart">{isFestival ? 'Startdatum' : 'Datum'}</label>
        </div>
        {isFestival && (
          <div className="form-control">
            <input type="date" name="dateEnd" id="dateEnd" defaultValue={concert.date_end} />
            <label htmlFor="dateEnd">Enddatum</label>
          </div>
        )}
      </div>
      <div className="form-control">
        <select name="location" id="location" defaultValue={concert.location?.id}>
          <option value={null}>Bitte wählen ...</option>
          {locations && locations.map(location => (
            <option key={location.id} value={location.id}>{location.name}{location.city && ', ' + location.city}</option>
          ))}
        </select>
        <label htmlFor="location">Location</label>
      </div>
      <MultiSelect
        name="bands"
        options={bands}
        selectedOptions={selectedBands}
        setSelectedOptions={setSelectedBands}
      />
      <div className="form-control">
        <textarea name="description" id="description" defaultValue={concert.description} placeholder="Schreib was Schönes ..." />
        <label htmlFor="description">Beschreibung</label>
      </div>
      <div className="sticky bottom-0 flex md:justify-end gap-4 [&>*]:flex-1 py-4 md:pb-0 bg-slate-800 z-10">
        <Button onClick={() => setIsOpen(false)} label="Abbrechen" />
        <button type="submit" className="btn btn-primary">Speichern</button>
      </div>
    </form>
  )
}