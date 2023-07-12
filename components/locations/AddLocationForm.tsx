import { Dispatch, SetStateAction, useState } from 'react'
import { useQueryClient } from 'react-query'
import { useAddLocation } from '../../hooks/useAddLocation'
import { Button } from '../Button'
import Modal from '../Modal'

interface AddLocationFormProps {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const AddLocationForm = ({ isOpen, setIsOpen }: AddLocationFormProps) => {
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const addLocation = useAddLocation({ name: name, city: city })

  if (addLocation.status === 'error') {
    console.log(addLocation.error)
  }

  if (addLocation.status === 'success') {
    queryClient.invalidateQueries('bands')
    setIsOpen(false)
  }
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <form className="flex flex-col gap-4">
        <h2>Location erstellen</h2>
        <div className="form-control">
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={event => setName(event?.target.value)}
            placeholder="Hallenstadion"
          />
          <label htmlFor="name">Name</label>
        </div>
        <div className="form-control">
          <input
            type="text"
            name="city"
            id="city"
            value={city}
            onChange={event => setCity(event?.target.value)}
            placeholder="Zürich"
          />
          <label htmlFor="city">Ort</label>
        </div>
        <div className="sticky bottom-0 flex md:justify-end gap-4 [&>*]:flex-1 py-4 bg-slate-800 z-10">
          <Button onClick={() => setIsOpen(false)} label="Abbrechen" />
          <Button
            label="Erstellen"
            onClick={() => addLocation.mutate()}
            style="primary"
            loading={addLocation.status === 'loading'}
          />
        </div>
      </form>
    </Modal>
  )
}
