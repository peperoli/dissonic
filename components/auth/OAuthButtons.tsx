'use client'

import { Button } from '../Button'
import { signInWithOAuth } from '../../actions/auth'
import { useTranslations } from 'next-intl'
import { useMutation } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle, faMicrosoft } from '@fortawesome/free-brands-svg-icons'

export function OAuthButtons() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect')
  const signInWithGoogle = useMutation({
    mutationFn: () => signInWithOAuth('google', redirect),
    onError: error => console.error(error),
  })
  const signInWithMicrosoft = useMutation({
    mutationFn: () => signInWithOAuth('azure', redirect),
    onError: error => console.error(error),
  })
  const t = useTranslations('OAuthButtons')

  return (
    <div className="mt-6 grid gap-3">
      <span className="section-headline">{t('or')}</span>
      <Button
        label={t('continueWithGoogle')}
        onClick={() => signInWithGoogle.mutate()}
        icon={<FontAwesomeIcon icon={faGoogle} className="size-icon" />}
        appearance="secondary"
        loading={signInWithGoogle.status === 'pending'}
      />
      <Button
        label={t('continueWithMicrosoft')}
        onClick={() => signInWithMicrosoft.mutate()}
        icon={<FontAwesomeIcon icon={faMicrosoft} className="size-icon" />}
        appearance="secondary"
        loading={signInWithMicrosoft.status === 'pending'}
      />
    </div>
  )
}
