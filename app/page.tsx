import { RecentConcerts } from '@/components/home/RecentConcerts'
import { createClient } from '@/utils/supabase/server'
import { getTranslations } from 'next-intl/server'
import { Temporal } from 'temporal-polyfill'
import { RecentlyAdded } from '@/components/home/RecentlyAdded'
import { LatestActivity } from '@/components/home/LatestActivity'

async function fetchData() {
  const supabase = await createClient()
  const today = Temporal.Now.plainDateISO()

  const { data: concerts, error: concertsError } = await supabase
    .from('concerts')
    .select(
      `*,
      festival_root:festival_roots(id, name),
      bands:j_concert_bands(item_index, ...bands(*, genres(*))),
      bands_seen:j_bands_seen(*),
      location:locations(*)`
    )
    .lte('date_start', today)
    .order('date_start', { ascending: false })
    .order('item_index', { referencedTable: 'j_concert_bands', ascending: true })
    .limit(25)

  if (concertsError) {
    throw concertsError
  }

  const fanIds = Array.from(
    new Set(concerts.flatMap(item => item.bands_seen?.map(b => b.user_id) ?? []))
  )

  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .in('id', fanIds)

  if (profilesError) {
    throw profilesError
  }

  const { data: recentlyAddedConcerts, error: recentlyAddedConcertsError } = await supabase
    .from('concerts')
    .select(
      `*,
      festival_root:festival_roots(id, name),
      location:locations(*),
      bands:j_concert_bands(*, ...bands(*, genres(*))),
      bands_seen:j_bands_seen(*),
      creator:profiles!concerts_creator_id_fkey(username)`
    )
    .order('created_at', { ascending: false })
    .limit(3)

  if (recentlyAddedConcertsError) {
    throw recentlyAddedConcertsError
  }

  return { concerts, profiles, recentlyAddedConcerts }
}

export default async function HomePage() {
  const { concerts, profiles, recentlyAddedConcerts } = await fetchData()
  const t = await getTranslations('HomePage')

  return (
    <main className="container">
      <h1 className="sr-only">{t('home')}</h1>
      <RecentConcerts concerts={concerts} profiles={profiles} />
      <LatestActivity />
      <RecentlyAdded concerts={recentlyAddedConcerts} />
    </main>
  )
}
