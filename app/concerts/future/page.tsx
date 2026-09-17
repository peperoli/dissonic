import { createClient } from '@/utils/supabase/server'
import { ConcertsPage } from '@/components/concerts/ConcertsPage'
import { Temporal } from 'temporal-polyfill'

async function fetchData() {
  const supabase = await createClient()
  const tomorrow = Temporal.Now.plainDateISO().add({ days: 1 })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data, count, error } = await supabase
    .rpc('get_concerts', { sort_asc: true }, { count: 'estimated' })
    .select(
      `*,
      festival_root:festival_roots(id, name),
      bands:j_concert_bands(item_index, ...bands(*, genres(*))),
      location:locations(*)`
    )
    .gte('date_start', tomorrow.toString())
    .order('item_index', { referencedTable: 'j_concert_bands', ascending: true })
    .limit(25)
    .limit(5, { referencedTable: 'j_concert_bands' })

  if (error) {
    throw error
  }

  return { concerts: { data, count }, user }
}

export default async function Page() {
  const { concerts, user } = await fetchData()

  return (
    <ConcertsPage
      concerts={concerts}
      currentUser={user}
      view={{ range: 'future', userView: 'global' }}
    />
  )
}
