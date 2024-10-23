import { ActivityItem } from '@/components/activity/ActivityItem'
import { ActivityTypeFilter } from '@/components/activity/ActivityTypeFilter'
import { ViewFilter } from '@/components/activity/ViewFilter'
import { LoadMoreButton } from '@/components/contributions/LoadMoreButton'
import { Database, Tables } from '@/types/supabase'
import { ActivityFetchOptions } from '@/types/types'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export type ActivityItemT = Database['public']['Views']['activity']['Row'] & {
  user: Tables<'profiles'>
  created_at: string
}

async function fetchData({
  searchParams,
}: {
  searchParams: Exclude<ActivityFetchOptions, 'size'> & { size?: string }
}) {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/login?redirect=/activity')
  }

  let query = supabase.from('activity').select('*', { count: 'estimated' })

  if (searchParams.activityType && searchParams.activityType !== 'all') {
    query = query.eq('type', searchParams.activityType)
  }

  if (searchParams.user) {
    query = query.contains('user_id', searchParams.user.split(','))
  }

  if ((!searchParams.view || searchParams.view === 'friends') && !searchParams.user) {
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

    query = query.containedBy('user_id', [...friendIds])
  } else if (searchParams.view === 'user') {
    query = query.contains('user_id', [user.id])
  }

  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .limit(searchParams.size ? parseInt(searchParams.size) : 25)

  if (error) {
    throw error
  }

  return { data, count }
}

export default async function ActivityPage(
  props: {
    searchParams: Promise<Exclude<ActivityFetchOptions, 'size'> & { size?: string }>
  }
) {
  const searchParams = await props.searchParams;
  const { data, count } = await fetchData({ searchParams })
  const groupedItems = groupByDate(data as ActivityItemT[])

  function groupByDate(items: ActivityItemT[]) {
    return items.reduce<{ date: string; items: ActivityItemT[] }[]>((acc, item) => {
      const date = new Date(item.created_at).toLocaleDateString('de-CH', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
      if (!acc.find(group => group.date === date)) {
        acc.push({ date, items: [] })
      }
      acc.find(group => group.date === date)?.items.push(item)
      return acc
    }, [])
  }

  return (
    <main className="container">
      <h1>Aktivität</h1>
      <div className="grid gap-6">
        <div className="flex flex-col gap-4 md:flex-row">
          {!searchParams.user && <ViewFilter />}
          <ActivityTypeFilter />
        </div>
        {data.length === 0 && <p className="mb-4 text-slate-300">Keine Aktivität gefunden.</p>}
        {groupedItems.map(group => (
          <section key={group.date}>
            <h2 className="h3">{group.date}</h2>
            <ul className="grid gap-2">
              {group.items.map((item, index) => (
                <ActivityItem key={index} activityItem={item} />
              ))}
            </ul>
          </section>
        ))}
        {data.length !== count && <LoadMoreButton />}
      </div>
    </main>
  )
}
