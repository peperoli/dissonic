'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useSignIn } from '../../hooks/auth/useSignIn'
import { Button } from './../Button'
import { TextField } from './../forms/TextField'
import { AuthError } from '@supabase/supabase-js'
import { errorMessages } from '../../lib/errorMessages'
import { StatusBanner } from './../forms/StatusBanner'
import { emailRegex } from '../../lib/emailRegex'
import Link from 'next/link'
import { SignInFormData } from '../../actions/auth'

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField,
  } = useForm<SignInFormData>()
  const { mutate, status, error } = useSignIn()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect')

  const onSubmit: SubmitHandler<SignInFormData> = async formData => {
    mutate(formData)
  }

  useEffect(() => {
    if (status === 'success') {
      router.push(redirect ? redirect : '/')
    }
    if (status === 'error') {
      resetField('password')
    }
  }, [status])
  return (
    <main className="container-sm">
      <h1>Anmelden &amp; Konzerte eintragen</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 p-6 rounded-lg bg-radial-gradient from-blue/20">
        <TextField
          {...register('email', {
            required: true,
            pattern: { value: emailRegex, message: 'Bitte gib eine E-Mail-Adresse ein.' },
          })}
          error={errors.email}
          type="email"
          label="E-Mail"
          placeholder="william@delos.com"
        />
        <TextField
          {...register('password', { required: true })}
          error={errors.password}
          type="password"
          label="Passwort"
        />
        <div className="flex items-center gap-4">
          <Button
            type="submit"
            label="Anmelden"
            appearance="primary"
            loading={status === 'loading'}
          />
          <Link href="/reset-password" className="text-sm font-bold text-venom hover:underline">
            Passwort vergessen?
          </Link>
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
      </form>
      <h3 className="mt-10">Hast du noch gar kein Konto?</h3>
      <p className="mb-4">Dann nichts wie los!</p>
      <Button
        label="Registrieren"
        onClick={() => router.push('/signup')}
        size="small"
        appearance="secondary"
      />
    </main>
  )
}
