import { cookies } from 'next/headers'
import { Concert } from '@/types/types'
import { createClient } from '@/utils/supabase/server'
import { ConcertsPage } from '@/components/concerts/ConcertsPage'

async function fetchData() {
  const supabase = await createClient()
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data, count, error } = await supabase
    .from('concerts_full')
    .select('*, bands:j_concert_bands(*, ...bands(*, genres(*)))', { count: 'estimated' })
    .gte('date_start', tomorrow.toISOString())
    .order('date_start', { ascending: true })
    .order('item_index', { referencedTable: 'j_concert_bands', ascending: true })
    .limit(25)
    .limit(5, { referencedTable: 'j_concert_bands' })
    .overrideTypes<Concert[]>()

  if (error) {
    throw error
  }

  return { concerts: { data, count }, user }
}

export default async function Page() {
  const cookieStore = await cookies()
  const userView = cookieStore.get('concertsUserView')?.value
  const view = {
    range: 'future',
    userView: userView || 'global',
  }
  const { concerts, user } = await fetchData()

  return <ConcertsPage concerts={concerts} currentUser={user} view={view} />
}
