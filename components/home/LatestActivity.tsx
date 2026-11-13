import { ActivityGroup } from '@/components/activity/ActivityGroup'
import { getTranslations } from 'next-intl/server'
import { Temporal } from 'temporal-polyfill'
import { ActivityItemT } from '@/app/activity/page'
import Link from 'next/link'
import { ArrowRightIcon } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'

async function fetchData() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError) {
    throw userError
  }

  if (!user) {
    return { activities: [] }
  }

  const { data: friends, error: friendsError } = await supabase
    .from('friends')
    .select('*')
    .or(`sender_id.eq.${user.id}, receiver_id.eq.${user.id}`)
    .eq('pending', false)

  if (friendsError) {
    throw friendsError
  }

  const friendIds = new Set([
    ...friends.map(friend => friend.sender_id),
    ...friends.map(friend => friend.receiver_id),
  ])
  friendIds.delete(user.id)

  const { data: activities, error: activitiesError } = await supabase
    .rpc('get_recent_activities', { user_ids: Array.from(friendIds) })
    .order('created_at', { ascending: false })
    .limit(3)

  if (activitiesError) {
    throw activitiesError
  }

  return { activities }
}

export async function LatestActivity() {
  const { activities } = await fetchData()

  const t = await getTranslations('HomePage')

  return (
    <section className="mt-8">
      <Link href="/activity" className="mb-3 flex items-center justify-between gap-4">
        <h2 className="mb-0">{t('latestActivity')}</h2>
        <div aria-label={t('showAll')} className="btn btn-icon btn-small btn-tertiary">
          <ArrowRightIcon className="size-icon" />
        </div>
      </Link>
      <ul className="space-y-2">
        {activities?.map(timeGroup => (
          <ActivityGroup
            key={timeGroup.created_at.toString()}
            timeGroup={{
              time: Temporal.PlainTime.from(timeGroup.created_at),
              items: timeGroup.activities as ActivityItemT[],
            }}
          />
        ))}
      </ul>
    </section>
  )
}
