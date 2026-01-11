'use client'

import { resendConfirmationEmail } from '@/actions/auth'
import { Button } from '@/components/Button'
import { StatusBanner } from '@/components/forms/StatusBanner'
import { TextField } from '@/components/forms/TextField'
import { useMutation } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'

type ResendConfirmationFormData = {
  email: string
}

export default function ResendConfirmationPage() {
  const { register, handleSubmit } = useForm<ResendConfirmationFormData>()
  const { mutate, status, error } = useMutation({
    mutationFn: resendConfirmationEmail,
    onError: error => {
      console.error(error)
    },
  })
  const t = useTranslations('ResendConfirmationPage')

  return (
    <main className="container-sm">
      <h1>{t('resendConfirmation')}</h1>
      <p className="mb-6">{t('resendConfirmationDescription')}</p>
      <form
        onSubmit={handleSubmit(formData => mutate(formData))}
        className="grid gap-5 rounded-lg bg-slate-800 p-6"
      >
        <TextField {...register('email', { required: true })} type="email" label={t('email')} />
        <Button type="submit" label={t('resendConfirmation')} loading={status === 'pending'} />
        {status === 'error' && <StatusBanner statusType="error" message={t(error.message)} />}
        {status === 'success' && (
          <StatusBanner statusType="success" message={t('resendConfirmationSuccess')} />
        )}
      </form>
    </main>
  )
}
