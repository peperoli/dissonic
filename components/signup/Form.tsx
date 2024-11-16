import { MutationStatus } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useProfiles } from '../../hooks/profiles/useProfiles'
import { usernameRegex } from '../../lib/usernameRegex'
import { Button } from '../Button'
import { TextField } from '../forms/TextField'
import { SignUpFormData } from '../../actions/auth'
import { useTranslations } from 'next-intl'

type FormProps = {
  onSubmit: (data: SignUpFormData) => void
  status: MutationStatus
}

export const Form = ({ onSubmit, status }: FormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({ mode: 'onChange' })
  const { data: profiles } = useProfiles()
  const t = useTranslations('SignupForm')
  const usernames = profiles?.map(item => item.username)
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
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
  )
}
