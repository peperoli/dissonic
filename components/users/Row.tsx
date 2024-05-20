import { getRelativeTime } from '@/lib/getRelativeTime'
import { createClient } from '@/utils/supabase/server'
import { ProfileStat } from 'app/users/page'
import { cookies } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { Cell } from '../tables/Cell'

async function fetchAvatar(avatarPath: string | null) {
  if (!avatarPath) {
    return
  }

  const supabase = createClient(cookies())
  const { data } = supabase.storage.from('avatars').getPublicUrl(avatarPath)

  return data.publicUrl
}

type RowProps = {
  profile: ProfileStat
  index: number
}

export async function Row({ profile, index }: RowProps) {
  const avatar = await fetchAvatar(profile.avatar_path)
  return (
    <tr key={profile.id} className="hover:bg-slate-700">
      <Cell>
        <Link
          href={`/users/${profile.username}`}
          className="relative grid size-8 place-content-center rounded-full bg-slate-750"
        >
          {avatar ? (
            <Image src={avatar} alt="" fill className="rounded-full object-cover" />
          ) : (
            <div className="font-bold text-slate-300">{profile.username?.[0].toUpperCase()}</div>
          )}
          <div className="absolute -right-1 -top-1 grid size-4 place-content-center rounded-full bg-slate-850 text-xs">
            {index + 1}
          </div>
        </Link>
      </Cell>
      <Cell>
        <Link href={`/users/${profile.username}`}>{profile.username}</Link>
      </Cell>
      <Cell type="number">{profile.concert_count}</Cell>
      <Cell type="number">{profile.band_count}</Cell>
      <Cell type="date">{profile.created_at && getRelativeTime(profile.created_at, 'de-CH')}</Cell>
    </tr>
  )
}
