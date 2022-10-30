import { useState } from "react"
import supabase from "../utils/supabase"
import MultiSelect from "./MultiSelect"
import Button from "./Button"

export default function EditBandForm({ band, countries, genres, setIsSuccess, setIsOpen, setBand }) {
  const [selectedGenres, setSelectedGenres] = useState(band.genres || [])

  const newGenres = selectedGenres.filter(item => !band.genres.find(item2 => item.id === item2.id))
  const deleteGenres = band.genres.filter(item => !selectedGenres.find(item2 => item.id === item2.id))

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      const { error: editBandError } = await supabase
        .from('bands')
        .update({
          name: event.target.name.value,
          da_real_country: event.target.country.value,
        })
        .eq('id', band.id)

      if (editBandError) {
        throw editBandError
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
        throw addGenresError
      }

      if (deleteGenresError) {
        throw deleteGenresError
      }

      try {
        const { data: newBand, error: newBandError} = await supabase
          .from('bands')
          .select('*, da_real_country(id, iso2), genres(*)')
          .eq('id', band.id)
          .single()

        if (newBandError) {
          throw newBandError
        }

        setBand(newBand)
        setIsOpen(false)
        setIsSuccess(true)
      } catch {
        alert('gagu')
      }
    } catch (error) {
      alert(error)
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
        <select name="country" id="country" defaultValue={band.da_real_country?.id}>
          <option value="international">International</option>
          {countries.map((country, index) => (
            <option key={index} value={country.id}>{country.name}</option>
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
        <Button onClick={() => setIsOpen(false)} label="Abbrechen" />
        <button type="submit" className="btn btn-primary">Speichern</button>
      </div>
    </form>
  )
}