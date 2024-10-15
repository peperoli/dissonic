import type { BandSeenActivityItemT, CommentActivityItemT, ActivityItemT } from 'app/activity/page'
import { UserItem } from '../shared/UserItem'
import Link from 'next/link'
import { getRelativeTime } from '@/lib/relativeTime'
import { ReactNode } from 'react'

function getConcertName(concert: {
  name: string | null
  date_start: string
  festival_root: { name: string } | null
  bands: { name: string }[] | null
  location: { name: string } | null
  [key: string]: any
}) {
  if (concert.festival_root) {
    return `${concert.festival_root.name} ${new Date(concert.date_start).getFullYear()}`
  } else if (concert.name) {
    return concert.name
  } else {
    return `${concert.bands
      ?.map(band => band.name)
      .slice(0, 3)
      .join(', ')} @ ${concert.location?.name}`
  }
}

const CommentItem = ({ activityItem }: { activityItem: CommentActivityItemT }) => {
  const { concert } = activityItem
  return (
    <ActivityItemWrapper>
      <ActivityItemLine activityItem={activityItem}>
        <span className="text-slate-300">kommentierte</span>
        <Link href={`/concerts/${concert.id}`} className="hover:underline">
          {getConcertName(concert)}&nbsp;
          <span className="text-xs text-slate-300">(ID: {concert.id})</span>
        </Link>
      </ActivityItemLine>
      {activityItem.content && <ActivityItemContent>{activityItem.content}</ActivityItemContent>}
    </ActivityItemWrapper>
  )
}

const BandSeenItem = ({ activityItem }: { activityItem: BandSeenActivityItemT }) => {
  const { band, concert } = activityItem
  return (
    <ActivityItemWrapper>
      <ActivityItemLine activityItem={activityItem}>
        <span className="text-slate-300">erlebte</span>
        <Link href={`/bands/${band.id}`} className="hover:underline">
          {band.name}
        </Link>
        <span className="text-slate-300">am Konzert</span>
        <Link href={`/concerts/${concert.id}`} className="hover:underline">
          {getConcertName(concert)}&nbsp;
          <span className="text-xs text-slate-300">(ID: {concert.id})</span>
        </Link>
      </ActivityItemLine>
    </ActivityItemWrapper>
  )
}

const ActivityItemLine = ({
  activityItem,
  children,
}: {
  activityItem: ActivityItemT
  children: ReactNode
}) => {
  const { user, created_at } = activityItem
  return (
    <div className="flex gap-4">
      <Link href={`/users/${user.username}`} className='group/user-item'>
        <UserItem user={user} usernameIsHidden />
      </Link>
      <div className="flex flex-wrap gap-x-1">
        <Link href={`/users/${user.username}`} className='hover:underline'>{user.username}</Link>
        {children}
      </div>
      {created_at && (
        <div className="ml-auto whitespace-nowrap text-sm text-slate-300">
          {getRelativeTime(created_at, 'de-CH')}
        </div>
      )}
    </div>
  )
}

const ActivityItemContent = ({ children }: { children: ReactNode }) => {
  return (
    <div className="ml-16 mt-2 whitespace-pre-line rounded border border-slate-700 p-2 text-sm">
      {children}
    </div>
  )
}

const ActivityItemWrapper = ({ children }: { children: ReactNode }) => {
  return <li className="rounded-lg bg-slate-800 p-4">{children}</li>
}

export const ActivityItem = ({ activityItem }: { activityItem: ActivityItemT }) => {
  if ('content' in activityItem) {
    return <CommentItem activityItem={activityItem} />
  } else if ('band_id' in activityItem) {
    return <BandSeenItem activityItem={activityItem} />
  }
}
