'use client'

import type { ActivityItemT } from '@/app/activity/page'
import { UserItem } from '../shared/UserItem'
import Link from 'next/link'
import { getRelativeTime } from '@/lib/relativeTime'
import { ReactNode } from 'react'
import { useConcert } from '@/hooks/concerts/useConcert'
import { Tables } from '@/types/supabase'
import { CommaSeperatedList } from '../helpers/CommaSeperatedList'
import { useLocale, useTranslations } from 'next-intl'
import { getConcertName } from '@/lib/getConcertName'
import { reactionIcons } from '../concerts/ReactionControl'
import { getBunnyImageUrl, getBunnyThumbnailUrl } from '@/lib/bunnyHelpers'
import { PlayIcon } from 'lucide-react'
import { z } from 'zod'
import { StatusBanner } from '../forms/StatusBanner'

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

const memoryContentSchema = z.object({
  file_id: z.string().min(1),
  file_type: z.string().min(1),
  width: z.number().nullable(),
  height: z.number().nullable(),
  duration: z.number().nullable(),
})

const MemoryItem = ({ activityItem }: { activityItem: ActivityItemT }) => {
  const { user, created_at } = activityItem
  const t = useTranslations('ActivityItem')
  const locale = useLocale()
  const { data: concert } = useConcert(activityItem.concert?.id ?? null, null, { bandsSize: 1 })
  const concertName = concert ? getConcertName(concert, locale) : null
  const result = memoryContentSchema.safeParse(activityItem.content)
  const content = result.success ? result.data : null
  const isImage = content?.file_type.startsWith('image/')

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
        {t.rich('userAddedMemoryToConcert', {
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
      {content ? (
        <Link
          href={`/concerts/${concert?.id}#memories`}
          scroll={false}
          className="relative ml-14 mt-2 block size-24"
        >
          <img
            src={
              isImage
                ? getBunnyImageUrl(content.file_id, {
                    folder: 'thumbnail',
                  })
                : getBunnyThumbnailUrl(content.file_id)
            }
            alt=""
            loading="lazy"
            className="absolute inset-0 size-full rounded-lg object-cover"
          />
          {!isImage && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded bg-slate-900/70 p-1 text-sm">
              <PlayIcon className="size-icon" />
              {content.duration && (
                <span>
                  {Math.floor(content.duration / 60)}:
                  {(content.duration % 60).toString().padStart(2, '0')}
                </span>
              )}
            </div>
          )}
        </Link>
      ) : (
        <StatusBanner
          statusType="error"
          message={t('errorLoadingMemoryContent')}
          className="ml-14 mt-2"
        />
      )}
    </div>
  )
}

const CommentItem = ({ activityItem }: { activityItem: ActivityItemT }) => {
  const { user, created_at } = activityItem
  const { data: concert } = useConcert(activityItem.concert?.id ?? null, null, { bandsSize: 1 })
  const t = useTranslations('ActivityItem')
  const locale = useLocale()
  const concertName = getConcertName(concert, locale)
  const result = z.string().nullable().safeParse(activityItem.content)
  const content = result.success ? result.data : null

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
      {content && (
        <Link
          href={`/concerts/${concert?.id}#comments`}
          scroll={false}
          className="ml-14 mt-2 whitespace-pre-line break-words rounded border border-slate-700 p-2 text-sm"
        >
          {content}
        </Link>
      )}
    </div>
  )
}

const ReactionItem = ({ activityItem }: { activityItem: ActivityItemT }) => {
  const { user, created_at, receiver } = activityItem
  const t = useTranslations('ActivityItem')
  const locale = useLocale()
  const { data: concert } = useConcert(activityItem.concert?.id ?? null, null, { bandsSize: 1 })
  const concertName = concert ? getConcertName(concert, locale) : null
  const result = z.string().nullable().safeParse(activityItem.content)
  const content = result.success ? result.data : null

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
        {t.rich('userReactedWithReactionTypeToCommentersCommentOnConcert', {
          user: () => (
            <Link href={`/users/${user.username}`} className="text-white hover:underline">
              {user.username}
            </Link>
          ),
          reactionType: content ? reactionIcons[content] : null,
          commenter: () => (
            <Link href={`/users/${receiver?.username}`} className="text-white hover:underline">
              {receiver?.username}
            </Link>
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

const ProfileItem = ({ activityItem }: { activityItem: ActivityItemT }) => {
  const { user, created_at } = activityItem
  const t = useTranslations('ActivityItem')
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
        {t.rich('userJoinedDissonic', {
          user: () => (
            <Link href={`/users/${user.username}`} className="text-white hover:underline">
              {user.username}
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
  if (activityItem.type === 'j_bands_seen') {
    return <BandSeenItem activityItem={activityItem} bands={bands} />
  } else if (activityItem.type === 'memories') {
    return <MemoryItem activityItem={activityItem} />
  } else if (activityItem.type === 'comments') {
    return <CommentItem activityItem={activityItem} />
  } else if (activityItem.type === 'reactions') {
    return <ReactionItem activityItem={activityItem} />
  } else if (activityItem.type === 'friends') {
    return <FriendItem activityItem={activityItem} />
  } else if (activityItem.type === 'profiles') {
    return <ProfileItem activityItem={activityItem} />
  } else {
    console.warn(`Unknown activity type: ${activityItem.type}`, activityItem)
    return null
  }
}
