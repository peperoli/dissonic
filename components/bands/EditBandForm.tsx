import { Dispatch, FC, SetStateAction, SyntheticEvent, useState } from 'react'
import supabase from '../../utils/supabase'
import { MultiSelect } from '../MultiSelect'
import { Button } from '../Button'
import Modal from '../Modal'
import { Band, Country, Genre } from '../../models/types'

interface EditBandFormProps {
  band: Band
  countries: Country[]
  genres: Genre[]
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  setBand: Dispatch<SetStateAction<Band>>
}

export const EditBandForm: FC<EditBandFormProps> = ({
  band,
  countries,
  genres,
  isOpen,
  setIsOpen,
  setBand,
}) => {
  const [selectedGenres, setSelectedGenres] = useState(band.genres || [])
  const [loading, setLoading] = useState(false)

  const newGenres = selectedGenres.filter(item => !band.genres?.find(item2 => item.id === item2.id))
  const deleteGenres = band.genres?.filter(
    item => !selectedGenres.find(item2 => item.id === item2.id)
  )

  async function handleSubmit(event: SyntheticEvent) {
    event.preventDefault()
    const target = event.target as typeof event.target & {
      name: { value: string }
      country: { value: number }
    }

    try {
      setLoading(true)
      const { error: editBandError } = await supabase
        .from('bands')
        .update({
          name: target.name.value,
          country_id: target.country.value,
        })
        .eq('id', band.id)

      if (editBandError) {
        throw editBandError
      }

      const { error: addGenresError } = await supabase
        .from('j_band_genres')
        .insert(newGenres.map(genre => ({ band_id: band.id, genre_id: genre.id })))

      if (addGenresError) {
        throw addGenresError
      }
      
      if (deleteGenres) {
        const { error: deleteGenresError } = await supabase
          .from('j_band_genres')
          .delete()
          .eq('band_id', band.id)
          .in(
            'genre_id',
            deleteGenres.map(item => item.id)
          )

        if (deleteGenresError) {
          throw deleteGenresError
        }
      }

      const { data: newBand, error: newBandError } = await supabase
        .from('bands')
        .select('*, country:countries(id, iso2), genres(*)')
        .eq('id', band.id)
        .single()

      if (newBandError) {
        throw newBandError
      }

      setBand(newBand)
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
        <h2>Band bearbeiten</h2>
        <div className="form-control">
          <input type="text" name="name" id="name" defaultValue={band.name} />
          <label htmlFor="name">Name</label>
        </div>
        <div className="form-control">
          <select name="country" id="country" defaultValue={band.country?.id}>
            <option value="international">International</option>
            {countries.map((country, index) => (
              <option key={index} value={country.id}>
                {country.name}
              </option>
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
        <div className="sticky bottom-0 flex md:justify-end gap-4 [&>*]:flex-1 py-4 bg-slate-800 z-10">
          <Button onClick={() => setIsOpen(false)} label="Abbrechen" />
          <Button type="submit" label="Speichern" style="primary" loading={loading} />
        </div>
      </form>
    </Modal>
  )
}
