'use client'

import { Button } from '../Button'
import { signInWithOAuth } from '../../actions/auth'
import { useTranslations } from 'next-intl'
import { useMutation } from '@tanstack/react-query'
import { SiGoogle, SiSpotify } from '@icons-pack/react-simple-icons'
import { useSearchParams } from 'next/navigation'

export function OAuthButtons() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect')
  const signInWithGoogle = useMutation({
    mutationFn: () => signInWithOAuth('google', redirect),
    onError: error => console.error(error),
  })
  const signInWithSpotify = useMutation({
    mutationFn: () => signInWithOAuth('spotify', redirect),
    onError: error => console.error(error),
  })
  const t = useTranslations('OAuthButtons')

  return (
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
  )
}
