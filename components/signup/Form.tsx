import { MutationStatus } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useProfiles } from '../../hooks/useProfiles'
import { usernameRegex } from '../../lib/usernameRegex'
import { Button } from '../Button'
import { TextField } from '../forms/TextField'

type Fields = {
  email: string
  username: string
  password: string
}

type FormProps = {
  onSubmit: (data: Fields) => void
  status: MutationStatus
}

export const Form = ({ onSubmit, status }: FormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Fields>({ mode: 'onChange' })
  const { data: profiles } = useProfiles()
  const usernames = profiles?.map(item => item.username)
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
      <TextField
        {...register('email', { required: true })}
        error={errors.email}
        type="email"
        label="E-Mail"
        placeholder="william@delos.com"
      />
      <TextField
        {...register('username', {
          required: true,
          minLength: { value: 4, message: 'Benutzername muss mindestens 4 Zeichen enthalten.' },
          maxLength: { value: 16, message: 'Benutzername darf maximal 16 Zeichen enthalten.' },
          pattern: {
            value: usernameRegex,
            message: 'Nur Buchstaben, Zahlen, Punkt und Understrich sind erlaubt.',
          },
          validate: value =>
            !usernames?.includes(value ?? '') ||
            'Dieser Benutzername ist bereits vergeben, sei mal kreativ.',
        })}
        error={errors.username}
        label="Benutzername"
        placeholder=""
      />
      <TextField
        {...register('password', {
          required: true,
          minLength: {
            value: 10,
            message: 'Das Passwort muss mindestens 10 Zeichen enthalten.',
          },
        })}
        error={errors.password}
        type="password"
        label="Passwort"
        autoComplete='off'
      />
      <div>
        <Button
          type="submit"
          label="Konto erstellen"
          appearance="primary"
          loading={status === 'loading'}
        />
      </div>
    </form>
  )
}
