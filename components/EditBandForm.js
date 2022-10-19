import { useState } from "react"
import supabase from "../utils/supabase"
import MultiSelect from "./MultiSelect"

export default function EditBandForm({ band, countries, genres, cancelButton }) {
  const [selectedGenres, setSelectedGenres] = useState(
    genres.filter(genre => band.genres.find(item => item === genre.name)) || []
  )

  async function handleSubmit(event) {
    event.preventDefault()

    const { data: updatedBand, error } = await supabase
      .from('bands')
      .update({
        name: event.target.name.value,
        country: event.target.country.value,
        genres: selectedGenres.map(item => item.name)
      })
      .eq('id', band.id)

    if (error) {
      console.error(error)
    }
  }
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2>Band bearbeiten</h2>
      <div className="form-control">
        <input type="text" name="name" id="name" defaultValue={band.name} />
        <label htmlFor="name">Name</label>
      </div>
      <div className="form-control">
        <select name="country" id="country" defaultValue={band.country}>
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
        <button type="submit" className="btn btn-primary">Speichern</button>
      </div>
    </form>
  )
}