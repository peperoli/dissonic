import { InfoIcon } from 'lucide-react'
import Link from 'next/link'

type MetaInfoProps = {
  createdAt: string | null
  creator?: {
    username: string
  } | null
}

export const MetaInfo = ({ createdAt, creator }: MetaInfoProps) => {
  return (
    <section className="flex items-center gap-3 rounded-lg bg-slate-800 p-4 text-sm text-slate-300 md:p-6">
      <InfoIcon className="size-icon" />
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
    </section>
  )
}
