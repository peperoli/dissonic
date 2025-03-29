import { SpeedDial } from '@/components/layout/SpeedDial'
import { SortSelect } from '@/components/users/SortSelect'
import { UserItem } from '@/components/users/UserItem'
import { Database } from '@/types/supabase'
import { createClient } from '@/utils/supabase/server'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata() {
  const t = await getTranslations('UsersPage')

  return {
    title: `${t('fans')} • Dissonic`,
  }
}

type SearchParams = {
  sort_by?: string
  sort_asc?: 'true' | 'false'
}

export type ProfileStat = Database['public']['Views']['profile_stats']['Row']

async function fetchProfiles(options: SearchParams): Promise<ProfileStat[]> {
  const supabase = await createClient()
  let query = supabase.from('profile_stats').select('*')

  if (!options.sort_by || options.sort_by === 'concert_count') {
    query = query
      .order('concert_count', { ascending: options.sort_asc === 'true' })
      .order('band_count', { ascending: options.sort_asc === 'true' })
  } else if (options.sort_by === 'bands_count') {
    query = query
      .order('band_count', { ascending: options.sort_asc === 'true' })
      .order('concert_count', { ascending: options.sort_asc === 'true' })
  } else {
    query = query.order(options.sort_by, { ascending: options.sort_asc === 'true' })
  }

  const { data, error } = await query

  if (error) {
    throw error
  }

  return data
}

export default async function Page(props: { searchParams: Promise<SearchParams> }) {
  const searchParams = await props.searchParams
  const profileStats = await fetchProfiles(searchParams)
  const t = await getTranslations('UsersPage')
  return (
    <main className="container">
      <h1>{t('fans')}</h1>
      <div className="-mx-4 grid grid-cols-3 gap-4 bg-radial-gradient from-blue/20 via-slate-800 to-slate-800 p-6 md:m-0 md:grid-cols-4 md:rounded-2xl">
        <div className="col-span-full">
          <div className="w-fit">
            <SortSelect />
          </div>
        </div>
        {profileStats.map((profileStat, index) => (
          <UserItem key={profileStat.id} profileStat={profileStat} index={index} />
        ))}
      </div>
      <SpeedDial />
    </main>
  )
}
