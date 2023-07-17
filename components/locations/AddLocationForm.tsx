import { Dispatch, SetStateAction } from 'react'
import { useAddLocation } from '../../hooks/useAddLocation'
import { AddLocation } from '../../types/types'
import { Button } from '../Button'
import { TextField } from '../forms/TextField'
import Modal from '../Modal'
import { useForm, SubmitHandler } from 'react-hook-form'

interface AddLocationFormProps {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const AddLocationForm = ({ isOpen, setIsOpen }: AddLocationFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddLocation>()
  const { mutate, status } = useAddLocation()

  const onSubmit: SubmitHandler<AddLocation> = async function (formData) {
    mutate(formData)
  }

  if (status === 'success') {
    setIsOpen(false)
  }
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <h2 className="mb-8">Location erstellen</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <TextField
          {...register('name', { required: true })}
          error={errors.name}
          label="Name"
          placeholder="Hallenstadion"
        />
        <TextField
          {...register('city', { required: true })}
          error={errors.city}
          label="Stadt"
          placeholder="Zürich"
        />
        <div className="sticky bottom-0 flex md:justify-end gap-4 [&>*]:flex-1 py-4 bg-slate-800 z-10">
          <Button onClick={() => setIsOpen(false)} label="Abbrechen" />
          <Button type="submit" label="Erstellen" style="primary" loading={status === 'loading'} />
        </div>
      </form>
    </Modal>
  )
}
