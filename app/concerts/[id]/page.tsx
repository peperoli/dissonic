import { ConcertPage } from '../../../components/concerts/ConcertPage'
import { Concert } from '../../../types/types'
import { cookies } from 'next/headers'
import { createClient } from '../../../utils/supabase/server'
import supabase from '../../../utils/supabase/client'
import { notFound } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import { getConcertName } from '@/lib/getConcertName'

export async function generateMetadata(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const concert = await fetchConcert(params)
  const locale = await getLocale()
  const concertName = getConcertName(concert, locale)
  return {
    title: `${concertName} • Dissonic`,
  }
}
export async function generateStaticParams() {
  const { data: concerts, error } = await supabase.from('concerts_full').select('id')

  if (error) {
    throw error
  }

  return concerts?.map(concert => ({ id: concert.id?.toString() }))
}

async function fetchConcert(params: { id: string }) {
  const supabase = await createClient()
  const concertId = parseInt(params.id)

  if (Number.isNaN(concertId)) {
    notFound()
  }

  const { data, error } = await supabase
    .from('concerts')
    .select(
      `*,
      festival_root:festival_roots(name),
      location:locations(*),
      bands:j_concert_bands(*, ...bands(*, country:countries(id, iso2), genres(*))),
      bands_seen:j_bands_seen(*),
      creator:profiles!concerts_creator_id_fkey(*)`
    )
    .eq('id', concertId)
    .order('item_index', { referencedTable: 'j_concert_bands', ascending: true })
    .single()
    .overrideTypes<Concert>()

  if (error) {
    if (error.code === 'PGRST116') {
      notFound()
    }

    throw error
  }

  return data
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const concert = await fetchConcert(params)
  const cookieStore = await cookies()
  return (
    <ConcertPage
      initialConcert={concert}
      concertQueryState={cookieStore.get('concertsLastQueryState')?.value}
      bandListHintPreference={cookieStore.get('bandListHint')?.value}
    />
  )
}
