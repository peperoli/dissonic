import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { BandsPage } from '../../components/bands/BandsPage'
import { Band, ExtendedRes } from '../../types/types'
import { cookies } from 'next/headers'

const fetchData = async (): Promise<ExtendedRes<Band[]>> => {
  const supabase = createServerComponentClient({ cookies })

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
