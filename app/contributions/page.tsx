import { ContributionGroup } from '@/components/contributions/ContributionGroup'
import { LoadMoreButton } from '@/components/contributions/LoadMoreButton'
import { Tables } from '@/types/supabase'
import { ContributionFetchOptions } from '@/types/types'
import { createClient } from '@/utils/supabase/server'
import { getLocale, getTranslations } from 'next-intl/server'

const relatedRessourceTypes = {
  concerts: ['j_concert_bands'],
  bands: ['j_band_genres'],
  locations: [],
}

async function fetchData({ searchParams }: { searchParams: ContributionFetchOptions }) {
  const supabase = await createClient()

  let query = supabase
    .from('contributions')
    .select('*', { count: 'estimated' })
    .order('timestamp', { ascending: false })
    .limit(searchParams.size ? parseInt(searchParams.size) : 50)

  if (searchParams.ressourceType) {
    query = query.in('ressource_type', [
      searchParams.ressourceType,
      ...relatedRessourceTypes[searchParams.ressourceType],
    ])
  }

  if (searchParams.ressourceId) {
    query = query.eq('ressource_id', searchParams.ressourceId)
  }

  if (searchParams.userId) {
    query = query.eq('user_id', searchParams.userId)
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
      ressourceType: string
      ressourceId: number | null
      items: T[]
    }

    return items.reduce<DateGroup<TimeGroup<Tables<'contributions'>>>[]>((acc, item) => {
      const date = new Date(item.timestamp).toLocaleDateString(locale, {
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
    <main className="container">
      <h1>{t('contributions')}</h1>
      {contributions.length === 0 && (
        <p className="mb-4 text-slate-300">{t('noEntriesFound')}</p>
      )}
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
        {contributions.length !== contributionsCount && <LoadMoreButton />}
      </div>
    </main>
  )
}
