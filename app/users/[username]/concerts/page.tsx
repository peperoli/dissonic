import { ConcertList } from '@/components/profile/ConcertList'
import { createClient } from '@/utils/supabase/server'

async function fetchData(username: string) {
  const supabase = await createClient()

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .single()

  if (error) {
    throw error
  }

  return { profile }
}

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const { profile } = await fetchData(username)
  return <ConcertList profileId={profile.id} />
}
