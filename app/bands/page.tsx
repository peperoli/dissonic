import { getTranslations } from 'next-intl/server'
import { BandsPage } from '../../components/bands/BandsPage'
import { createClient } from '../../utils/supabase/server'

export async function generateMetadata() {
  const t = await getTranslations('BandsPage')

  return {
    title: `${t('bands')} • Dissonic`,
  }
}

const fetchData = async () => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('bands')
    .select('*, country:countries(*), genres(*)')
    .eq('is_archived', false)
    .range(0, 24)
    .order('name')

  if (error) {
    throw error
  }

  const { count } = await supabase
    .from('bands')
    .select('*', { count: 'exact', head: true })
    .eq('is_archived', false)

  return { data, count }
}

export default async function Page() {
  const bands = await fetchData()
  return <BandsPage initialBands={bands} />
}
