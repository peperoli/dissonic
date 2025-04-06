import { Database, Enums, Tables } from '@/types/supabase'
import { ActivityFetchOptions } from '@/types/types'
import { createClient } from '@/utils/supabase/server'
import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import { ActivityList } from '../../components/activity/ActivityList'
import { ActivityTypeFilter } from '@/components/activity/ActivityTypeFilter'
import { ViewFilter } from '@/components/activity/ViewFilter'
import { jwtDecode } from 'jwt-decode'

export async function generateMetadata() {
  const t = await getTranslations('ActivityPage')

  return {
    title: `${t('activity')} • Dissonic`,
  }
}

export type ActivityItemT = Database['public']['Views']['activities']['Row'] & {
  user: Tables<'profiles'>
  created_at: string
}

async function fetchData({
  searchParams,
}: {
  searchParams?: Exclude<ActivityFetchOptions, 'size'> & { size?: string }
}) {
  const supabase = await createClient()

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError || !session) {
    redirect('/login?redirect=/activity')
  }

  const jwt = jwtDecode(session.access_token)
  const userRole = 'user_role' in jwt ? (jwt.user_role as Enums<'app_role'>) : null
  const isMod = userRole === 'developer' || userRole === 'moderator'

  let query = supabase.from('activities').select('*', { count: 'estimated' })

  if (searchParams?.activityType && searchParams?.activityType !== 'all') {
    query = query.eq('type', searchParams?.activityType)
  }

  if (searchParams?.user) {
    query = query.contains('user_id', searchParams?.user.split(','))
  }

  if (
    ((!isMod && !searchParams?.view) || searchParams?.view === 'friends') &&
    !searchParams?.user
  ) {
    const { data: friends, error: friendsError } = await supabase
      .from('friends')
      .select('*')
      .or(`sender_id.eq.${session.user.id}, receiver_id.eq.${session.user.id}`)
      .eq('pending', false)

    if (friendsError) {
      throw friendsError
    }

    const friendIds = new Set([
      ...friends.map(friend => friend.sender_id),
      ...friends.map(friend => friend.receiver_id),
    ])

    query = query.containedBy('user_id', [...friendIds])
  } else if (searchParams?.view === 'user') {
    query = query.contains('user_id', [session.user.id])
  }

  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .limit(searchParams?.size ? parseInt(searchParams?.size) : 50)
    .overrideTypes<ActivityItemT[]>()

  if (error) {
    throw error
  }

  return { data, count }
}

export default async function ActivityPage(props: {
  searchParams: Promise<Exclude<ActivityFetchOptions, 'size'> & { size?: string }>
}) {
  const searchParams = await props.searchParams
  const activities = await fetchData({ searchParams })
  const t = await getTranslations('ActivityPage')

  return (
    <main className="container">
      <h1>{t('activity')}</h1>
      <div className="grid gap-6">
        <div className="flex flex-col gap-4 md:flex-row">
          {!searchParams.user && <ViewFilter />}
          <ActivityTypeFilter />
        </div>
        <ActivityList activities={activities} />
      </div>
    </main>
  )
}
