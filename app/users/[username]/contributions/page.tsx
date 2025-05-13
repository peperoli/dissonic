import { ContributionGroup } from '@/components/contributions/ContributionGroup'
import { LoadMoreButton } from '@/components/contributions/LoadMoreButton'
import { Tooltip } from '@/components/shared/Tooltip'
import { getMediumDate } from '@/lib/date'
import { Tables } from '@/types/supabase'
import { createClient } from '@/utils/supabase/server'
import { InfoIcon } from 'lucide-react'
import { getLocale, getTranslations } from 'next-intl/server'

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

  const { count: addedConcertsCount } = await supabase
    .from('contributions')
    .select('*', { count: 'estimated', head: true })
    .eq('user_id', profile.id)
    .eq('resource_type', 'concerts')
    .eq('operation', 'INSERT')

  const { count: addedBandsCount } = await supabase
    .from('contributions')
    .select('*', { count: 'estimated', head: true })
    .eq('user_id', profile.id)
    .eq('resource_type', 'bands')
    .eq('operation', 'INSERT')

  const { count: addedLocationsCount } = await supabase
    .from('contributions')
    .select('*', { count: 'estimated', head: true })
    .eq('user_id', profile.id)
    .eq('resource_type', 'locations')
    .eq('operation', 'INSERT')

  return {
    contributions: data,
    contributionsCount: count,
    addedConcertsCount,
    addedBandsCount,
    addedLocationsCount,
  }
}

export default async function ContributionsPage(props: {
  params: Promise<{ username: string }>
  searchParams: Promise<{ size?: string }>
}) {
  const params = await props.params
  const searchParams = await props.searchParams
  const {
    contributions,
    contributionsCount,
    addedConcertsCount,
    addedBandsCount,
    addedLocationsCount,
  } = await fetchData({
    params,
    searchParams,
  })
  const locale = await getLocale()
  const t = await getTranslations('ContributionsPage')
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
    <section className="grid gap-6">
      {contributions.length === 0 && <p className="mb-4 text-slate-300">{t('noEntriesFound')}</p>}
      {!!contributionsCount && (
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <li className="rounded-lg bg-slate-800 p-4">
            <p className="h2 mb-0 inline-flex items-center gap-2">
              {contributionsCount}
              <Tooltip content={t('contributionsHint')}>
                <InfoIcon className="size-icon text-sm" />
              </Tooltip>
            </p>
            <span className="text-sm">
              {t('contributionsTotal', { count: contributionsCount })}
            </span>
          </li>
          {!!addedConcertsCount && (
            <li className="rounded-lg bg-slate-800 p-4">
              <p className="h2 mb-0">{addedConcertsCount}</p>
              <span className="text-sm">{t('concertsAdded', { count: addedConcertsCount })}</span>
            </li>
          )}
          {!!addedBandsCount && (
            <li className="rounded-lg bg-slate-800 p-4">
              <p className="h2 mb-0">{addedBandsCount}</p>
              <span className="text-sm">{t('bandsAdded', { count: addedBandsCount })}</span>
            </li>
          )}
          {!!addedLocationsCount && (
            <li className="rounded-lg bg-slate-800 p-4">
              <p className="h2 mb-0">{addedLocationsCount}</p>
              <span className="text-sm">{t('locationsAdded', { count: addedLocationsCount })}</span>
            </li>
          )}
        </ul>
      )}
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
    </section>
  )
}
