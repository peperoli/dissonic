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
import { useTranslations } from 'next-intl'

export function ResetPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>()
  const { mutate, status, error } = useResetPassword()
  const t = useTranslations('ResetPasswordPage')

  const onSubmit: SubmitHandler<{ email: string }> = async formData => {
    mutate(formData.email)
  }
  return (
    <main className="container-sm">
      <Link href="/login" className="btn btn-tertiary mb-6">
        <ArrowLeft className="size-icon" />
        {t('login')}
      </Link>
      <h1>{t('resetPassword')}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 rounded-lg bg-slate-800 p-6">
        <TextField
          {...register('email', {
            required: true,
            pattern: { value: emailRegex, message: t('emailPatternError') },
          })}
          error={errors.email}
          type="email"
          label={t('email')}
          placeholder="william@delos.com"
          autoComplete="off"
        />
        <div className="flex items-center gap-4">
          <Button
            type="submit"
            label={t('resetPassword')}
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
          <StatusBanner statusType="success" message={t('resetPasswordSuccess')} />
        )}
      </form>
    </main>
  )
}
