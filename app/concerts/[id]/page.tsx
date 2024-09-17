import { ConcertPage } from '../../../components/concerts/ConcertPage'
import { Concert } from '../../../types/types'
import { cookies } from 'next/headers'
import { createClient } from '../../../utils/supabase/server'
import supabase from '../../../utils/supabase/client'

export async function generateStaticParams() {
  const { data: concerts, error } = await supabase.from('concerts').select('id')

  if (error) {
    throw error
  }

  return concerts?.map(concert => ({ id: concert.id }))
}

async function fetchConcert(concertId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('concerts')
    .select(
      `*,
      location:locations(*),
      bands:j_concert_bands(*, ...bands(*, country:countries(id, iso2), genres(*))),
      bands_seen:j_bands_seen(*),
      creator:profiles!concerts_creator_id_fkey(*)`
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
    <ConcertPage
      initialConcert={concert}
      concertQueryState={cookieStore.get('concertQueryState')?.value}
    />
  )
}
