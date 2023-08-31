'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useSignIn } from '../hooks/useSignIn'
import { Button } from './Button'
import { TextField } from './forms/TextField'
import { PageWrapper } from './layout/PageWrapper'
import { AuthError } from '@supabase/supabase-js'
import { errorMessages } from '../lib/errorMessages'
import { StatusBanner } from './forms/StatusBanner'
import { emailRegex } from '../lib/emailRegex'

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField,
  } = useForm<{ email: string; password: string }>()
  const { mutate, status, error } = useSignIn()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect')

  const onSubmit: SubmitHandler<{ email: string; password: string }> = async formData => {
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
    <PageWrapper>
      <main className="container-sm">
        <h1>Anmelden &amp; Konzerte eintragen</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
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
          <div>
            <Button type="submit" label="Anmelden" style="primary" loading={status === 'loading'} />
          </div>
          {status === 'error' && (
            <StatusBanner
              statusType="error"
              message={error instanceof AuthError ? errorMessages[error.message] : undefined}
            />
          )}
        </form>
        <h3 className="mt-10">Hast du noch gar kein Konto?</h3>
        <p className="mb-4">Dann nichts wie los!</p>
        <Button
          label="Registrieren"
          onClick={() => router.push('/signup')}
          size="small"
          style="secondary"
        />
      </main>
    </PageWrapper>
  )
}
