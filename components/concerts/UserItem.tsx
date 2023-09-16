import { UserIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import Link from 'next/link'
import { useAvatar } from '../../hooks/useAvatar'
import { Profile } from '../../types/types'

type UserItemProps = {
  profile: Profile
}

export function UserItem({ profile }: UserItemProps) {
  const { data: avatarUrl } = useAvatar(profile.avatar_path)
  return (
    <Link href={`/users/${profile.username}`} className="flex items-center gap-2 hover:underline">
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={`Avatar von ${profile.username}`}
          width={50}
          height={50}
          className="w-5 h-5 rounded-full"
        />
      ) : (
        <div className="relative flex-none grid place-content-center w-5 h-5 rounded-full text-slate-850 bg-blue-300">
          <UserIcon className="h-3" />
        </div>
      )}
      {profile.username}
    </Link>
  )
}
