import { SubmitHandler, useForm } from 'react-hook-form'
import { useEditUser } from '../../hooks/auth/useEditUser'
import { Button } from '../Button'
import { TextField } from '../forms/TextField'

interface PasswordFormProps {
  close: () => void
}

export const PasswordForm = ({ close }: PasswordFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ password: string }>({ mode: 'onChange' })
  const { mutate, status } = useEditUser()

  const onSubmit: SubmitHandler<{ password: string }> = async formData => {
    mutate(formData)
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
      <h2 className="mb-0">Passwort ändern</h2>
      <TextField
        {...register('password', {
          required: true,
          minLength: { value: 10, message: 'Das Passwort muss mindestens 10 Zeichen enthalten.' },
        })}
        error={errors.password}
        label="Passwort"
        type="password"
      />
      <div className="sticky bottom-0 z-10 flex gap-4 bg-slate-800 py-4 md:justify-end md:pb-0 [&>*]:flex-1">
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
