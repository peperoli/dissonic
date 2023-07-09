import { ChangeEvent, Dispatch, SetStateAction, useReducer, useState } from 'react'
import { useBands } from '../../hooks/useBands'
import { useLocations } from '../../hooks/useLocations'
import { ActionType, editConcertReducer } from '../../reducers/editConcertReducer'
import { EditConcert } from '../../types/types'
import { Button } from '../Button'
import Modal from '../Modal'
import { MultiSelect } from '../MultiSelect'
import { useEditConcert } from '../../hooks/useEditConcert'
import { useQueryClient } from 'react-query'
import { useConcertContext } from '../../hooks/useConcertContext'

interface EditConcertFormProps {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const EditConcertForm = ({ isOpen, setIsOpen }: EditConcertFormProps) => {
  const { concert } = useConcertContext()
  const { data: bands } = useBands()
  const { data: locations } = useLocations()
  const queryClient = useQueryClient()

  const INITIAL_STATE: EditConcert = {
    name: concert.name,
    is_festival: concert.is_festival,
    date_start: concert.date_start,
    date_end: concert.date_end,
    location_id: concert.location?.id,
  }
  const [formState, formDispatch] = useReducer(editConcertReducer, INITIAL_STATE)
  const [selectedBands, setSelectedBands] = useState(concert.bands || [])

  const addBands = selectedBands.filter(item => !concert.bands?.find(item2 => item.id === item2.id))
  const deleteBands = concert.bands?.filter(
    item => !selectedBands.find(item2 => item.id === item2.id)
  ) || []
    
  const editConcert = useEditConcert(concert.id, formState, addBands, deleteBands)

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    formDispatch({
      type: ActionType.CHANGE_INPUT,
      payload: { name: event.target.name, value: event.target.value },
    })
  }

  if (editConcert.isError) {
    const error = editConcert.error as Error
    alert(error.message)
  }

  if (editConcert.isSuccess) {
    queryClient.invalidateQueries(['concert', concert.id])
    setIsOpen(false)
  }
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <form className="grid gap-6">
        <h2>Konzert bearbeiten</h2>
        <div className="form-control">
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Wacken Open Air"
            value={formState.name || ''}
            onChange={handleChange}
          />
          <label htmlFor="name">Name (optional)</label>
        </div>
        <div className="form-control">
          <label>
            <input
              type="checkbox"
              name="is_festival"
              value="isFestival"
              checked={formState.is_festival}
              onChange={() => formDispatch({ type: ActionType.TOGGLE_FESTIVAL })}
            />
            <span>Festival</span>
          </label>
        </div>
        <div className="flex gap-4">
          <div className="form-control">
            <input
              type="date"
              name="date_start"
              id="dateStart"
              value={formState.date_start}
              onChange={handleChange}
            />
            <label htmlFor="dateStart">{formState.is_festival ? 'Startdatum' : 'Datum'}</label>
          </div>
          {formState.is_festival && (
            <div className="form-control">
              <input
                type="date"
                name="date_end"
                id="dateEnd"
                value={formState.date_end || ''}
                onChange={handleChange}
              />
              <label htmlFor="dateEnd">Enddatum</label>
            </div>
          )}
        </div>
        {locations && (
          <div className="form-control">
            <select
              name="location_id"
              id="location"
              value={formState.location_id || ''}
              onChange={handleChange}
            >
              <option value="">Bitte wählen ...</option>
              {locations.map(location => (
                <option key={location.id} value={location.id}>
                  {location.name}
                  {location.city && ', ' + location.city}
                </option>
              ))}
            </select>
            <label htmlFor="location">Location</label>
          </div>
        )}
        {bands?.data && (
          <MultiSelect
            name="bands"
            options={bands.data}
            selectedOptions={selectedBands}
            setSelectedOptions={setSelectedBands}
          />
        )}
        <div className="sticky bottom-0 flex md:justify-end gap-4 [&>*]:flex-1 py-4 md:pb-0 bg-slate-800 z-10">
          <Button onClick={() => setIsOpen(false)} label="Abbrechen" />
          <Button
            onClick={() => editConcert.mutate()}
            label="Speichern"
            style="primary"
            loading={editConcert.isLoading}
          />
        </div>
      </form>
    </Modal>
  )
}
