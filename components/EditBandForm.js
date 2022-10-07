import { useState } from "react"
import supabase from "../utils/supabase"

function GenreCheckbox({ band, genre, selectedGenres, setSelectedGenres }) {
  function handleChange(genreName) {
    if (selectedGenres.some(item => item === genreName)) {
      setSelectedGenres(selectedGenres.filter(item => item !== genreName))
    } else {
      setSelectedGenres([
        ...selectedGenres,
        genreName
      ])
    }
  }
  return (
    <label>
      <input
        type="checkbox"
        name="genres"
        value={genre.name}
        checked={selectedGenres.some(selectedGenre => selectedGenre === genre.name)}
        onChange={() => handleChange(genre.name)}
      />
      {genre.name}
    </label>
  )
}

export default function EditBandForm({ band, countries, genres }) {
  let [selectedGenres, setSelectedGenres] = useState(band.genres || [])
  async function handleSubmit(event) {
    event.preventDefault()

    const { data: updatedBand, error } = await supabase
      .from('bands')
      .update({ name: event.target.name.value, country: event.target.country.value, genres: selectedGenres })
      .eq('id', band.id)

    if (error) {
      console.error(error)
    }
  }
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="form-control">
        <label htmlFor="name">Name</label>
        <input type="text" name="name" id="name" defaultValue={band.name} />
      </div>
      <div className="form-control">
        <label htmlFor="country">Land</label>
        <select name="country" id="country">
          <option value="international" selected={band.country === 'international'}>International</option>
          {countries.map((country, index) => (
            <option key={index} value={country.iso2} selected={band.country === country.iso2}>{country.local_name}</option>
          ))}
        </select>
      </div>
      <fieldset className="form-control">
        <legend>Genres</legend>
        {console.log(selectedGenres)}
        {genres.map((genre, index) => (
          <GenreCheckbox key={index} band={band} genre={genre} selectedGenres={selectedGenres} setSelectedGenres={setSelectedGenres} />
        ))}
      </fieldset>
      <button type="submit" className="btn btn-primary">Speichern</button>
    </form>
  )
}