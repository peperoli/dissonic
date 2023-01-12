import { Dispatch, FC, SetStateAction, SyntheticEvent, useState } from "react"
import { Band, Country, Genre } from "../../types/types"
import { Database } from "../../types/supabase"
import supabase from "../../utils/supabase"
import { Button } from "../Button"
import Modal from "../Modal"
import { MultiSelect } from "../MultiSelect"

interface AddBandFormProps {
  countries: Country[]
  genres: Genre[]
  bands: Band[]
  setBands: Dispatch<SetStateAction<Band[]>>
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const AddBandForm: FC<AddBandFormProps> = ({ countries, genres, bands, setBands, isOpen, setIsOpen }) => {
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const regExp = new RegExp(name, 'i')
  const similarBands = name.length >= 3 ? bands.filter(item => item.name.match(regExp)) : []
  const isSimilar = similarBands.length > 0

  async function handleSubmit(event: SyntheticEvent) {
    event.preventDefault()
    const target = event.target as typeof event.target & {
      name: { value: string }
      country: { value: number }
    }

    try {
      setLoading(true)
      const { data: band, error: bandError } = await supabase
        .from('bands')
        .insert({
          name: target.name.value,
          country_id: target.country.value,
        })
        .select()
        .single()

      if (bandError) {
        throw bandError
      }

      const { error: genresError } = await supabase
        .from('j_band_genres')
        .insert(selectedGenres.map(genre => ({ band_id: band?.id, genre_id: genre.id })))

      if (genresError) {
        throw genresError
      }

      const { data: newBand, error: newBandError } = await supabase
        .from('bands')
        .select('*, country:countries(*), genres(*)')
        .eq('id', band.id)
        .single()

      if (newBandError) {
        throw newBandError
      }
      setBands([...bands, newBand])
      setIsOpen(false)
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      } else {
        alert('Oops')
        console.error(error)
      }
    } finally {
      setLoading(false)
    }
  }
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
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
          <Button type="submit" label="Erstellen" style="primary" loading={loading} />
        </div>
      </form>
    </Modal>
  )
}