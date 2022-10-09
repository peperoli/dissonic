import { useState } from "react"
import supabase from "../utils/supabase"
import GenreCheckbox from "./GenreCheckbox"

export default function EditBandForm({ band, countries, genres, cancelButton }) {
  const [selectedGenres, setSelectedGenres] = useState(band.genres || [])

  async function handleSubmit(event) {
    event.preventDefault()

    const { data: updatedBand, error } = await supabase
      .from('bands')
      .update({
        name: event.target.name.value,
        country: event.target.country.value,
        genres: selectedGenres
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
        <label htmlFor="name">Name</label>
        <input type="text" name="name" id="name" defaultValue={band.name} />
      </div>
      <div className="form-control">
        <label htmlFor="country">Land</label>
        <select name="country" id="country" defaultValue={band.country}>
          <option value="international">International</option>
          {countries.map((country, index) => (
            <option key={index} value={country.iso2}>{country.name}</option>
          ))}
        </select>
      </div>
      <fieldset className="form-control">
        <legend>Genres</legend>
        {genres.map((genre, index) => (
          <GenreCheckbox key={index} band={band} genre={genre} selectedGenres={selectedGenres} setSelectedGenres={setSelectedGenres} />
        ))}
      </fieldset>
      <div className="flex justify-end gap-3">
        {cancelButton}
        <button type="submit" className="btn btn-primary">Speichern</button>
      </div>
    </form>
  )
}