'use client'

import Link from 'next/link'
import { useState, FC } from 'react'
import { UserMinusIcon } from '@heroicons/react/20/solid'
import { Profile } from '../../types/types'
import { Button } from '../Button'
import { RemoveFriendModal } from './RemoveFriendModal'
import { useSession } from '../../hooks/auth/useSession'
import { UserItem } from '../shared/UserItem'

interface IFriendItem {
  friendData: Profile
  profile: Profile
}

export const FriendItem: FC<IFriendItem> = ({ friendData, profile }) => {
  const [friend, setFriend] = useState<Profile | null>(friendData)
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()

  if (friend) {
    return (
      <>
        <div className="col-span-full md:col-span-1 flex items-center gap-3 justify-between p-4 rounded-lg bg-slate-800">
          <Link href={`/users/${friend.username}`}>
            <UserItem user={friend} />
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
