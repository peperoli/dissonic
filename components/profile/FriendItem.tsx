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
import { useBandsSeen } from '@/hooks/bands/useBandsSeen'
import { ComparisonChart } from './Comparison'
import { useProfile } from '@/hooks/profiles/useProfile'

type FriendItemProps = {
  friend: Profile | null
  profileId: string
}

export const FriendItem = ({ friend, profileId }: FriendItemProps) => {
  const [_, setModal] = useModal()
  const [__, setFriendId] = useQueryState('friendId', { history: 'push' })
  const { data: session } = useSession()
  const { data: profile } = useProfile(profileId)
  const t = useTranslations('FriendItem')
  const { data: user1BandsSeen } = useBandsSeen({ userId: friend?.id })
  const { data: user2BandsSeen } = useBandsSeen({ userId: profileId })

  if (!friend) return null

  return (
    <div className="col-span-full flex items-center gap-1 rounded-lg bg-slate-800 p-4 md:col-span-1">
      <Link href={`/users/${friend.username}`} className="w-full">
        <UserItem
          user={friend}
          description={
            <div className="mt-2">
              {profile && user1BandsSeen && user2BandsSeen ? (
                <ComparisonChart
                  user1={friend}
                  user2={profile}
                  user1BandsSeen={user1BandsSeen}
                  user2BandsSeen={user2BandsSeen}
                  ressourceType="concerts"
                  size="sm"
                />
              ) : (
                <div className="h-2 w-full animate-pulse rounded bg-slate-700" />
              )}
            </div>
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
