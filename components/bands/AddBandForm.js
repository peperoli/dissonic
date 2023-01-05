import { useState } from "react"
import supabase from "../../utils/supabase"
import { Button } from "../Button"
import { MultiSelect } from "../MultiSelect"

export default function AddBandForm({ countries, genres, bands, setBands, setIsOpen }) {
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

    try {
      const { data: band, error: bandError } = await supabase
        .from('bands')
        .insert({
          name: event.target.name.value,
          country: event.target.country.value,
        })
        .single()
        .select()

      if (bandError) {
        throw bandError
      }

      const { error: genresError } = await supabase
        .from('j_band_genres')
        .insert(selectedGenres.map(genre => ({ band_id: band?.id, genre_id: genre.id })))

      if (genresError) {
        throw genresError
      }

      try {
        const { data: newBand, error: newBandError } = await supabase
          .from('bands')
          .select('*, country(*), genres(*)')
          .eq('id', band.id)
          .single()

        if (newBandError) {
          throw newBandError
        }

        setBands([
          ...bands,
          newBand
        ])
        setIsOpen(false)
      } catch (error) {
        alert(error.message)
      }
    } catch (error) {
      alert(error.message)
    }
  }
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2>Band erstellen</h2>
      <div className="form-control">
        <input type="text" name="name" id="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Beatles" />
        <label htmlFor="name">Name</label>
        {isSimilar ? (
          <div className="mt-2">
            <p className="text-red">Vorsicht, diese Band könnte schon vorhanden sein:</p>
            <ul className="list-disc list-inside text-slate-300">
              {similarBands.map(band => (
                <li key={band.id}>{band.name}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-2 text-slate-300">Nice. Die scheint es noch nicht zu geben.</p>
        )}
      </div>
      <div className="form-control">
        <select name="country" id="country" defaultValue="">
          <option value="" disabled hidden>Bitte wählen ...</option>
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
      <div className="sticky bottom-0 flex md:justify-end gap-4 [&>*]:flex-1 py-4 md:pb-0 bg-slate-800 z-10">
        <Button onClick={() => setIsOpen(false)} label="Abbrechen" />
        <button type="submit" className="btn btn-primary">Erstellen</button>
      </div>
    </form>
  )
}