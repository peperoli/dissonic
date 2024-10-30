import { StatusBanner } from '@/components/forms/StatusBanner'
import { FriendItem } from '@/components/profile/FriendItem'
import { InviteItem } from '@/components/profile/InviteItem'
import { Friend } from '@/types/types'
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

const FriendInvites = ({ profileId, friends }: { profileId: string; friends: Friend[] }) => {
  const sentInvites = friends.filter(item => item.pending && item.sender_id === profileId)
  const receivedInvites = friends.filter(item => item.pending && item.receiver_id === profileId)
  return (
    <div className="col-span-full rounded-lg bg-slate-800 p-6">
      <h2 className="sr-only">Freundschaftsanfragen</h2>
      <div className="mb-6 grid gap-4">
        <h3>Empfangene Anfragen</h3>
        {receivedInvites.length > 0 ? (
          receivedInvites.map(item => (
            <InviteItem key={item.sender_id} inviteData={item} type="received" />
          ))
        ) : (
          <p className="text-sm text-slate-300">Du hast keine ausstehende Anfragen.</p>
        )}
      </div>
      <div className="grid gap-4">
        <h3>Gesendete Anfragen</h3>
        {sentInvites.length > 0 ? (
          sentInvites.map(item => (
            <InviteItem key={item.receiver_id} inviteData={item} type="sent" />
          ))
        ) : (
          <p className="text-sm text-slate-300">Du hast keine ausstehende Anfragen.</p>
        )}
      </div>
    </div>
  )
}

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const { user, profile, friends } = await fetchData(username)
  const acceptedFriends = friends?.filter(item => !item.pending)
  const isOwnProfile = user?.id === profile.id

  if (isOwnProfile && !friends) {
    return <StatusBanner statusType="info" message="Du hast noch keine Konzertfreunde :/" />
  }

  if (!isOwnProfile && !acceptedFriends?.length) {
    return (
      <StatusBanner statusType="info" message={`${username} hat noch keine Konzertfreunde :/`} />
    )
  }

  return (
    <section className="grid grid-cols-2 gap-4">
      {isOwnProfile && <FriendInvites profileId={profile.id} friends={friends!} />}
      {acceptedFriends?.map(item => (
        <FriendItem
          key={`${item.sender_id}-${item.receiver_id}`}
          friend={item.sender_id === profile.id ? item.receiver : item.sender}
          profileId={profile.id}
        />
      ))}
    </section>
  )
}
