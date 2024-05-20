import { HeaderCell } from '@/components/tables/HeaderCell'
import { Row } from '@/components/users/Row'
import { Database } from '@/types/supabase'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

type SearchParams = {
  sort_by?: string
  sort_asc?: 'true' | 'false'
}

export type ProfileStat = Database['public']['Views']['profile_stats']['Row']

async function fetchProfiles(options: SearchParams): Promise<ProfileStat[]> {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const { data, error } = await supabase
    .from('profile_stats')
    .select('*')
    .order(options.sort_by ?? 'concert_count', { ascending: options.sort_asc === 'true' })

  if (error) {
    throw error
  }

  return data
}

type PageProps = {
  searchParams: SearchParams
}

export default async function Page({ searchParams }: PageProps) {
  const profiles = await fetchProfiles(searchParams)
  return (
    <main className="container">
      <h1>Fans</h1>
      <div className="bg-radial-gradient from-blue/20 via-slate-800 to-slate-800 p-4 md:rounded-2xl">
        <table className="w-full">
          <thead className="text-left">
            <tr>
              <HeaderCell label="" />
              <HeaderCell label="Name" value="username" />
              <HeaderCell label="Konzerte" value="concert_count" textAlign="right" />
              <HeaderCell label="Bands" value="band_count" textAlign="right" />
              <HeaderCell label="Erstellt" value="created_at" textAlign="center" />
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile, index) => (
              <Row key={profile.id} profile={profile} index={index} />
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}
