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
import { ComparisonChart } from './Comparison'
import { useProfile } from '@/hooks/profiles/useProfile'
import supabase from '@/utils/supabase/client'
import { useQuery } from '@tanstack/react-query'

async function fetchBandsSeen(profileId?: string) {
  let countQuery = supabase.from('j_bands_seen').select('*', { count: 'estimated', head: true })

  if (profileId) {
    countQuery = countQuery.eq('user_id', profileId)
  }

  const { count } = await countQuery
  const perPage = 1000
  const maxPage = count ? Math.ceil(count / perPage) : 1
  const queries = []

  for (let page = 1; page <= maxPage; page++) {
    let query = supabase
      .from('j_bands_seen')
      .select('*, concert:concerts(location_id)')
      .range((page - 1) * perPage, page * perPage - 1)

    if (profileId) {
      query = query.eq('user_id', profileId)
    }

    queries.push(query)
  }

  const responses = await Promise.all(queries)

  if (responses.some(({ error }) => error)) {
    throw responses.find(({ error }) => error)
  }

  return responses.flatMap(({ data }) => data).filter(bandSeen => bandSeen !== null)
}

export const FriendItem = ({
  friend,
  profileId,
}: {
  friend: Profile | null
  profileId: string
}) => {
  const [_, setModal] = useModal()
  const [__, setFriendId] = useQueryState('friendId', { history: 'push' })
  const { data: session } = useSession()
  const { data: profile } = useProfile(profileId)
  const t = useTranslations('FriendItem')
  const { data: user1BandsSeen } = useQuery({
    queryKey: ['bandsSeenComparison', friend?.id],
    queryFn: () => fetchBandsSeen(friend?.id),
  })
  const { data: user2BandsSeen } = useQuery({
    queryKey: ['bandsSeenComparison', profileId],
    queryFn: () => fetchBandsSeen(profileId),
  })

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
                  resourceType="concerts"
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
