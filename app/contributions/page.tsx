import { ContributionGroup } from '@/components/contributions/ContributionGroup'
import { LoadMoreButton } from '@/components/contributions/LoadMoreButton'
import { OperationFilter } from '@/components/contributions/OperationFilter'
import { ResourceTypeFilter } from '@/components/contributions/ResourceTypeFilter'
import { relatedResourceTypes } from '@/hooks/contributions/useContributionsCount'
import { getMediumDate } from '@/lib/date'
import { Tables } from '@/types/supabase'
import { ContributionFetchOptions } from '@/types/types'
import { createClient } from '@/utils/supabase/server'
import { getLocale, getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'

async function fetchData({ searchParams }: { searchParams: ContributionFetchOptions }) {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/login?redirect=/contributions')
  }

  let query = supabase
    .from('contributions')
    .select('*', { count: 'estimated' })
    .order('timestamp', { ascending: false })
    .limit(searchParams.size ? parseInt(searchParams.size) : 50)

  if (searchParams.resourceType && searchParams.resourceType !== 'all') {
    query = query.in('resource_type', [
      searchParams.resourceType,
      ...relatedResourceTypes[searchParams.resourceType],
    ])
  }

  if (searchParams.resourceId) {
    query = query.eq('resource_id', parseInt(searchParams.resourceId))
  }

  if (searchParams.userId) {
    query = query.eq('user_id', searchParams.userId)
  }

  if (searchParams.operation && searchParams.operation !== 'all') {
    query = query.eq('operation', searchParams.operation)
  }

  const { data, count, error } = await query

  if (error) {
    throw error
  }

  return { data, count }
}

export default async function ContributionsPage(props: {
  searchParams: Promise<ContributionFetchOptions>
}) {
  const searchParams = await props.searchParams
  const { data: contributions, count: contributionsCount } = await fetchData({ searchParams })
  const t = await getTranslations('ContributionsPage')
  const locale = await getLocale()
  const groupedContributions = groupByDateAndTime(contributions)

  function groupByDateAndTime(items: Tables<'contributions'>[]) {
    type DateGroup<T> = { date: string; items: T[] }
    type TimeGroup<T> = {
      time: number
      userId: string | null
      resourceType: string
      resourceId: number | null
      items: T[]
    }

    return items.reduce<DateGroup<TimeGroup<Tables<'contributions'>>>[]>((acc, item) => {
      const date = getMediumDate(item.timestamp, locale)
      const time = new Date(item.timestamp).getTime()
      const userId = item.user_id?.[0] ?? null
      const resourceType = item.resource_type
      const resourceId = item.resource_id

      let dateGroup = acc.find(group => group.date === date)
      if (!dateGroup) {
        dateGroup = { date, items: [] }
        acc.push(dateGroup)
      }

      let timeGroup = dateGroup.items.find(
        group =>
          group.time === time &&
          group.userId === userId &&
          group.resourceId === resourceId &&
          group.resourceType === resourceType
      )
      if (!timeGroup) {
        timeGroup = { time, userId, resourceId, resourceType, items: [] }
        dateGroup.items.push(timeGroup)
      }

      timeGroup.items.push(item)
      return acc
    }, [])
  }

  return (
    <main className="container">
      <h1>{t('contributions')}</h1>
      <div className="mb-6 flex flex-col gap-4 md:flex-row">
        <OperationFilter />
        <ResourceTypeFilter />
      </div>
      {contributions.length === 0 && <p className="mb-4 text-slate-300">{t('noEntriesFound')}</p>}
      <div className="grid gap-6">
        {groupedContributions.map(dateGroup => (
          <section key={dateGroup.date}>
            <h2 className="section-headline">{dateGroup.date}</h2>
            <ul className="grid gap-2">
              {dateGroup.items.map(timeGroup => (
                <ContributionGroup key={timeGroup.time} timeGroup={timeGroup} />
              ))}
            </ul>
          </section>
        ))}
        {contributions.length !== contributionsCount && <LoadMoreButton shallow={false} />}
      </div>
    </main>
  )
}
