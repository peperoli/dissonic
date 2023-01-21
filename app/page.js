import { HomePage } from '../components/concerts/HomePage'
import supabase from '../utils/supabase'

export const revalidate = 0

async function fetchData() {
  const { data: concerts } = await supabase
    .from('concerts')
    .select('*, location:locations(*), bands!j_concert_bands(*), bandsSeen:j_bands_seen(band_id, user_id)')
    .order('date_start', { ascending: false })

  const { data: profiles } = await supabase.from('profiles').select('*')

  return { concerts, profiles }
}

export default async function Page() {
  const { concerts, profiles } = await fetchData()
  return <HomePage concerts={concerts} profiles={profiles} />
}
