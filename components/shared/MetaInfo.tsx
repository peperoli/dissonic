import { useContributionsCount } from '@/hooks/contributions/useContributionsCount'
import { Temporal } from '@js-temporal/polyfill'
import { InfoIcon } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'

type MetaInfoProps = {
  createdAt: string | null
  creator?: {
    username: string
  } | null
  resourceType: 'concerts' | 'bands' | 'locations'
  resourceId: number
}

export const MetaInfo = ({ createdAt, creator, resourceType, resourceId }: MetaInfoProps) => {
  const { data: contributionsCount } = useContributionsCount({ resourceType, resourceId })
  const t = useTranslations('MetaInfo')
  const locale = useLocale()
  const createdAtDate = createdAt
    ? Temporal.Instant.from(createdAt).toLocaleString(locale, { dateStyle: 'short' })
    : null

  if (!createdAt && !creator && !contributionsCount) {
    return null
  }

  return (
    <section className="flex flex-wrap items-center gap-3 rounded-lg bg-slate-800 p-4 text-sm text-slate-300 md:p-6">
      <InfoIcon className="size-icon" />
      {createdAt && creator && (
        <p>
          {t.rich('createdAtDateByUser', {
            date: createdAtDate,
            link: chunks => (
              <Link href={`/users/${creator.username}`} className="text-white hover:underline">
                {chunks}
              </Link>
            ),
            username: creator.username,
          })}
        </p>
      )}
      {createdAt && !creator && <p>{t('createdAtDate', { date: createdAtDate })}</p>}
      {!!contributionsCount && (
        <Link
          href={`/contributions?resourceType=${resourceType}&resourceId=${resourceId}`}
          className="hover:underline"
        >
          {t('nContributions', { count: contributionsCount })}
        </Link>
      )}
    </section>
  )
}
