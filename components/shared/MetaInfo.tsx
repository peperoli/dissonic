import { useContributionsCount } from '@/hooks/contributions/useContributionsCount'
import { InfoIcon } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'

type MetaInfoProps = {
  createdAt: string | null
  creator?: {
    username: string
  } | null
  ressourceType: 'concerts' | 'bands' | 'locations'
  ressourceId: number
}

export const MetaInfo = ({ createdAt, creator, ressourceType, ressourceId }: MetaInfoProps) => {
  const { data: contributionsCount } = useContributionsCount({ ressourceType, ressourceId })
  const t = useTranslations('MetaInfo')
  const locale = useLocale()

  if ((!createdAt || !creator) && !contributionsCount) {
    return null
  }

  return (
    <section className="flex flex-wrap items-center gap-3 rounded-lg bg-slate-800 p-4 text-sm text-slate-300 md:p-6">
      <InfoIcon className="size-icon" />
      {createdAt && creator && (
        <p>
          {t.rich('createdAtDateByUser', {
            date: new Date(createdAt).toLocaleDateString(locale),
            link: chunks => (
              <Link href={`/users/${creator.username}`} className="text-white hover:underline">
                {chunks}
              </Link>
            ),
            username: creator.username,
          })}
        </p>
      )}
      {createdAt && !creator && (
        <p>{t('createdAtDate', { date: new Date(createdAt).toLocaleDateString(locale) })}</p>
      )}
      {!!contributionsCount && (
        <Link
          href={`/contributions?ressourceType=${ressourceType}&ressourceId=${ressourceId}`}
          className="hover:underline"
        >
          {t('nContributions', { count: contributionsCount })}
        </Link>
      )}
    </section>
  )
}
