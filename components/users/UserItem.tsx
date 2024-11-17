import Image from 'next/image'
import Link from 'next/link'
import { ProfileStat } from 'app/users/page'
import { getRelativeTime } from '@/lib/relativeTime'
import { UserIcon } from 'lucide-react'
import { getAssetUrl } from '@/lib/getAssetUrl'
import { useLocale, useTranslations } from 'next-intl'

type UserItemProps = {
  profileStat: ProfileStat
  index: number
}

export const UserItem = ({ profileStat, index }: UserItemProps) => {
  const t = useTranslations('UserItem')
  const locale = useLocale()
  const avatarUrl = getAssetUrl(profileStat.avatar_path)

  return (
    <Link href={`/users/${profileStat.username}`} className="block">
      <div className="relative grid aspect-square place-content-center rounded-full bg-blue">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={`${profileStat.username}'s Avatar`}
            sizes="300px"
            fill
            className="rounded-full object-cover"
          />
        ) : (
          <UserIcon className="size-12 text-slate-850 md:size-16" />
        )}
        <div className="absolute right-1 top-1 grid size-6 place-content-center rounded-full bg-slate-850 text-sm md:right-2 md:top-2">
          {index + 1}
        </div>
      </div>
      <div className="mt-2 overflow-hidden">
        <h3 className="mb-0 truncate whitespace-nowrap text-base">{profileStat.username}</h3>
        <div className="text-sm text-slate-300">
          {t('nConcerts', { count: profileStat.concert_count })}
          <br />
          {t('nBands', { count: profileStat.band_count })}
          <br />
          {profileStat.created_at && (
            <span>{getRelativeTime(profileStat.created_at, locale)}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
