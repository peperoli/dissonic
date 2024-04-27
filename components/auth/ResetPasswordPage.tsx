'use client'

import Link from 'next/link'
import { SubmitHandler, useForm } from 'react-hook-form'
import { TextField } from './../forms/TextField'
import { useResetPassword } from '../../hooks/auth/useResetPassword'
import { emailRegex } from '../../lib/emailRegex'
import { Button } from './../Button'
import { StatusBanner } from './../forms/StatusBanner'
import { AuthError } from '@supabase/supabase-js'
import { errorMessages } from '../../lib/errorMessages'
import { ArrowLeft } from 'lucide-react'

export function ResetPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>()
  const { mutate, status, error } = useResetPassword()

  const onSubmit: SubmitHandler<{ email: string }> = async formData => {
    mutate(formData.email)
  }
  return (
    <main className="container-sm">
      <Link href="/login" className="btn btn-link mb-6">
        <ArrowLeft className="size-icon" />
        Zurück
      </Link>
      <h1>Passwort zurücksetzen</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 rounded-lg bg-slate-800 p-6">
        <TextField
          {...register('email', {
            required: true,
            pattern: { value: emailRegex, message: 'Bitte gib eine E-Mail-Adresse ein.' },
          })}
          error={errors.email}
          type="email"
          label="E-Mail"
          placeholder="william@delos.com"
          autoComplete="off"
        />
        <div className="flex items-center gap-4">
          <Button
            type="submit"
            label="Bestätigen"
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
          <StatusBanner
            statusType="success"
            message="Eine E-Mail mit dem Zurücksetzen-Link wurde versendet."
          />
        )}
      </form>
    </main>
  )
}
