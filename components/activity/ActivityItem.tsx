'use client'

import type { ActivityItemT } from 'app/activity/page'
import { UserItem } from '../shared/UserItem'
import Link from 'next/link'
import { getRelativeTime } from '@/lib/relativeTime'
import { ReactNode } from 'react'
import { useConcert } from '@/hooks/concerts/useConcert'
import { Tables } from '@/types/supabase'
import { CommaSeperatedList } from '../helpers/CommaSeperatedList'
import { getConcertName } from '@/lib/getConcertName'

const CommentItem = ({ activityItem }: { activityItem: ActivityItemT }) => {
  const { user, created_at } = activityItem
  const { data: concert } = useConcert(activityItem.concert?.id ?? null, null, { bandsSize: 1 })
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
        <Link href={`/users/${user.username}`} className="hover:underline">
          {user.username}
        </Link>
        <span className="text-slate-300">kommentierte</span>
        <Link href={`/concerts/${concert?.id}`} className="hover:underline">
          {getConcertName(concert) || `ID: ${concert?.id}`}
        </Link>
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
  const { data: concert } = useConcert(activityItem.concert?.id ?? null, null, { bandsSize: 1 })
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
        <Link href={`/users/${user.username}`} className="hover:underline">
          {user.username}
        </Link>
        <span className="text-slate-300">erlebte</span>
        <CommaSeperatedList>
          {bands?.map(band => (
            <Link key={band.id} href={`/bands/${band?.id}`} className="hover:underline">
              {band?.name}
            </Link>
          ))}
        </CommaSeperatedList>
        <span className="text-slate-300">am Konzert</span>
        <Link href={`/concerts/${concert?.id}`} className="hover:underline">
          {getConcertName(concert) || `ID: ${concert?.id}`}
        </Link>
      </ActivityItemLine>
    </div>
  )
}

const FriendItem = ({ activityItem }: { activityItem: ActivityItemT }) => {
  const { user, receiver, created_at } = activityItem
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
        <Link href={`/users/${user.username}`} className="hover:underline">
          {user.username}
        </Link>
        <span className="text-slate-300">und</span>
        <Link href={`/users/${receiver?.username}`} className="hover:underline">
          {receiver?.username}
        </Link>
        <span className="text-slate-300">sind jetzt befreundet</span>
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
  return (
    <div className="flex gap-4 text-sm md:items-center">
      {user}
      <div className="flex flex-wrap gap-x-1">{children}</div>
      <div className="ml-auto whitespace-nowrap text-slate-300">
        {getRelativeTime(createdAt, 'de-CH')}
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
  }
}
