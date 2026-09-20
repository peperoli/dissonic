import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { ConcertsPage } from '@/components/concerts/ConcertsPage'
import { Temporal } from 'temporal-polyfill'
import { getUserIdsForView } from '@/lib/getUserIdsForView'

async function fetchData({ userView }: { userView: string }) {
  const supabase = await createClient()
  const today = Temporal.Now.plainDateISO()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const rpcOptions = {
    user_ids: (await getUserIdsForView(supabase, userView)) ?? undefined,
  }

  const { count, error: countError } = await supabase.rpc('get_concerts', rpcOptions, {
    count: 'estimated',
    head: true,
  })

  if (countError) {
    throw countError
  }

  const { data, error } = await supabase
    .rpc('get_concerts', rpcOptions)
    .select(
      `*,
      festival_root:festival_roots(id, name),
      bands:j_concert_bands(item_index, ...bands(*, genres(*))),
      location:locations(*)`
    )
    .lte('date_start', today.toString())
    .order('item_index', { referencedTable: 'j_concert_bands', ascending: true })
    .limit(25)
    .limit(5, { referencedTable: 'j_concert_bands' })

  if (error) {
    throw error
  }

  return { concerts: { data, count }, user }
}

export default async function Page() {
  const cookieStore = await cookies()
  const userView = cookieStore.get('concertsUserView')?.value || 'global'
  const { concerts, user } = await fetchData({ userView })

  return <ConcertsPage concerts={concerts} currentUser={user} view={{ range: 'past', userView }} />
}
