import { ConcertPage } from '../../../components/concerts/ConcertPage'
import { Concert } from '../../../types/types'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const revalidate = 60

const fetchConcert = async (concertId: string): Promise<Concert> => {
  const supabase = createServerComponentClient({ cookies })

  const { data, error } = await supabase
    .from('concerts')
    .select(
      '*, location:locations(*), bands!j_concert_bands(*, genres(*)), bands_seen:j_bands_seen(band_id, user_id)'
    )
    .eq('id', concertId)
    .single()

  if (error) {
    throw error
  }

  return data
}

export default async function Page({ params }: { params: { id: string } }) {
  const concert = await fetchConcert(params.id)
  const cookieStore = cookies()
  return (
    <ConcertPage initialConcert={concert} concertQueryState={cookieStore.get('concertQueryState')?.value} />
  )
}
