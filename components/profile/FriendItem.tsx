'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, FC } from 'react'
import { UserIcon, UserMinusIcon } from '@heroicons/react/20/solid'
import { Profile } from '../../types/types'
import { Button } from '../Button'
import { RemoveFriendModal } from './RemoveFriendModal'
import { useAvatar } from '../../hooks/useAvatar'
import { useSession } from '../../hooks/useSession'

interface IFriendItem {
  friendData: Profile
  profile: Profile
}

export const FriendItem: FC<IFriendItem> = ({ friendData, profile }) => {
  const { data: avatarUrl } = useAvatar(friendData.avatar_path)
  const [friend, setFriend] = useState<Profile | null>(friendData)
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()

  if (friend) {
    return (
      <>
        <div className="col-span-full md:col-span-1 flex items-center gap-3 justify-between p-4 rounded-lg bg-slate-800">
          <Link href={`/users/${friend.username}`} className="flex items-center gap-3">
            <div className="relative flex-shrink-0 flex justify-center items-center w-8 h-8 rounded-full bg-blue-300">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt="Profilbild"
                  fill={true}
                  className="rounded-full object-cover"
                />
              ) : (
                <UserIcon className="h-icon text-slate-850" />
              )}
            </div>
            {friend.username}
          </Link>
          {session?.user.id === profile.id && (
            <Button
              label="Freund entfernen"
              onClick={() => setIsOpen(true)}
              contentType="icon"
              icon={<UserMinusIcon className="h-icon" />}
              size="small"
              danger
            />
          )}
        </div>
        {isOpen && (
          <RemoveFriendModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            friend={friend}
            setFriend={setFriend}
            user={session?.user}
          />
        )}
      </>
    )
  }

  return null
}
