'use client'
import React from 'react'
import { PageWrapper } from '../layout/PageWrapper'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Button } from '../Button'
import { TextField } from '../forms/TextField'
import { useSignUp } from '../../hooks/useSignup'
import { CheckIcon } from '@heroicons/react/20/solid'

export const Index = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>()
  const { mutate, status } = useSignUp()

  const onSubmit: SubmitHandler<{ email: string; password: string }> = async formData => {
    mutate(formData)
  }
  return (
    <PageWrapper>
      <main className="w-full max-w-lg p-8">
        <h1>
          <span className="text-[1.5em]">Willkommen,</span>
          <br />
          lieber Fan von Live-Musik!
        </h1>
        <p className="mb-6">
          Ein Concert-Diary-Konto ermöglicht dir folgende Funktionen:
          <ul className="my-2">
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
        </p>
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
            <Button type="submit" label="Anmelden" style="primary" loading={status === 'loading'} />
          </div>
        </form>
      </main>
    </PageWrapper>
  )
}
