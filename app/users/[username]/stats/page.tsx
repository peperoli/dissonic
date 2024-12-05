import { ConcertsByWeekday } from '@/components/profile/ConcertsByWeekday'
import { ConcertsByYear } from '@/components/profile/ConcertsByYear'
import { ConcertStats } from '@/components/profile/ConcertStats'
import { PieCharts } from '@/components/profile/PieCharts'
import { TopBands } from '@/components/profile/TopBands'
import { TopLocations } from '@/components/profile/TopLocations'
import { createClient } from '@/utils/supabase/server'

async function fetchData(username: string) {
  const supabase = await createClient()

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .single()

  if (error) {
    throw error
  }

  return { profile }
}

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const { profile } = await fetchData(username)
  return (
    <section className="grid gap-4">
      <TopBands profileId={profile.id} />
      <div className="grid md:grid-cols-2 gap-4">
        <PieCharts profileId={profile.id} />
        <ConcertsByWeekday profileId={profile.id} />
      </div>
      <ConcertStats profileId={profile.id} />
      <ConcertsByYear profileId={profile.id} />
      <TopLocations profileId={profile.id} />
    </section>
  )
}
