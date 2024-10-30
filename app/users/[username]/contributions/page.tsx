import { ContributionGroup } from '@/components/contributions/ContributionGroup'
import { LoadMoreButton } from '@/components/contributions/LoadMoreButton'
import { Tables } from '@/types/supabase'
import { createClient } from '@/utils/supabase/server'

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
    .from('contributions')
    .select('*', { count: 'estimated' })
    .order('timestamp', { ascending: false })
    .eq('user_id', profile.id)
    .limit(searchParams.size ? parseInt(searchParams.size) : 50)

  if (error) {
    throw error
  }

  return { contributions: data, contributionsCount: count }
}

export default async function ContributionsPage(props: {
  params: Promise<{ username: string }>
  searchParams: Promise<{ size?: string }>
}) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { contributions, contributionsCount } = await fetchData({
    params,
    searchParams,
  })
  const groupedContributions = groupByDateAndTime(contributions)

  function groupByDateAndTime(items: Tables<'contributions'>[]) {
    type DateGroup<T> = { date: string; items: T[] }
    type TimeGroup<T> = {
      time: number
      userId: string | null
      ressourceType: string
      ressourceId: number | null
      items: T[]
    }

    return items.reduce<DateGroup<TimeGroup<Tables<'contributions'>>>[]>((acc, item) => {
      const date = new Date(item.timestamp).toLocaleDateString('de-CH', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
      const time = new Date(item.timestamp).getTime()
      const userId = item.user_id?.[0] ?? null
      const ressourceType = item.ressource_type
      const ressourceId = item.ressource_id

      let dateGroup = acc.find(group => group.date === date)
      if (!dateGroup) {
        dateGroup = { date, items: [] }
        acc.push(dateGroup)
      }

      let timeGroup = dateGroup.items.find(
        group =>
          group.time === time &&
          group.userId === userId &&
          group.ressourceId === ressourceId &&
          group.ressourceType === ressourceType
      )
      if (!timeGroup) {
        timeGroup = { time, userId, ressourceId, ressourceType, items: [] }
        dateGroup.items.push(timeGroup)
      }

      timeGroup.items.push(item)
      return acc
    }, [])
  }

  return (
    <section className="grid gap-6">
      {contributions.length === 0 && (
        <p className="mb-4 text-slate-300">Keine Bearbeitungen für diesen User gefunden.</p>
      )}
      {groupedContributions.map(dateGroup => (
        <section key={dateGroup.date}>
          <h2 className="h3">{dateGroup.date}</h2>
          <ul className="grid gap-2">
            {dateGroup.items.map(timeGroup => (
              <ContributionGroup key={timeGroup.time} timeGroup={timeGroup} />
            ))}
          </ul>
        </section>
      ))}
      {contributions.length !== contributionsCount && <LoadMoreButton />}
    </section>
  )
}
