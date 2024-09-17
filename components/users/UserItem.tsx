import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { ProfileStat } from 'app/users/page'
import { getRelativeTime } from '@/lib/getRelativeTime'
import { UserIcon } from 'lucide-react'

function fetchAvatar(avatarPath: string | null) {
  if (!avatarPath) {
    return
  }

  const supabase = createClient()
  const { data } = supabase.storage.from('avatars').getPublicUrl(avatarPath)

  return data.publicUrl
}

type UserItemProps = {
  profileStat: ProfileStat
  index: number
}

export const UserItem = ({ profileStat, index }: UserItemProps) => {
  const avatar = fetchAvatar(profileStat.avatar_path)
  return (
    <Link href={`/users/${profileStat.username}`} className="block">
      <div className="relative grid aspect-square place-content-center rounded-full bg-blue">
        {avatar ? (
          <Image src={avatar} alt="" fill className="rounded-full object-cover" />
        ) : (
          <UserIcon className="size-12 md:size-16 text-slate-850" />
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
          {profileStat.created_at && getRelativeTime(profileStat.created_at, 'de-CH')}
        </div>
      </div>
    </Link>
  )
}
