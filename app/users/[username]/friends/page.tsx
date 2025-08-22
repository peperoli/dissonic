import { StatusBanner } from '@/components/forms/StatusBanner'
import { FriendItem } from '@/components/profile/FriendItem'
import { InviteItem } from '@/components/profile/InviteItem'
import { createClient } from '@/utils/supabase/server'
import { getTranslations } from 'next-intl/server'

async function fetchData(username: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .single()

  if (profileError) {
    throw profileError
  }

  const { data: friends, error: friendsError } = await supabase
    .from('friends')
    .select(
      `*,
      sender:profiles!friends_sender_id_fkey(*),
      receiver:profiles!friends_receiver_id_fkey(*)`
    )
    .or(`sender_id.eq.${profile.id}, receiver_id.eq.${profile.id}`)

  if (friendsError) {
    throw friendsError
  }

  return { user, profile, friends }
}

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const { user, profile, friends } = await fetchData(decodeURIComponent(username))
  const t = await getTranslations('FriendsPage')
  const acceptedFriends = friends.filter(item => !item.pending)
  const isOwnProfile = user?.id === profile.id
  const sentInvites = friends.filter(item => item.pending && item.sender_id === profile.id)
  const receivedInvites = friends.filter(item => item.pending && item.receiver_id === profile.id)

  if (isOwnProfile && !friends) {
    return <StatusBanner statusType="info" message="Du hast noch keine Konzertfreunde :/" />
  }

  if (!isOwnProfile && !acceptedFriends.length) {
    return (
      <StatusBanner statusType="info" message={`${username} hat noch keine Konzertfreunde :/`} />
    )
  }

  return (
    <section className="grid grid-cols-2 gap-4">
      {isOwnProfile && (
        <div className="col-span-full rounded-lg bg-slate-800 p-6">
          <h2 className="sr-only">{t('friendInvites')}</h2>
          <div className="mb-6 grid gap-4">
            <h3>{t('incomingInvites')}</h3>
            {receivedInvites.length > 0 ? (
              receivedInvites.map(item => (
                <InviteItem key={item.sender_id} inviteData={item} type="received" />
              ))
            ) : (
              <p className="text-sm text-slate-300">{t('youHaveNoIncomingInvites')}</p>
            )}
          </div>
          <div className="grid gap-4">
            <h3>{t('outgoingInvites')}</h3>
            {sentInvites.length > 0 ? (
              sentInvites.map(item => (
                <InviteItem key={item.receiver_id} inviteData={item} type="sent" />
              ))
            ) : (
              <p className="text-sm text-slate-300">{t('youHaveNoOutgoingInvites')}</p>
            )}
          </div>
        </div>
      )}
      {acceptedFriends.map(item => (
        <FriendItem
          key={`${item.sender_id}-${item.receiver_id}`}
          friend={item.sender_id === profile.id ? item.receiver : item.sender}
          profileId={profile.id}
        />
      ))}
    </section>
  )
}
