import { HomePage } from '../components/concerts/HomePage'
import supabase from '../utils/supabase'

export const revalidate = 0

async function fetchData() {
  const { data: concerts } = await supabase
    .from('concerts')
    .select('*, location:locations(*), bands!j_concert_bands(*), bandsSeen:bands!j_bands_seen(*)')
    .order('date_start', { ascending: false })

  const { data: bands } = await supabase.from('bands').select('*').order('name')

  const { data: locations } = await supabase.from('locations').select('id, name').order('name')

  const { data: profiles } = await supabase.from('profiles').select('*')

  return { concerts, bands, locations, profiles }
}

export default async function Page() {
  const { concerts, bands, locations, profiles } = await fetchData()
  return <HomePage concerts={concerts} bands={bands} locations={locations} profiles={profiles} />
}
