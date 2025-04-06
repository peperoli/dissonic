import { Database } from '@/types/supabase'
import { ActivityFetchOptions, ExtendedRes, QueryOptions } from '@/types/types'
import supabase from '@/utils/supabase/client'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ActivityItemT } from 'app/activity/page'

async function fetchActivities(options: ActivityFetchOptions) {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  let query = supabase.from('activities').select('*', { count: 'estimated' })

  if (options.activityType && options.activityType !== 'all') {
    query = query.eq('type', options.activityType)
  }

  if (options.user) {
    query = query.contains('user_id', options.user.split(','))
  }

  if ((!options.view || options.view === 'friends') && !options.user && session?.user) {
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
  } else if (options.view === 'user' && session?.user) {
    query = query.contains('user_id', [session.user.id])
  }

  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .limit(options.size ? options.size : 50)

  if (error) {
    throw error
  }

  return { data, count }
}

export function useActivities(
  options: ActivityFetchOptions & QueryOptions<ExtendedRes<ActivityItemT[]>>
) {
  const { enabled, placeholderData, ...fetchOptions } = options
  return useQuery({
    queryKey: ['activities', JSON.stringify(fetchOptions)],
    queryFn: () => fetchActivities(options),
    enabled: enabled !== false,
    placeholderData: previousData => keepPreviousData(previousData || placeholderData),
  })
}
