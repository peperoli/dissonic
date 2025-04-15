'use client'

import { Button } from '@/components/Button'
import { RotateCw } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('Error')

  useEffect(() => {
    console.error(error.message)
  }, [error])

  return (
    <div className="container">
      <blockquote className="mb-4 border-l-4 pl-4 text-slate-300">
        «I tried so hard and got so far
        <br />
        but in the end, it doesn&apos;t even matter»
        <br />~ <cite>Linkin Park</cite>
      </blockquote>
      <h1 className="text-red">{t('headline')}</h1>
      <p className="mb-4">{t('description')}</p>
      <Button
        onClick={reset}
        label={t('tryAgain')}
        icon={<RotateCw className="size-icon" />}
        appearance="tertiary"
      />
    </div>
  )
}
