'use client'
import { SubmitHandler } from 'react-hook-form'
import { Button } from '../Button'
import { CheckIcon } from 'lucide-react'
import { useSignUp } from '../../hooks/auth/useSignup'
import { StatusBanner } from '../forms/StatusBanner'
import { useRouter } from 'next/navigation'
import { Form } from './Form'
import { AuthError, PostgrestError } from '@supabase/supabase-js'
import { SignUpFormData } from '../../actions/auth'
import { useTranslations } from 'next-intl'

export const SignupPage = () => {
  const signUp = useSignUp()
  const { push } = useRouter()
  const t = useTranslations('SignupPage')

  const onSubmit: SubmitHandler<SignUpFormData> = async formData => {
    signUp.mutate(formData)
  }

  const error = signUp.error as AuthError | PostgrestError
  return (
    <main className="container-sm">
      <section className="rounded-2xl bg-radial-gradient from-venom/50 p-8">
        <h1>
          {t.rich('welcome', {
            span: chunk => <span className="text-[1.5em]">{chunk}</span>,
          })}
        </h1>
        <p className="mb-2">{t('aDissonicAccountGivesYouTheFollowingFeatures')}</p>
        <ul className="mb-6">
          <li className="flex items-center gap-4">
            <CheckIcon className="size-icon flex-shrink-0 text-slate-300" />
            {t('trackBandsAndConcertsYouHaveExperiencedLive')}
          </li>
          <li className="flex items-center gap-4">
            <CheckIcon className="size-icon flex-shrink-0 text-slate-300" />
            {t('seeYourConcertHistoryAndStatistics')}
          </li>
          <li className="flex items-center gap-4">
            <CheckIcon className="size-icon flex-shrink-0 text-slate-300" />
            {t('commentOnConcertsAndReactToComments')}
          </li>
          <li className="flex items-center gap-4">
            <CheckIcon className="size-icon flex-shrink-0 text-slate-300" />
            {t('contributeConcertsBandsAndLocations')}
          </li>
        </ul>
      </section>
      {signUp.status !== 'success' && (
        <section className="rounded-lg bg-slate-800 p-6">
          <Form onSubmit={onSubmit} status={signUp.status} />
        </section>
      )}
      {signUp.status === 'error' && (
        <StatusBanner
          statusType="error"
          message={
            'code' in error && error.code === '23505'
              ? t('emailAlreadyInUseError')
              : t(error.message)
          }
          className="mt-6"
        />
      )}
      {signUp.status === 'success' && (
        <StatusBanner statusType="success" message={t('successMessage')} className="mt-6" />
      )}
      <h2 className="mt-10">{t('doYouHavAnAccountAlready')}</h2>
      <Button label={t('login')} onClick={() => push('/login')} appearance="secondary" />
    </main>
  )
}
