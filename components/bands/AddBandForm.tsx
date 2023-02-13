import {
  ChangeEvent,
  Dispatch,
  FC,
  SetStateAction,
  useReducer,
  useState,
} from 'react'
import { useQueryClient } from 'react-query'
import { useAddBand } from '../../hooks/useAddBand'
import { ActionType, addBandReducer } from '../../reducers/addBandReducer'
import { Band, Country, Genre } from '../../types/types'
import { Button } from '../Button'
import Modal from '../Modal'
import { MultiSelect } from '../MultiSelect'
import { SpotifyArtistSelect } from './SpotifyArtistSelect'

interface AddBandFormProps {
  countries?: Country[]
  genres?: Genre[]
  bands?: Band[]
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const AddBandForm: FC<AddBandFormProps> = ({
  countries,
  genres,
  bands,
  isOpen,
  setIsOpen,
}) => {
  const queryClient = useQueryClient()

  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([])
  const [formState, formDispatch] = useReducer(addBandReducer, {
    name: '',
    country_id: null,
  })
  const [spotifyArtistId, setSpotifyArtistId] = useState('')

  const addBand = useAddBand(formState, selectedGenres, spotifyArtistId || null)
  const regExp = new RegExp(formState.name, 'i')
  const similarBands = bands?.filter(item => item.name.match(regExp)) || []
  const isSimilar = formState.name.length >= 3 && similarBands.length > 0

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    formDispatch({
      type: ActionType.CHANGE_INPUT,
      payload: { name: event.target.name, value: event.target.value },
    })
  }

  if (addBand.isError) {
    const error = addBand.error as Error
    alert(error.message)
  }

  if (addBand.isSuccess) {
    queryClient.invalidateQueries('bands')
    setIsOpen(false)
  }
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <form className="flex flex-col gap-4">
        <h2>Band erstellen</h2>
        <div className="form-control">
          <input
            type="text"
            name="name"
            id="name"
            value={formState.name}
            onChange={handleChange}
            placeholder="Beatles"
          />
          <label htmlFor="name">Name</label>
          {isSimilar && (
            <div className="mt-2">
              <p className="text-red">Vorsicht, diese Band könnte schon vorhanden sein:</p>
              <ul className="list-disc list-inside text-slate-300">
                {similarBands.map(band => (
                  <li key={band.id}>{band.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="form-control">
          <select
            name="country_id"
            id="country_id"
            value={formState.country_id || ''}
            onChange={handleChange}
          >
            <option value="" disabled hidden>
              Bitte wählen ...
            </option>
            {countries?.map((item, index) => (
              <option key={index} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <label htmlFor="country">Land</label>
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
          setValue={setSpotifyArtistId}
        />
        <div className="sticky md:static bottom-0 flex md:justify-end gap-4 [&>*]:flex-1 py-4 md:pb-0 bg-slate-800 z-10 md:z-0">
          <Button onClick={() => setIsOpen(false)} label="Abbrechen" />
          <Button
            onClick={() => addBand.mutate()}
            label="Erstellen"
            style="primary"
            loading={addBand.isLoading}
          />
        </div>
      </form>
    </Modal>
  )
}
