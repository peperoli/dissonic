'use client'
import { PageWrapper } from '../layout/PageWrapper'
import { SubmitHandler } from 'react-hook-form'
import { Button } from '../Button'
import { CheckIcon } from '@heroicons/react/20/solid'
import { useSignUp } from '../../hooks/useSignup'
import { StatusBanner } from '../forms/StatusBanner'
import { errorMessages } from '../../lib/errorMessages'
import { useRouter } from 'next/navigation'
import { Form } from './Form'
import { AuthError, PostgrestError } from '@supabase/supabase-js'
import { SignUpFormData } from '../../actions/auth'

export const SignupPage = () => {
  const signUp = useSignUp()
  const { push } = useRouter()

  const onSubmit: SubmitHandler<SignUpFormData> = async formData => {
    signUp.mutate(formData)
  }

  const error = signUp.error as AuthError | PostgrestError
  return (
    <PageWrapper>
      <main className="container-sm">
        <h1>
          <span className="text-[1.5em]">Willkommen,</span>
          <br />
          geschätzter Fan von Live-Musik!
        </h1>
        <p className="mb-2">Ein Dissonic-Konto ermöglicht dir folgende Funktionen:</p>
        <ul className="mb-6">
          <li className="flex items-center gap-4">
            <CheckIcon className="flex-shrink-0 h-icon text-slate-300" />
            Konzerte, Bands und Locations eintragen und aktualisieren
          </li>
          <li className="flex items-center gap-4">
            <CheckIcon className="flex-shrink-0 h-icon text-slate-300" />
            Deine Konzert-Historie und Statistiken einsehen
          </li>
          <li className="flex items-center gap-4">
            <CheckIcon className="flex-shrink-0 h-icon text-slate-300" />
            Bands markieren, die du live erlebt hast
          </li>
          <li className="flex items-center gap-4">
            <CheckIcon className="flex-shrink-0 h-icon text-slate-300" />
            Konzerte kommentieren und auf Kommentare reagieren
          </li>
        </ul>
        {signUp.status !== 'success' && <Form onSubmit={onSubmit} status={signUp.status} />}
        {signUp.status === 'error' && (
          <StatusBanner
            statusType="error"
            message={
              'code' in error && error.code === '23505'
                ? 'Fehler: Es existiert bereits ein Benutzer für diese E-Mail-Adresse.'
                : errorMessages[error.message]
            }
            className="mt-6"
          />
        )}
        {signUp.status === 'success' && (
          <StatusBanner
            statusType="success"
            message="Erfolgreich! Bestätige deine E-Mail-Adresse, um dein Benutzerkonto zu aktivieren."
            className="mt-6"
          />
        )}
        <h3 className="mt-10">Hast du bereits ein Konto?</h3>
        <Button label="Anmelden" onClick={() => push('/login')} size="small" appearance="secondary" />
      </main>
    </PageWrapper>
  )
}
