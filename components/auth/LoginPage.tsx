'use client'

import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useSignIn } from '../../hooks/auth/useSignIn'
import { Button } from './../Button'
import { TextField } from './../forms/TextField'
import { StatusBanner } from './../forms/StatusBanner'
import { emailRegex } from '../../lib/emailRegex'
import Link from 'next/link'
import { SignInFormData } from '../../actions/auth'
import { useTranslations } from 'next-intl'
import { OAuthButtons } from './OAuthButtons'

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField,
  } = useForm<SignInFormData>()
  const { mutate, status, error } = useSignIn()
  const t = useTranslations('LoginPage')

  const onSubmit: SubmitHandler<SignInFormData> = async formData => {
    mutate(formData)
  }

  useEffect(() => {
    if (status === 'error') {
      resetField('password')
    }
  }, [status])
  return (
    <main className="container-sm">
      <h1>{t('loginToTrackConcerts')}</h1>
      <section className="rounded-lg bg-radial-gradient from-blue/20 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
          <TextField
            {...register('email', {
              required: true,
              pattern: { value: emailRegex, message: t('emailPatternError') },
            })}
            error={errors.email}
            type="email"
            label={t('email')}
            placeholder="william@delos.com"
          />
          <TextField
            {...register('password', { required: true })}
            error={errors.password}
            type="password"
            label={t('password')}
          />
          <div className="flex items-center gap-4">
            <Button
              type="submit"
              label={t('login')}
              appearance="primary"
              loading={status === 'pending'}
            />
            <Link href="/reset-password" className="text-sm font-bold text-venom hover:underline">
              {t('forgotPassword')}
            </Link>
          </div>
          {error && (
            <StatusBanner
              statusType="error"
              message={t.has(error.message) ? t(error.message) : error.message}
            />
          )}
        </form>
        <OAuthButtons />
      </section>
      <h3 className="mt-10">{t('youDontHaveAnAccountYet')}</h3>
      <p className="mb-4">{t('letsGetStarted')}</p>
      <Link href="/signup" className="btn btn-small btn-secondary">
        {t('signUp')}
      </Link>
    </main>
  )
}
