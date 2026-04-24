'use client'

import { Button } from '../Button'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle, faMicrosoft } from '@fortawesome/free-brands-svg-icons'
import { useTransition } from 'react'

export function OAuthButtons() {
  const t = useTranslations('OAuthButtons')

  return (
    <div className="mt-6 grid gap-3">
      <span className="section-headline">{t('or')}</span>
      <OAuthButton provider="google" />
      <OAuthButton provider="azure" />
    </div>
  )
}

export function OAuthButton({ provider }: { provider: 'google' | 'azure' }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const searchParams = useSearchParams()
  const t = useTranslations('OAuthButtons')
  const redirect = searchParams.get('redirect')
  const nextParam = encodeURIComponent(redirect ?? '/')

  function startOAuth() {
    startTransition(() => {
      router.push(`/api/auth/oauth?provider=${provider}&next=${nextParam}`)
    })
  }

  return (
    <Button
      label={t('continueWith' + (provider === 'google' ? 'Google' : 'Microsoft'))}
      onClick={() => startOAuth()}
      icon={
        <FontAwesomeIcon
          icon={provider === 'google' ? faGoogle : faMicrosoft}
          className="size-icon"
        />
      }
      appearance="secondary"
      loading={isPending}
    />
  )
}
