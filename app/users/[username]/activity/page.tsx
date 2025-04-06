import { ActivityList } from '@/components/activity/ActivityList'
import { Database, Tables } from '@/types/supabase'
import { createClient } from '@/utils/supabase/server'

export type ActivityItemT = Database['public']['Views']['activities']['Row'] & {
  user: Tables<'profiles'>
  created_at: string
}

async function fetchData({
  params,
  searchParams,
}: {
  params: { username: string }
  searchParams: { size?: string }
}) {
  const supabase = await createClient()

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', params.username)
    .single()

  if (profileError) {
    throw profileError
  }

  const { data, count, error } = await supabase
    .from('activities')
    .select('*', { count: 'estimated' })
    .overlaps('user_id', [profile.id])
    .order('created_at', { ascending: false })
    .limit(searchParams.size ? parseInt(searchParams.size) : 50)
    .overrideTypes<ActivityItemT[]>()

  if (error) {
    throw error
  }

  return { data, count, profileId: profile.id }
}

export default async function ActivityPage(props: {
  params: Promise<{ username: string }>
  searchParams: Promise<{ size?: string }>
}) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { profileId, ...activities } = await fetchData({ params, searchParams })

  return (
    <section className="grid gap-6">
      <ActivityList activities={activities} profileId={profileId} />
    </section>
  )
}
