import { HomePage } from '../components/concerts/HomePage'
import { Concert } from '../types/types'
import { cookies } from 'next/headers'
import { createClient } from '../utils/supabase/server'

const fetchData = async () => {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data, count, error } = await supabase
    .from('concerts_full')
    .select(
      `*, bands:j_concert_bands(*, ...bands(*, genres(*)))`,
      { count: 'estimated' }
    ) 
    .range(0, 24)
    .order('date_start', { ascending: false })
    .order('item_index', { referencedTable: 'j_concert_bands', ascending: true })
    .returns<Concert[]>()

  if (error) {
    throw error
  }

  return { data, count }
}

async function fetchConcerts() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data, count, error } = await supabase
    .from('concerts_full')
    .select('*, bands:j_concert_bands(*, ...bands(*, genres(*)))', { count: 'estimated' })
    .order('item_index', { referencedTable: 'j_concert_bands', ascending: true })
    .order('bands_count', { ascending: false })

  if (error) {
    console.log(error)
  }

  return { data }
}

export default async function Page() {
  const concerts = await fetchData()
  const data = await fetchConcerts()
  return <HomePage concerts={data} />
  return <pre>{JSON.stringify(data, null, 2)}</pre>
}
