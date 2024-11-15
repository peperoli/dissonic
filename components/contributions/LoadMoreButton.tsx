'use client'

import { parseAsInteger, useQueryState } from 'nuqs'
import { Button } from '../Button'
import { useTranslations } from 'next-intl'

export function LoadMoreButton() {
  const [_, setSize] = useQueryState(
    'size',
    parseAsInteger.withDefault(50).withOptions({ shallow: false })
  )
  const t = useTranslations('LoadMoreButton')
  return (
    <div className="flex justify-center">
      <Button
        label={t('showMore')}
        onClick={() => setSize(prev => prev + 50)}
        appearance="primary"
      />
    </div>
  )
}
