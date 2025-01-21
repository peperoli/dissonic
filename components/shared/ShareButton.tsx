'use client'

import toast from 'react-hot-toast'
import { Button } from '../Button'
import { useTranslations } from 'next-intl'
import { Share2Icon } from 'lucide-react'
import { usePathname } from 'next/navigation'

export function ShareButton({ url: initialUrl }: { url?: string }) {
  const pathname = usePathname()
  const t = useTranslations('ShareButton')
  const url = initialUrl || `${process.env.NEXT_PUBLIC_BASE_URL}${pathname}`

  return (
    <Button
      onClick={() => {
        if (navigator.share) {
          navigator.share({ url }).catch(error => console.error(error))
        } else {
          navigator.clipboard.writeText(url)
          toast.success(t('urlCopiedToClipboard'))
        }
      }}
      label={t('share')}
      icon={<Share2Icon className="size-icon" />}
      contentType="icon"
      size="small"
      appearance="tertiary"
    />
  )
}
