'use client'

import Link from 'next/link'
import { useState, FC } from 'react'
import { UserMinusIcon } from '@heroicons/react/20/solid'
import { Profile } from '../../types/types'
import { Button } from '../Button'
import { useSession } from '../../hooks/auth/useSession'
import { UserItem } from '../shared/UserItem'
import { parseAsStringLiteral, useQueryState } from 'nuqs'
import { modalPaths } from '../shared/ModalProvider'

type FriendItemProps = {
  friend: Profile
  profile: Profile
}

export const FriendItem = ({ friend, profile }: FriendItemProps) => {
  const [_, setModal] = useQueryState(
    'modal',
    parseAsStringLiteral(modalPaths).withOptions({ history: 'push' })
  )
  const [__, setFriendId] = useQueryState('friendId', { history: 'push' })
  const { data: session } = useSession()

  return (
    <div className="col-span-full flex items-center justify-between gap-3 rounded-lg bg-slate-800 p-4 md:col-span-1">
      <Link href={`/users/${friend.username}`}>
        <UserItem user={friend} />
      </Link>
      {session?.user.id === profile.id && (
        <Button
          label="Freund entfernen"
          onClick={() => {
            setModal('delete-friend')
            setFriendId(friend.id)
          }}
          contentType="icon"
          icon={<UserMinusIcon className="h-icon" />}
          size="small"
          danger
        />
      )}
    </div>
  )
}
