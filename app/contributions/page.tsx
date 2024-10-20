import { ContributionItem } from '@/components/contributions/ContributionItem'
import { LoadMoreButton } from '@/components/contributions/LoadMoreButton'
import { Tables } from '@/types/supabase'
import { ContributionFetchOptions } from '@/types/types'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

const relatedRessourceTypes = {
  concerts: ['j_concert_bands'],
  bands: ['j_concert_bands', 'j_band_genres'],
  locations: []
}

async function fetchData({ searchParams }: { searchParams: ContributionFetchOptions }) {
  const supabase = createClient()

  let query = supabase
    .from('contributions')
    .select('*', { count: 'estimated' })
    .order('timestamp', { ascending: false })
    .limit(searchParams.size ? parseInt(searchParams.size) : 25)

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

export default async function ContributionsPage({
  searchParams,
}: {
  searchParams: ContributionFetchOptions
}) {
  const { data: contributions, count: contributionsCount } = await fetchData({ searchParams })
  const groupedContributions = groupByDate(contributions)

  function groupByDate(contributions: Tables<'contributions'>[]) {
    return contributions.reduce<{ date: string; contributions: Tables<'contributions'>[] }[]>(
      (acc, contribution) => {
        const date = new Date(contribution.timestamp).toLocaleDateString('de-CH', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
        if (!acc.find(group => group.date === date)) {
          acc.push({ date, contributions: [] })
        }
        acc.find(group => group.date === date)?.contributions.push(contribution)
        return acc
      },
      []
    )
  }

  return (
    <main className="container">
      <h1>Bearbeitungen</h1>
      {contributions.length === 0 && (
        <>
          <p className="mb-4 text-slate-300">
            Keine Bearbeitungen für diese Ressource / diesen User gefunden.
          </p>
          {(searchParams.size || searchParams.ressourceId || searchParams.ressourceType) && (
            <Link href="/contributions" className="btn btn-secondary btn-small">
              Alle Bearbeitungen
            </Link>
          )}
        </>
      )}
      <div className="grid gap-6">
        {groupedContributions.map(group => (
          <section key={group.date}>
            <h2 className="h3">{group.date}</h2>
            <div className="grid gap-2">
              {group.contributions.map(contribution => (
                <ContributionItem key={contribution.id} contribution={contribution} />
              ))}
            </div>
          </section>
        ))}
        {contributions.length !== contributionsCount && <LoadMoreButton />}
      </div>
    </main>
  )
}
