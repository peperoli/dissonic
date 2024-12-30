import { ConcertsByWeekday } from '@/components/profile/ConcertsByWeekday'
import { ConcertsByYear } from '@/components/profile/ConcertsByYear'
import { ConcertStats } from '@/components/profile/ConcertStats'
import { PieCharts } from '@/components/profile/PieCharts'
import { TopBands } from '@/components/profile/TopBands'
import { TopLocations } from '@/components/profile/TopLocations'
import { getTranslations } from 'next-intl/server'

export default async function GlobalStatsPage() {
  const t = await getTranslations('GlobalStatsPage')

  return (
    <main className="container">
      <h1>{t('globalStats')}</h1>
      <section className="grid gap-4">
        <TopBands />
        <div className="grid gap-4 md:grid-cols-2">
          <PieCharts />
          <ConcertsByWeekday />
        </div>
        <ConcertStats />
        <ConcertsByYear />
        <TopLocations />
      </section>
    </main>
  )
}
