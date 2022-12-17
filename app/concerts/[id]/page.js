import ConcertPage from '../../../components/concerts/ConcertPage'
import supabase from '../../../utils/supabase'

export const revalidate = 0

async function fetchData(params) {
  const { data: concert, error } = await supabase
    .from('concerts')
    .select(
      `
      *,
      location(*),
      bands!j_concert_bands(
        *,
        genres(*)
      )
    `
    )
    .eq('id', params.id)
    .single()

  const { data: bands } = await supabase.from('bands').select('*, genres(*)').order('name')

  const { data: locations } = await supabase.from('locations').select('*').order('name')

  if (error) {
    console.error(error)
  }

  return { concert, bands, locations }
}

export default async function Page({ params }) {
  const { concert, bands, locations } = await fetchData(params)
  return <ConcertPage initialConcert={concert} bands={bands} locations={locations} />
}
