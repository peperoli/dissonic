import React, {
  ChangeEvent,
  Dispatch,
  FC,
  FormEvent,
  SetStateAction,
  useReducer,
  useState,
} from 'react'
import { MultiSelect } from '../MultiSelect'
import { Button } from '../Button'
import { useRouter } from 'next/navigation'
import Modal from '../Modal'
import { AddConcert, Band } from '../../types/types'
import Link from 'next/link'
import { useBands } from '../../hooks/useBands'
import { useLocations } from '../../hooks/useLocations'
import { useConcerts } from '../../hooks/useConcerts'
import { useAddConcert } from '../../hooks/useAddConcert'
import { ActionType, addConcertReducer } from '../../reducers/addConcertReducer'

interface AddConcertFormProps {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const AddConcertForm: FC<AddConcertFormProps> = ({ isOpen, setIsOpen }) => {
  const { data: bands } = useBands()
  const { data: locations } = useLocations()
  const { data: concerts } = useConcerts()

  const [today] = new Date().toISOString().split('T')
  const INITIAL_STATE: AddConcert = {
    name: '',
    is_festival: false,
    date_start: today,
    date_end: null,
    location_id: null,
  }

  const [formState, formDispatch] = useReducer(addConcertReducer, INITIAL_STATE)
  const [selectedBands, setSelectedBands] = useState<Band[]>([])

  const addConcert = useAddConcert(formState, selectedBands)
  const router = useRouter()

  const similarConcerts = concerts
    ?.filter(item => item.date_start === formState.date_start)
    .filter(item =>
      item.bands?.find(band => selectedBands.find(selectedBand => band.id === selectedBand.id))
    )
    .filter(item => item.location?.id === Number(formState.location_id))
  const isSimilar = similarConcerts && similarConcerts.length > 0

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    formDispatch({
      type: ActionType.CHANGE_INPUT,
      payload: { name: event.target.name, value: event.target.value },
    })
  }

  if (addConcert.isError) {
    const error = addConcert.error as Error
    alert(error.message)
  }

  if (addConcert.isSuccess) {
    router.push(`/concerts/${addConcert.data.id}`)
  }
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <form className="grid gap-6">
        <h2>Konzert hinzufügen</h2>
        <div className="form-control">
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Wacken Open Air"
            onChange={handleChange}
          />
          <label htmlFor="name">Name (optional)</label>
        </div>
        <div className="form-control">
          <label>
            <input
              type="checkbox"
              name="isFestival"
              value="isFestival"
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
              defaultValue={today}
              onChange={handleChange}
            />
            <label htmlFor="dateStart">{formState.is_festival ? 'Startdatum' : 'Datum'}</label>
          </div>
          {formState.is_festival && (
            <div className="form-control">
              <input type="date" name="date_end" id="dateEnd" onChange={handleChange} />
              <label htmlFor="dateEnd">Enddatum</label>
            </div>
          )}
        </div>
        {bands && (
          <MultiSelect
            name="bands"
            options={bands}
            selectedOptions={selectedBands}
            setSelectedOptions={setSelectedBands}
          />
        )}
        {locations && (
          <div className="form-control">
            <select name="location_id" id="locationId" defaultValue="" onChange={handleChange}>
              <option value="" hidden disabled>
                Bitte wählen ...
              </option>
              {locations.map(location => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
            <label htmlFor="locationId">Location</label>
          </div>
        )}
        {isSimilar && (
          <div className="p-4 rounded-lg bg-yellow/10">
            <div className="text-yellow">
              Folgende Konzerte mit ähnlichen Eigenschaften existieren bereits:
            </div>
            <div className="grid gap-2 mt-4">
              {similarConcerts.map(item => (
                <Link
                  key={item.id}
                  href={`/concerts/${item.id}`}
                  className="block px-4 py-2 rounded-md bg-slate-800 hover:bg-slate-750"
                >
                  <div>{item.date_start}</div>
                  <div className="font-bold">
                    {item.bands
                      ?.slice(0, 10)
                      .map(band => band.name)
                      .join(', ')}
                  </div>
                  <div>@ {item.location?.name}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
        <div className="sticky bottom-0 flex md:justify-end gap-4 [&>*]:flex-1 py-4 md:pb-0 bg-slate-800 z-10">
          <Button onClick={() => setIsOpen(false)} label="Abbrechen" />
          <Button
            onClick={() => addConcert.mutate()}
            label="Erstellen"
            style="primary"
            loading={addConcert.isLoading}
          />
        </div>
      </form>
    </Modal>
  )
}
