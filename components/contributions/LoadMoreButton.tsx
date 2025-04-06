'use client'

import { parseAsInteger, UseQueryStateOptions, useQueryState } from 'nuqs'
import { Button } from '../Button'
import { useTranslations } from 'next-intl'

export function useSize(options?: Pick<UseQueryStateOptions<number>, 'shallow'>) {
  return useQueryState('size', parseAsInteger.withDefault(50).withOptions(options ?? {}))
}

export function LoadMoreButton({
  isLoading,
  shallow,
}: {
  isLoading?: boolean
  shallow?: UseQueryStateOptions<number>['shallow']
}) {
  const [_, setSize] = useSize(shallow !== undefined ? { shallow } : undefined)
  const t = useTranslations('LoadMoreButton')
  return (
    <div className="flex justify-center">
      <Button
        label={t('showMore')}
        onClick={() => setSize(prev => prev + 50)}
        appearance="primary"
        loading={isLoading}
      />
    </div>
  )
}
