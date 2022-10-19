import { useState } from "react"
import supabase from "../utils/supabase"
import MultiSelect from "./MultiSelect"

export default function AddBandForm({ bands, countries, genres, cancelButton }) {
  const [selectedGenres, setSelectedGenres] = useState([])
  const [name, setName] = useState('')

  const regExp = new RegExp(name, 'i')
  let similarBands = []
  if (name.length >= 3) {
    similarBands = bands.filter(item => item.name.match(regExp))
  }
  const isSimilar = similarBands.length > 0

  async function handleSubmit(event) {
    event.preventDefault()

    const { data: updatedBands, error } = await supabase
      .from('bands')
      .insert({
        name: event.target.name.value,
        country: event.target.country.value,
        genres: selectedGenres.map(item => item.name),
      })

    if (error) {
      console.error(error)
    }
  }
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="form-control">
        <input type="text" name="name" id="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Beatles" />
        <label htmlFor="name">Name</label>
        {isSimilar ? <div className="text-slate-300">Vorsicht, diese Band könnte schon vorhanden sein:
          <ul className="list-disc list-inside">
            {similarBands.map(band => (
              <li key={band.id}>{band.name}</li>
            ))}
          </ul>
        </div> : (
          <p className="text-slate-300">Nice. Die scheint es noch nicht zu geben.</p>
        )}
      </div>
      <div className="form-control">
        <select name="country" id="country" defaultValue="">
          <option value="" disabled hidden>Bitte wählen ...</option>
          <option value="international">International</option>
          {countries.map((country, index) => (
            <option key={index} value={country.iso2}>{country.name}</option>
          ))}
        </select>
        <label htmlFor="country">Land</label>
      </div>
      <MultiSelect
        name="genres"
        options={genres}
        selectedOptions={selectedGenres}
        setSelectedOptions={setSelectedGenres}
      />
      <div className="flex justify-end gap-3">
        {cancelButton}
        <button type="submit" className="btn btn-primary">Band hinzufügen</button>
      </div>
    </form>
  )
}