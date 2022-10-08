import { useState } from "react"
import supabase from "../utils/supabase"
import GenreCheckbox from "./GenreCheckbox"

export default function AddBandForm({ countries, genres, cancelButton }) {
  let [selectedGenres, setSelectedGenres] = useState([])

  async function handleSubmit(event) {
    event.preventDefault()
    
    const { data: updatedBands, error } = await supabase
    .from('bands')
    .insert({
      name: event.target.name.value,
      country: event.target.country.value,
      genres: selectedGenres,
    })
    
    if (error) {
      console.error(error)
    }
  }
	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4">
			<div className="form-control">
				<label htmlFor="name">Name</label>
				<input type="text" name="name" id="name" />
			</div>
			<div className="form-control">
				<label htmlFor="country">Land</label>
				<select name="country" id="country">
					<option value={null}>Bitte wählen ...</option>
					<option value="international">International</option>
					{countries.map((country, index) => (
						<option key={index} value={country.iso2}>{country.local_name}</option>
					))}
				</select>
			</div>
			<fieldset className="form-control">
        <legend>Genres</legend>
        {genres.map((genre, index) => (
          <GenreCheckbox key={index} genre={genre} selectedGenres={selectedGenres} setSelectedGenres={setSelectedGenres} />
        ))}
      </fieldset>
      <div className="flex justify-end gap-3">
        {cancelButton}
        <button type="submit" className="btn btn-primary">Band hinzufügen</button>
      </div>
		</form>
	)
}