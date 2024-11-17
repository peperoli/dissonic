'use client'

import type { ActivityItemT } from 'app/activity/page'
import { UserItem } from '../shared/UserItem'
import Link from 'next/link'
import { getRelativeTime } from '@/lib/relativeTime'
import { ReactNode } from 'react'
import { useConcert } from '@/hooks/concerts/useConcert'
import { Tables } from '@/types/supabase'
import { CommaSeperatedList } from '../helpers/CommaSeperatedList'
import { useLocale, useTranslations } from 'next-intl'
import { getConcertName } from '@/lib/getConcertName'

const CommentItem = ({ activityItem }: { activityItem: ActivityItemT }) => {
  const { user, created_at } = activityItem
  const { data: concert } = useConcert(activityItem.concert?.id ?? null, null, { bandsSize: 1 })
  const t = useTranslations('ActivityItem')
  const locale = useLocale()
  const concertName = getConcertName(concert, locale)
  return (
    <div className="rounded-lg bg-slate-800 p-4">
      <ActivityItemLine
        user={
          <Link href={`/users/${user.username}`} className="group/user-item">
            <UserItem user={user} usernameIsHidden />
          </Link>
        }
        createdAt={created_at}
      >
        {t.rich('userCommentedOnConcert', {
          user: () => (
            <Link href={`/users/${user.username}`} className="text-white hover:underline">
              {user.username}
            </Link>
          ),
          concert: () => (
            <Link href={`/concerts/${concert?.id}`} className="text-white hover:underline">
              {concertName || `ID: ${concert?.id}`}
            </Link>
          ),
        })}
      </ActivityItemLine>
      {activityItem.content && (
        <div className="ml-16 mt-2 whitespace-pre-line break-words rounded border border-slate-700 p-2 text-sm">
          {activityItem.content}
        </div>
      )}
    </div>
  )
}

const BandSeenItem = ({
  activityItem,
  bands,
}: {
  activityItem: ActivityItemT
  bands: Tables<'bands'>[] | undefined
}) => {
  const { user, created_at } = activityItem
  const t = useTranslations('ActivityItem')
  const locale = useLocale()
  const { data: concert } = useConcert(activityItem.concert?.id ?? null, null, { bandsSize: 1 })
  const concertName = getConcertName(concert, locale)
  return (
    <div className="rounded-lg bg-slate-800 p-4">
      <ActivityItemLine
        user={
          <Link href={`/users/${user.username}`} className="group/user-item">
            <UserItem user={user} usernameIsHidden />
          </Link>
        }
        createdAt={created_at}
      >
        {t.rich('userSawBandsAtConcert', {
          user: () => (
            <Link href={`/users/${user.username}`} className="text-white hover:underline">
              {user.username}
            </Link>
          ),
          bands: () => (
            <CommaSeperatedList>
              {bands?.map(band => (
                <Link
                  key={band.id}
                  href={`/bands/${band?.id}`}
                  className="text-white hover:underline"
                >
                  {band?.name}
                </Link>
              ))}
            </CommaSeperatedList>
          ),
          concert: () => (
            <Link href={`/concerts/${concert?.id}`} className="text-white hover:underline">
              {concertName || `ID: ${concert?.id}`}
            </Link>
          ),
        })}
      </ActivityItemLine>
    </div>
  )
}

const FriendItem = ({ activityItem }: { activityItem: ActivityItemT }) => {
  const { user, receiver, created_at } = activityItem
  const t = useTranslations('ActivityItem')
  return (
    <div className="rounded-lg bg-slate-800 p-4">
      <ActivityItemLine
        user={
          <div className="flex">
            {[user, receiver]
              .filter(user => !!user)
              .map(user => (
                <Link key={user.id} href={`/users/${user.username}`} className="group/user-item">
                  <UserItem user={user} usernameIsHidden />
                </Link>
              ))}
          </div>
        }
        createdAt={created_at}
      >
        {t.rich('user1AndUser2AreNowFriends', {
          user1: () => (
            <Link href={`/users/${user.username}`} className="text-white hover:underline">
              {user.username}
            </Link>
          ),
          user2: () => (
            <Link href={`/users/${receiver?.username}`} className="text-white hover:underline">
              {receiver?.username}
            </Link>
          ),
        })}
      </ActivityItemLine>
    </div>
  )
}

const ActivityItemLine = ({
  createdAt,
  user,
  children,
}: {
  createdAt: string
  user: ReactNode
  children: ReactNode
}) => {
  const locale = useLocale()
  return (
    <div className="flex gap-4 text-sm md:items-center">
      {user}
      <div className="flex flex-wrap gap-x-1 text-slate-300">{children}</div>
      <div className="ml-auto whitespace-nowrap text-slate-300">
        {getRelativeTime(createdAt, locale)}
      </div>
    </div>
  )
}

export const ActivityItem = ({
  activityItem,
  bands,
}: {
  activityItem: ActivityItemT
  bands?: Tables<'bands'>[]
}) => {
  if (activityItem.type === 'comments') {
    return <CommentItem activityItem={activityItem} />
  } else if (activityItem.type === 'j_bands_seen') {
    return <BandSeenItem activityItem={activityItem} bands={bands} />
  } else if (activityItem.type === 'friends') {
    return <FriendItem activityItem={activityItem} />
  } else {
    return null
  }
}
