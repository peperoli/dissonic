import { BandsPage } from '../../components/bands/BandsPage'
import { cookies } from 'next/headers'
import { createClient } from '../../utils/supabase/server'

const fetchData = async () => {
  const supabase = createClient(cookies())

  const { data, count, error } = await supabase
    .from('bands')
    .select('*, country:countries(*), genres(*)', { count: 'estimated' })
    .range(0, 24)
    .order('name')

  if (error) {
    throw error
  }

  return { data, count }
}

export default async function Page() {
  const bands = await fetchData()
  return <BandsPage initialBands={bands} />
}
