import React, { Dispatch, FC, SetStateAction, SyntheticEvent, useState } from 'react'
import { Location } from '../../models/types'
import supabase from '../../utils/supabase'
import { Button } from '../Button'
import Modal from '../Modal'

interface AddLocationFormProps {
  locations: Location[]
  setLocations: Dispatch<SetStateAction<Location[]>>
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const AddLocationForm: FC<AddLocationFormProps> = ({
  locations,
  setLocations,
  isOpen,
  setIsOpen,
}) => {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: SyntheticEvent) {
    event.preventDefault()
    const target = event.target as typeof event.target & {
      name: { value: string }
      city: { value: string }
    }

    try {
      setLoading(true)
      const { data: newLocation, error: newLocationError } = await supabase
        .from('locations')
        .insert({
          name: target.name.value,
          city: target.city.value,
        })
        .select()
        .single()

      if (newLocationError) {
        throw newLocationError
      }

      setLocations([...locations, newLocation])
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
        <h2>Location erstellen</h2>
        <div className="form-control">
          <input type="text" name="name" id="name" placeholder="Hallenstadion" />
          <label htmlFor="name">Name</label>
        </div>
        <div className="form-control">
          <input type="text" name="city" id="city" placeholder="Zürich" />
          <label htmlFor="city">Ort</label>
        </div>
        <div className="sticky bottom-0 flex md:justify-end gap-4 [&>*]:flex-1 py-4 bg-slate-800 z-10">
          <Button onClick={() => setIsOpen(false)} label="Abbrechen" />
          <Button type="submit" label="Erstellen" style="primary" loading={loading} />
        </div>
      </form>
    </Modal>
  )
}
