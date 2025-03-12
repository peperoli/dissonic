'use client'

import { emailRegex } from '@/lib/emailRegex'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useEditUser } from '../../hooks/auth/useEditUser'
import { Button } from '../Button'
import { StatusBanner } from '../forms/StatusBanner'
import { TextField } from '../forms/TextField'
import { useTranslations } from 'next-intl'

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
  const t = useTranslations('EmailForm')

  const onSubmit: SubmitHandler<FormFields> = async formData => {
    mutate(formData)
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
      <h2 className="mb-0">{t('changeEmail')}</h2>
      <p className="text-slate-300">{t('yourAccountIsConnectedWithThisEmailAddress')}</p>
      <TextField
        {...register('email', {
          required: true,
          pattern: { value: emailRegex, message: t('pleaseEnterAValidEmailAddress') },
        })}
        error={errors.email}
        type="email"
        label={t('newEmail')}
        placeholder="william@delos.com"
      />
      <div className="flex justify-end">
        <Button
          type="submit"
          label={t('save')}
          appearance="primary"
          loading={status === 'pending'}
        />
      </div>
      {status === 'error' && (
        <StatusBanner
          statusType="error"
          message={t(error.message)}
        />
      )}
      {status === 'success' && <StatusBanner statusType="success" message={t('successMessage')} />}
    </form>
  )
}
