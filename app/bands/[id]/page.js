import { BandPage } from '../../../components/bands/BandPage'
import supabase from '../../../utils/supabase'

export const revalidate = 0

async function fetchData(params) {
  const { data: band, error } = await supabase
    .from('bands')
    .select('*, country(id, iso2, name), genres(*)')
    .eq('id', params.id)
    .single()

  const { data: countries } = await supabase
    .from('countries')
    .select('id, name, iso2')
    .neq('local_name', null)
    .neq('iso2', 'AQ')

  const { data: genres } = await supabase.from('genres').select('*')

  const { data: concerts, error: concertsError } = await supabase
    .from('concerts')
    .select('*, bands!j_concert_bands!inner(*), location(name)')
    .eq('bands.id', params.id)

  if (error) {
    console.error(error)
  }

  if (concertsError) {
    console.log(concertsError)
  }

  return { band, countries, genres, concerts }
}

export default async function Page({ params }) {
  const { band, countries, genres, concerts } = await fetchData(params)
  return <BandPage initialBand={band} countries={countries} genres={genres} concerts={concerts} />
}
