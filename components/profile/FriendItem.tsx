'use client'

import Link from 'next/link'
import { UserMinusIcon } from 'lucide-react'
import { Profile } from '../../types/types'
import { Button } from '../Button'
import { useSession } from '../../hooks/auth/useSession'
import { UserItem } from '../shared/UserItem'
import { useQueryState } from 'nuqs'
import { useModal } from '../shared/ModalProvider'
import { useTranslations } from 'next-intl'
import { useCompareConcertsSeen } from '@/hooks/profiles/useCompareConcertsSeen'
import { useCompareBandsSeen } from '@/hooks/profiles/useCompareBandsSeen'

type FriendItemProps = {
  friend: Profile | null
  profileId: string
}

export const FriendItem = ({ friend, profileId }: FriendItemProps) => {
  const [_, setModal] = useModal()
  const [__, setFriendId] = useQueryState('friendId', { history: 'push' })
  const { data: session } = useSession()
  const t = useTranslations('FriendItem')
  const { data: concerts } = useCompareConcertsSeen(profileId, friend?.id)
  const { data: bands } = useCompareBandsSeen(profileId, friend?.id)

  if (!friend) return null

  return (
    <div className="col-span-full flex items-center justify-between gap-3 rounded-lg bg-slate-800 p-4 md:col-span-1">
      <Link href={`/users/${friend.username}`}>
        <UserItem
          user={friend}
          description={
            <>
              Konzerte: {concerts?.count}
              <br />
              Bands: {bands?.count}
            </>
          }
        />
      </Link>
      {session?.user.id === profileId && (
        <Button
          label={t('removeFriend')}
          onClick={() => {
            setModal('delete-friend')
            setFriendId(friend.id)
          }}
          contentType="icon"
          icon={<UserMinusIcon className="size-icon" />}
          size="small"
          danger
        />
      )}
    </div>
  )
}
