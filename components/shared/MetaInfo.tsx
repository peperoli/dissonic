import { useContributionsCount } from '@/hooks/contributions/useContributionsCount'
import { InfoIcon } from 'lucide-react'
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

  if (!createdAt && !creator && !contributionsCount) {
    return null
  }

  return (
    <section className="flex items-center gap-3 rounded-lg bg-slate-800 p-4 text-sm text-slate-300 md:p-6">
      <InfoIcon className="size-icon" />
      {(createdAt || creator) && (
        <p>
          Erstellt {createdAt && `am ${new Date(createdAt).toLocaleDateString('de-CH')}`}
          {creator && (
            <>
              {' von '}
              <Link href={`/users/${creator.username}`} className="text-white hover:underline">
                {creator.username}
              </Link>
            </>
          )}
        </p>
      )}
      {!!contributionsCount && (
        <Link
          href={`/contributions?ressourceType=${ressourceType}&ressourceId=${ressourceId}`}
          className="hover:underline"
        >
          {contributionsCount} {contributionsCount === 1 ? 'Bearbeitung' : 'Bearbeitungen'}
        </Link>
      )}
    </section>
  )
}
