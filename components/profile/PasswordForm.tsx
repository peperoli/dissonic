'use client'

import { SubmitHandler, useForm } from 'react-hook-form'
import { useEditUser } from '../../hooks/auth/useEditUser'
import { Button } from '../Button'
import { StatusBanner } from '../forms/StatusBanner'
import { TextField } from '../forms/TextField'

export const PasswordForm = () => {
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
      <div className="flex justify-end">
        <Button
          type="submit"
          label="Speichern"
          appearance="primary"
          loading={status === 'pending'}
        />
      </div>
      {status === 'error' && (
        <StatusBanner
          statusType="error"
          message="Es ist ein Fehler aufgetreten. Bitte versuche es erneut."
        />
      )}
      {status === 'success' && (
        <StatusBanner
          statusType="success"
          message="Du erhältst in Kürze eine E-Mail, in dem du die Änderung bestätigen kannst."
        />
      )}
    </form>
  )
}
