import { StatusBanner } from '@/components/forms/StatusBanner'
import { FriendItem } from '@/components/profile/FriendItem'
import { createClient } from '@/utils/supabase/server'

async function fetchData(username: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .single()

  if (error) {
    throw error
  }

  const { data: friends } = await supabase
    .from('friends')
    .select(
      `*,
      sender:profiles!friends_sender_id_fkey(*),
      receiver:profiles!friends_receiver_id_fkey(*)`
    )
    .or(`sender_id.eq.${profile.id}, receiver_id.eq.${profile.id}`)

  return { user, profile, friends }
}

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const { user, profile, friends } = await fetchData(username)
  const acceptedFriends = friends?.filter(item => !item.pending)
  const isOwnProfile = user?.id === profile.id

  if (!acceptedFriends || acceptedFriends.length === 0) {
    return (
      <StatusBanner
        statusType="info"
        message={`${isOwnProfile ? 'Du hast' : username + ' hat'} noch keine Konzertfreunde :/`}
      />
    )
  }

  return (
    <section>
      <div className="grid grid-cols-2 gap-4">
        {acceptedFriends.map(item => (
          <FriendItem
            key={`${item.sender_id}-${item.receiver_id}`}
            friend={item.sender_id === profile.id ? item.receiver : item.sender}
            profileId={profile.id}
          />
        ))}
      </div>
    </section>
  )
}
