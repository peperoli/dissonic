import type {
  BandSeenActivityItemT,
  CommentActivityItemT,
  ActivityItemT,
  FriendAcitivityItemT,
} from 'app/activity/page'
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
  const { user, concert, created_at } = activityItem
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
        <Link href={`/concerts/${concert.id}`} className="hover:underline">
          {getConcertName(concert)}&nbsp;
          <span className="text-xs text-slate-300">(ID: {concert.id})</span>
        </Link>
      </ActivityItemLine>
      {activityItem.content && (
        <div className="ml-16 mt-2 whitespace-pre-line rounded border border-slate-700 p-2 text-sm">
          {activityItem.content}
        </div>
      )}
    </div>
  )
}

const BandSeenItem = ({ activityItem }: { activityItem: BandSeenActivityItemT }) => {
  const { user, band, concert, created_at } = activityItem
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
        <Link href={`/bands/${band.id}`} className="hover:underline">
          {band.name}
        </Link>
        <span className="text-slate-300">am Konzert</span>
        <Link href={`/concerts/${concert.id}`} className="hover:underline">
          {getConcertName(concert)}&nbsp;
          <span className="text-xs text-slate-300">(ID: {concert.id})</span>
        </Link>
        <span className="text-slate-300">
          am{' '}
          {new Date(concert.date_start).toLocaleDateString('de-CH', {
            weekday: 'long',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      </ActivityItemLine>
    </div>
  )
}

const FriendItem = ({ activityItem }: { activityItem: FriendAcitivityItemT }) => {
  const { sender, receiver, accepted_at } = activityItem
  return (
    <div className="rounded-lg bg-slate-800 p-4">
      <ActivityItemLine
        user={
          <div className="flex">
            {[sender, receiver].map(user => (
              <Link href={`/users/${user.username}`} className="group/user-item">
                <UserItem user={user} usernameIsHidden />
              </Link>
            ))}
          </div>
        }
        createdAt={accepted_at}
      >
        <Link href={`/users/${sender.username}`} className="hover:underline">
          {sender.username}
        </Link>
        <span className="text-slate-300">und</span>
        <Link href={`/users/${receiver.username}`} className="hover:underline">
          {receiver.username}
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
    <div className="flex items-center gap-4 text-sm">
      {user}
      <div className="flex flex-wrap gap-x-1">{children}</div>
      <div className="ml-auto whitespace-nowrap text-slate-300">
        {getRelativeTime(createdAt, 'de-CH')}
      </div>
    </div>
  )
}

export const ActivityItem = ({ activityItem }: { activityItem: ActivityItemT }) => {
  if ('content' in activityItem) {
    return <CommentItem activityItem={activityItem} />
  } else if ('band_id' in activityItem) {
    return <BandSeenItem activityItem={activityItem} />
  } else if ('sender_id' in activityItem) {
    return <FriendItem activityItem={activityItem} />
  }
}
