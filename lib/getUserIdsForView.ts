import { Database } from '@/types/supabase'
import { SupabaseClient } from '@supabase/supabase-js'

export async function getUserIdsForView(supabase: SupabaseClient<Database>, userView: string) {
  if (userView === 'global') {
    return null
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  let userIds

  if (userView === 'user') {
    userIds = [user.id]
  } else if (userView === 'friends') {
    const { data: friends, error: friendsError } = await supabase
      .from('friends')
      .select('sender_id, receiver_id')
      .or(`sender_id.eq.${user.id}, receiver_id.eq.${user.id}`)
      .eq('pending', false)

    if (friendsError) {
      throw friendsError
    }

    userIds = Array.from(
      new Set(friends.map(item => item.sender_id).concat(friends.map(item => item.receiver_id)))
    )
  }

  return userIds
}
