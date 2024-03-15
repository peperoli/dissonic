import { useAddLocation } from '../../hooks/locations/useAddLocation'
import { AddLocation } from '../../types/types'
import { Button } from '../Button'
import { TextField } from '../forms/TextField'
import { useForm, SubmitHandler } from 'react-hook-form'

interface FormProps {
  close: () => void
}

export const Form = ({ close }: FormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddLocation>()
  const { mutate, status } = useAddLocation()

  const onSubmit: SubmitHandler<AddLocation> = async function (formData) {
    mutate(formData)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <h2 className="mb-0">Location erstellen</h2>
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
      <div className="sticky bottom-0 z-10 flex gap-4 bg-slate-800 py-4 md:justify-end [&>*]:flex-1">
        <Button onClick={close} label="Abbrechen" />
        <Button
          type="submit"
          label="Speichern"
          appearance="primary"
          loading={status === 'loading'}
        />
      </div>
    </form>
  )
}
