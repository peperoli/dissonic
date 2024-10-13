import Image from 'next/image'
import Link from 'next/link'
import { ProfileStat } from 'app/users/page'
import { getRelativeTimeFormatOptions } from '@/lib/relativeTime'
import { UserIcon } from 'lucide-react'
import { getAssetUrl } from '@/lib/getAssetUrl'

type UserItemProps = {
  profileStat: ProfileStat
  index: number
}

export const UserItem = ({ profileStat, index }: UserItemProps) => {
  const avatarUrl = getAssetUrl(profileStat.avatar_path)
  const rtf = new Intl.RelativeTimeFormat('de-CH', { numeric: 'always', style: 'short' })
  const formatOptions = getRelativeTimeFormatOptions(profileStat.created_at!)
  const relativeTimeParts = rtf.formatToParts(...formatOptions)

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
          {profileStat.concert_count} Konzerte
          <br />
          {profileStat.band_count} Bands
          <br />
          {profileStat.created_at && (
            <span>{`seit ${relativeTimeParts[1].value}${relativeTimeParts[2].value}`}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
