'use client'

import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { TextField } from '../forms/TextField'
import { Button } from '../Button'
import { StatusBanner } from '../forms/StatusBanner'
import { AuthError } from '@supabase/supabase-js'
import { errorMessages } from '../../lib/errorMessages'
import { useEditUser } from '../../hooks/auth/useEditUser'
import { useRouter } from 'next/navigation'

export function UpdatePasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>({ mode: 'onChange' })
  const { mutate, status, error } = useEditUser()
  const { push } = useRouter()

  const onSubmit: SubmitHandler<{ email: string; password: string }> = async formData => {
    mutate(formData)
  }

  useEffect(() => {
    if (status === 'success') {
      push('/')
    }
  }, [status])
  return (
    <main className="container-sm">
      <h1>Neues Passwort setzen</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 rounded-lg bg-slate-800 p-6">
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
          autoComplete="off"
        />
        <div className="flex items-center gap-4">
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
            message={error instanceof AuthError ? errorMessages[error.message] : undefined}
          />
        )}
        {status === 'success' && (
          <StatusBanner statusType="success" message="Password erfolgreich zurückgesetzt." />
        )}
      </form>
    </main>
  )
}
