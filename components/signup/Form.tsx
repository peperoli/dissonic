'use client'

import { useForm } from 'react-hook-form'
import { useProfiles } from '../../hooks/profiles/useProfiles'
import { usernameRegex } from '../../lib/usernameRegex'
import { Button } from '../Button'
import { TextField } from '../forms/TextField'
import { useSignUp, type SignUpFormData } from '@/hooks/auth/useSignUp'
import { useTranslations } from 'next-intl'
import { StatusBanner } from '../forms/StatusBanner'
import { OAuthButtons } from '../auth/OAuthButtons'

export const Form = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({ mode: 'onChange' })
  const { data: profiles } = useProfiles()
  const { mutate, status, error } = useSignUp()

  const t = useTranslations('SignupForm')
  const usernames = profiles?.map(item => item.username)

  return status === 'success' ? (
    <StatusBanner statusType="success" message={t('successMessage')} className="mt-6" />
  ) : (
    <section>
      <form onSubmit={handleSubmit(formData => mutate(formData))} className="grid gap-5">
        <TextField
          {...register('email', { required: true })}
          error={errors.email}
          type="email"
          label={t('email')}
          placeholder="william@delos.com"
        />
        <TextField
          {...register('username', {
            required: true,
            minLength: { value: 4, message: t('usernameLengthError') },
            maxLength: { value: 16, message: t('usernameLengthError') },
            pattern: { value: usernameRegex, message: t('usernamePatternError') },
            validate: value => !usernames?.includes(value ?? '') || t('usernameTakenError'),
          })}
          error={errors.username}
          label={t('username')}
        />
        <TextField
          {...register('password', {
            required: true,
            minLength: { value: 12, message: t('passwordLengthError') },
          })}
          error={errors.password}
          type="password"
          label={t('password')}
          autoComplete="off"
        />
        <div>
          <Button
            type="submit"
            label={t('createAccount')}
            appearance="primary"
            loading={status === 'pending'}
          />
        </div>
      </form>
      {status === 'error' && (
        <StatusBanner
          statusType="error"
          message={
            'code' in error && (error.code === '23505' || error.code === '23503')
              ? t('emailAlreadyInUseError')
              : t.has(error.message)
                ? t(error.message)
                : t('genericError')
          }
          className="mt-6"
        />
      )}
      <OAuthButtons />
    </section>
  )
}
