'use client'

import { useActivities } from '@/hooks/activity/useActivities'
import { ExtendedRes } from '@/types/types'
import { useLocale, useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { ActivityItemT } from '../../app/activity/page'
import { ActivityGroup } from '@/components/activity/ActivityGroup'
import { LoadMoreButton, useSize } from '@/components/contributions/LoadMoreButton'
import { getMediumDate } from '@/lib/date'
import { useView } from '@/components/activity/ViewFilter'
import { useActivityType } from '@/components/activity/ActivityTypeFilter'
import { useSession } from '@/hooks/auth/useSession'

export function ActivityList({
  activities: placeholderData,
  profileId,
}: {
  activities: ExtendedRes<ActivityItemT[]>
  profileId?: string
}) {
  const { data: session } = useSession()
  const isMod = session?.user_role === 'developer' || session?.user_role === 'moderator'
  const [selectedView] = useView(isMod)
  const [selectedActivityType] = useActivityType()
  const searchParams = useSearchParams()
  const [selectedSize] = useSize()
  const { data: activities, isFetching } = useActivities({
    view: selectedView,
    activityType: selectedActivityType,
    user: profileId || searchParams.get('user') || undefined,
    size: selectedSize,
    placeholderData,
  })
  const t = useTranslations('ActivityPage')
  const locale = useLocale()
  const groupedItems = groupByDateAndTime(activities?.data as ActivityItemT[])

  function groupByDateAndTime(items: ActivityItemT[]) {
    type DateGroup<T> = { date: string; items: T[] }
    type TimeGroup<T> = {
      time: number
      userId: string | null
      concertId: number | null
      items: T[]
    }

    return items.reduce<DateGroup<TimeGroup<ActivityItemT>>[]>((acc, item) => {
      const date = getMediumDate(item.created_at, locale)
      const time = new Date(item.created_at).getTime()
      const userId = item.user_id?.[0] ?? null
      const concertId = item.concert?.id ?? null

      let dateGroup = acc.find(group => group.date === date)
      if (!dateGroup) {
        dateGroup = { date, items: [] }
        acc.push(dateGroup)
      }

      let timeGroup = dateGroup.items.find(
        group => group.time === time && group.userId === userId && group.concertId === concertId
      )
      if (!timeGroup) {
        timeGroup = { time, userId, concertId, items: [] }
        dateGroup.items.push(timeGroup)
      }

      timeGroup.items.push(item)
      return acc
    }, [])
  }

  return (
    <>
      {activities?.count === 0 && <p className="mb-4 text-slate-300">{t('noEntriesFound')}</p>}
      {groupedItems.map(dateGroup => (
        <section key={dateGroup.date}>
          <h2 className="section-headline">{dateGroup.date}</h2>
          <ul className="grid gap-2">
            {dateGroup.items.map(timeGroup => (
              <ActivityGroup key={timeGroup.time} timeGroup={timeGroup} />
            ))}
          </ul>
        </section>
      ))}
      {activities?.data.length !== activities?.count && <LoadMoreButton isLoading={isFetching} />}
    </>
  )
}
