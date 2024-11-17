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
import { useTranslations } from 'next-intl'

export function UpdatePasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>({ mode: 'onChange' })
  const { mutate, status, error } = useEditUser()
  const { push } = useRouter()
  const t = useTranslations('UpdatePasswordPage')

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
      <h1>{t('updatePassword')}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 rounded-lg bg-slate-800 p-6">
        <TextField
          {...register('password', {
            required: true,
            minLength: { value: 12, message: t('passwordLengthError') },
          })}
          error={errors.password}
          type="password"
          label={t('newPassword')}
          autoComplete="off"
        />
        <div className="flex items-center gap-4">
          <Button
            type="submit"
            label={t('updatePassword')}
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
          <StatusBanner statusType="success" message={t('updatePasswordSuccess')} />
        )}
      </form>
    </main>
  )
}
