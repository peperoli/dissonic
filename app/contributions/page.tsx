import { ContributionItem } from '@/components/contributions/ContributionItem'
import { createClient } from '@/utils/supabase/server'

async function fetchData() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('contributions')
    .select('*')
    .order('timestamp', { ascending: false })

  if (error) {
    throw error
  }

  return data
}

export default async function Contributions() {
  const contributions = await fetchData()

  return (
    <main className="container">
      <h1>Mitwirkungen</h1>
      <div className="grid gap-2">
        {contributions.map(contribution => (
          <ContributionItem key={contribution.id} contribution={contribution} />
        ))}
      </div>
    </main>
  )
}
