'use client'

import { emailRegex } from '@/lib/emailRegex'
import { errorMessages } from '@/lib/errorMessages'
import { AuthError } from '@supabase/supabase-js'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useEditUser } from '../../hooks/auth/useEditUser'
import { Button } from '../Button'
import { StatusBanner } from '../forms/StatusBanner'
import { TextField } from '../forms/TextField'

type FormFields = {
  email: string
}

export const EmailForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>()
  const { mutate, status, error } = useEditUser()

  const onSubmit: SubmitHandler<FormFields> = async formData => {
    mutate(formData)
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
      <h2 className="mb-0">E-Mail ändern</h2>
      <p className="text-slate-300">Mit dieser E-Mail-Adresse ist dein Konto verknüpft.</p>
      <TextField
        {...register('email', {
          required: true,
          pattern: { value: emailRegex, message: 'Bitte gib eine gültige E-Mail-Adresse ein.' },
        })}
        error={errors.email}
        type="email"
        label="E-Mail"
        placeholder="william@delos.com"
      />
      <div className="flex justify-end">
        <Button
          type="submit"
          label="Speichern"
          appearance="primary"
          loading={status === 'loading'}
        />
      </div>
      {status === 'error' && (
        <StatusBanner
          statusType="error"
          message={
            error instanceof AuthError
              ? errorMessages[error.message]
              : 'Es ist eine Fehler aufgetreten. Bitte versuche es erneut.'
          }
        />
      )}
      {status === 'success' && (
        <StatusBanner
          statusType="success"
          message="Du erhältst in Kürze eine E-Mail, in der du die Änderung bestätigen kannst."
        />
      )}
    </form>
  )
}
