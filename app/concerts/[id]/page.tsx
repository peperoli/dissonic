import { ConcertPage } from '../../../components/concerts/ConcertPage'
import { Concert } from '../../../types/types'
import { cookies } from 'next/headers'
import { createClient } from '../../../utils/supabase/server'

export const revalidate = 60

const fetchConcert = async (concertId: string) => {
  const supabase = createClient(cookies())

  const { data, error } = await supabase
    .from('concerts')
    .select(
      `*,
      location:locations(*),
      bands:j_concert_bands(*, ...bands(*, country:countries(id, iso2), genres(*))),
      bands_seen:j_bands_seen(*)`
    )
    .eq('id', concertId)
    .order('item_index', { referencedTable: 'j_concert_bands', ascending: true })
    .returns<Concert>()
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
