import { ActivityItem } from '@/components/activity/ActivityItem'
import { TypeFilter, typeItems } from '@/components/activity/TypeFilter'
import { LoadMoreButton } from '@/components/contributions/LoadMoreButton'
import { Database, Tables } from '@/types/supabase'
import { createClient } from '@/utils/supabase/server'

type Concert = Pick<Tables<'concerts'>, 'id' | 'name' | 'date_start'> & {
  festival_root: Pick<Tables<'festival_roots'>, 'id' | 'name'>
  location: Pick<Tables<'locations'>, 'id' | 'name'>
  bands: Pick<Tables<'bands'>, 'id' | 'name'>[]
}

export type ActivityItemT = Database['public']['Views']['activity']['Row'] & {
  user: Tables<'profiles'>
  created_at: string
}

async function fetchData({ searchParams }: { searchParams: { size?: string; type?: string } }) {
  const supabase = createClient()

  let query = supabase.from('activity').select('*', { count: 'estimated' }).eq('type', 'comments')

  if (searchParams.type) {
    query = query.in(
      'type',
      searchParams.type
        .split(',')
        .map(typeIndex => ['j_bands_seen', 'comments', 'friends'][parseInt(typeIndex)])
    )
  }

  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    // .limit(searchParams.size ? parseInt(searchParams.size) : 25)

  if (error) {
    throw error
  }

  return { data, count }
}

export default async function ActivityPage({
  searchParams,
}: {
  searchParams: { size?: string; type?: string }
}) {
  const { data, count } = await fetchData({ searchParams })
  const groupedItems = groupByDate(data)

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
      <TypeFilter />
      {data.length === 0 && (
        <p className="mb-4 text-slate-300">Keine Aktivität gefunden.</p>
      )}
      <div className="grid gap-6">
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
