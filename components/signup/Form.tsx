'use client'

import { useForm } from 'react-hook-form'
import { useProfiles } from '../../hooks/profiles/useProfiles'
import { usernameRegex } from '../../lib/usernameRegex'
import { Button } from '../Button'
import { TextField } from '../forms/TextField'
import { signInWithOAuth, signUp as signUpAction, SignUpFormData } from '../../actions/auth'
import { useTranslations } from 'next-intl'
import { StatusBanner } from '../forms/StatusBanner'
import { useMutation } from '@tanstack/react-query'
import { SiGoogle, SiSpotify } from '@icons-pack/react-simple-icons'

export const Form = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({ mode: 'onChange' })
  const { data: profiles } = useProfiles()
  const signUp = useMutation({
    mutationFn: signUpAction,
    onError: error => console.error(error),
  })
  const signInWithGoogle = useMutation({
    mutationFn: () => signInWithOAuth('google'),
    onError: error => console.error(error),
  })
  const signInWithSpotify = useMutation({
    mutationFn: () => signInWithOAuth('spotify'),
    onError: error => console.error(error),
  })
  const t = useTranslations('SignupForm')
  const usernames = profiles?.map(item => item.username)

  return signUp.status === 'success' ? (
    <StatusBanner statusType="success" message={t('successMessage')} className="mt-6" />
  ) : (
    <section className="rounded-lg bg-slate-800 p-6">
      <form onSubmit={handleSubmit(formData => signUp.mutate(formData))} className="grid gap-5">
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
            loading={signUp.status === 'pending'}
          />
        </div>
      </form>
      {signUp.status === 'error' && (
        <StatusBanner
          statusType="error"
          message={
            'code' in signUp.error && signUp.error.code === '23505'
              ? t('emailAlreadyInUseError')
              : t(signUp.error.message)
          }
          className="mt-6"
        />
      )}
      <div className="mt-6 grid gap-3">
        <span className="section-headline">{t('or')}</span>
        <Button
          label={t('continueWithGoogle')}
          onClick={() => signInWithGoogle.mutate()}
          icon={<SiGoogle className="size-icon" />}
          appearance="secondary"
          loading={signInWithGoogle.status === 'pending'}
        />
        <Button
          label={t('continueWithSpotify')}
          onClick={() => signInWithSpotify.mutate()}
          icon={<SiSpotify className="size-icon" />}
          appearance="secondary"
          loading={signInWithSpotify.status === 'pending'}
        />
      </div>
    </section>
  )
}
