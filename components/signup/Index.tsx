'use client'
import React from 'react'
import { PageWrapper } from '../layout/PageWrapper'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Button } from '../Button'
import { TextField } from '../forms/TextField'
import { CheckIcon } from '@heroicons/react/20/solid'
import { useSignUp } from '../../hooks/useGagu'
import { StatusBanner } from '../forms/StatusBanner'
import { AuthError } from '@supabase/supabase-js'
import { errorMessages } from '../../lib/errorMessages'
import { useRouter } from 'next/navigation'

export const Index = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>({ mode: 'onChange' })
  const { mutate, status, error } = useSignUp()
  const { push } = useRouter()

  const onSubmit: SubmitHandler<{ email: string; password: string }> = async formData => {
    mutate(formData)
  }
  return (
    <PageWrapper>
      <main className="w-full max-w-lg p-8">
        <h1>
          <span className="text-[1.5em]">Willkommen,</span>
          <br />
          geschätzter Fan von Live-Musik!
        </h1>
        <p className="mb-2">Ein Concert-Diary-Konto ermöglicht dir folgende Funktionen:</p>
        <ul className="mb-6">
          <li className="flex items-center gap-4">
            <CheckIcon className="h-icon text-slate-300" />
            Konzerte, Bands und Locations eintragen und aktualisieren
          </li>
          <li className="flex items-center gap-4">
            <CheckIcon className="h-icon text-slate-300" />
            Deine Konzert-Historie und Statistiken einsehen
          </li>
          <li className="flex items-center gap-4">
            <CheckIcon className="h-icon text-slate-300" />
            Bands markieren, die du live erlebt hast
          </li>
          <li className="flex items-center gap-4">
            <CheckIcon className="h-icon text-slate-300" />
            Konzerte kommentieren und auf Kommentare reagieren
          </li>
        </ul>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
          <TextField
            {...register('email', { required: true })}
            error={errors.email}
            type="email"
            label="E-Mail"
            placeholder="william@delos.com"
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
          />
          <div>
            <Button type="submit" label="Konto erstellen" style="primary" loading={status === 'loading'} />
          </div>
          {status === 'error' && (
            <StatusBanner
              message={error instanceof AuthError ? errorMessages[error.message] : undefined}
            />
          )}
        </form>
        <h3 className="mt-10">Hast du bereits ein Konto?</h3>
        <Button label="Anmelden" onClick={() => push('/login')} size="small" style="secondary" />
      </main>
    </PageWrapper>
  )
}
