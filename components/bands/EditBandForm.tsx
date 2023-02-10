import {
  ChangeEvent,
  Dispatch,
  FC,
  SetStateAction,
  useReducer,
  useState,
} from 'react'
import { MultiSelect } from '../MultiSelect'
import { Button } from '../Button'
import Modal from '../Modal'
import { Band } from '../../types/types'
import { useCountries } from '../../hooks/useCountries'
import { useGenres } from '../../hooks/useGenres'
import { SpotifyArtistSelect } from './SpotifyArtistSelect'
import { ActionType, editBandReducer } from '../../reducers/editBandReducer'
import { useEditBand } from '../../hooks/useEditBand'
import { useQueryClient } from 'react-query'

interface EditBandFormProps {
  band: Band
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const EditBandForm: FC<EditBandFormProps> = ({ band, isOpen, setIsOpen }) => {
  const { data: countries } = useCountries()
  const { data: genres } = useGenres()
  const queryClient = useQueryClient()

  const [formState, formDispatch] = useReducer(editBandReducer, {
    name: band.name,
    country_id: band.country_id,
  })
  const [selectedGenres, setSelectedGenres] = useState(band.genres || [])
  const [spotifyArtistId, setSpotifyArtistId] = useState(band.spotify_artist_id || '')

  const addGenres = selectedGenres.filter(item => !band.genres?.find(item2 => item.id === item2.id))
  const deleteGenres = band.genres?.filter(
    item => !selectedGenres.find(item2 => item.id === item2.id)
  ) || []

  const editBand = useEditBand(band.id, formState, addGenres, deleteGenres, spotifyArtistId || null)

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    formDispatch({
      type: ActionType.CHANGE_INPUT,
      payload: { name: event.target.name, value: event.target.value },
    })
  }

  if (editBand.isError) {
    const error = editBand.error as Error
    alert(error.message)
  }

  if (editBand.isSuccess) {
    queryClient.invalidateQueries(['band', band.id])
    setIsOpen(false)
  }
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <form className="flex flex-col gap-4">
        <h2>Band bearbeiten</h2>
        <div className="form-control">
          <input type="text" name="name" id="name" value={formState.name} onChange={handleChange} />
          <label htmlFor="name">Name</label>
        </div>
        <div className="form-control">
          <select
            name="country_id"
            id="country_id"
            value={formState.country_id || ''}
            onChange={handleChange}
          >
            <option value="international">International</option>
            {countries?.map((item, index) => (
              <option key={index} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <label htmlFor="country_id">Land</label>
        </div>
        {genres && (
          <MultiSelect
            name="genres"
            options={genres}
            selectedOptions={selectedGenres}
            setSelectedOptions={setSelectedGenres}
          />
        )}
        <SpotifyArtistSelect
          bandName={formState?.name || ''}
          value={spotifyArtistId}
          onValueChange={setSpotifyArtistId}
        />
        <div className="sticky md:static bottom-0 flex md:justify-end gap-4 [&>*]:flex-1 py-4 md:p-0 bg-slate-800 z-10 md:z-0">
          <Button onClick={() => setIsOpen(false)} label="Abbrechen" />
          <Button
            onClick={() => editBand.mutate()}
            label="Speichern"
            style="primary"
            loading={editBand.isLoading}
          />
        </div>
      </form>
    </Modal>
  )
}
