import { useState } from "react"
import supabase from "../utils/supabase"
import MultiSelect from "./MultiSelect"

export default function EditBandForm({ band, countries, genres, cancelButton }) {
  const [selectedGenres, setSelectedGenres] = useState(band.genres || [])

  const newGenres = selectedGenres.filter(item => !band.genres.find(item2 => item.id === item2.id))
  const deleteGenres = band.genres.filter(item => !selectedGenres.find(item2 => item.id === item2.id))

  async function handleSubmit(event) {
    event.preventDefault()

    const { error } = await supabase
      .from('bands')
      .update({
        name: event.target.name.value,
        country: event.target.country.value,
      })
      .eq('id', band.id)
      
      if (error) {
        console.error(error)
      }

    const { error: addGenresError } = await supabase
      .from('j_band_genres')
      .insert(newGenres.map(genre => ({ band_id: band.id, genre_id: genre.id })))

    const { error: deleteGenresError } = await supabase
      .from('j_band_genres')
      .delete()
      .eq('band_id', band.id)
      .in('genre_id', deleteGenres.map(item => item.id))

    if (addGenresError) {
      console.error(addGenresError);
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