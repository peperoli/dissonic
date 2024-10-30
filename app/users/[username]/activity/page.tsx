import { ActivityGroup } from '@/components/activity/ActivityGroup'
import { LoadMoreButton } from '@/components/contributions/LoadMoreButton'
import { Database, Tables } from '@/types/supabase'
import { createClient } from '@/utils/supabase/server'

export type ActivityItemT = Database['public']['Views']['activity']['Row'] & {
  user: Tables<'profiles'>
  created_at: string
}

async function fetchData({
  params,
  searchParams,
}: {
  params: { username: string }
  searchParams: { size?: string }
}) {
  const supabase = await createClient()

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', params.username)
    .single()

  if (profileError) {
    throw profileError
  }

  const { data, count, error } = await supabase
    .from('activity')
    .select('*', { count: 'estimated' })
    .overlaps('user_id', [profile.id])
    .order('created_at', { ascending: false })
    .limit(searchParams.size ? parseInt(searchParams.size) : 50)

  if (error) {
    throw error
  }

  return { data, count }
}

export default async function ActivityPage(props: {
  params: Promise<{ username: string }>
  searchParams: Promise<{ size?: string }>
}) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { data, count } = await fetchData({ params, searchParams })
  const groupedItems = groupByDateAndTime(data as ActivityItemT[])

  function groupByDateAndTime(items: ActivityItemT[]) {
    type DateGroup<T> = { date: string; items: T[] }
    type TimeGroup<T> = {
      time: number
      userId: string | null
      concertId: number | null
      items: T[]
    }

    return items.reduce<DateGroup<TimeGroup<ActivityItemT>>[]>((acc, item) => {
      const date = new Date(item.created_at).toLocaleDateString('de-CH', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
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
    <section className="grid gap-6">
      {data.length === 0 && <p className="mb-4 text-slate-300">Keine Aktivität gefunden.</p>}
      {groupedItems.map(dateGroup => (
        <section key={dateGroup.date}>
          <h2 className="h3">{dateGroup.date}</h2>
          <ul className="grid gap-2">
            {dateGroup.items.map(timeGroup => (
              <ActivityGroup key={timeGroup.time} timeGroup={timeGroup} />
            ))}
          </ul>
        </section>
      ))}
      {data.length !== count && <LoadMoreButton />}
    </section>
  )
}
