import HomePage from '../components/concerts/HomePage'
import supabase from '../utils/supabase'

export const revalidate = 0

async function fetchData() {
  const { data: concerts } = await supabase
    .from('concerts')
    .select('*, location(*), bands!j_concert_bands(*), bandsSeen:bands!j_bands_seen(*)')
    .order('date_start', { ascending: false })

  const { data: bands } = await supabase.from('bands').select('*').order('name')

  const { data: locations } = await supabase.from('locations').select('id,name')

  return { concerts, bands, locations }
}

export default async function Page() {
  const { concerts, bands, locations } = await fetchData()
  return <HomePage initialConcerts={concerts} bands={bands} locations={locations} />
}
