import HomePage from '../components/concerts/HomePage'
import supabase from '../utils/supabase'

async function fetchData() {
  const { data: concerts } = await supabase
    .from('concerts')
    .select('*, location(*), bands!j_concert_bands(*), bandsSeen:bands!j_bands_seen(*)')
    .order('date_start', { ascending: false })

  const { data: bands } = await supabase.from('bands').select('*').order('name')

  const { data: locations } = await supabase.from('locations').select('id,name')

  const data = { concerts, bands, locations }

  return data
}

export default async function Page() {
  const data = await fetchData()
  return <HomePage initialConcerts={data.concerts} bands={data.bands} locations={data.locations} />
}
