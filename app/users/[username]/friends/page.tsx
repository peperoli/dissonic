import { FriendsPage } from '../../../../components/profile/FriendsPage'
import supabase from '../../../../utils/supabase'

export const revalidate = 0

async function fetchData(username: string) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  const { data: sentInvites } = await supabase
    .from('friend_invites')
    .select('sender:sender_id(*), receiver:receiver_id(*), created_at')
    .eq('sender_id', profile.id)

  const { data: receivedInvites } = await supabase
    .from('friend_invites')
    .select('sender:sender_id(*), receiver:receiver_id(*), created_at')
    .eq('receiver_id', profile.id)

  const {data: friends, error } = await supabase
  .from('friends')
  .select('user1:user1_id(*), user2:user2_id(*), created_at')
  .or(`user1_id.eq.${profile.id}, user2_id.eq.${profile.id}`)

  if (error) {
    console.error(error)
  }
  
  return { profile, sentInvites, receivedInvites, friends }
}

export default async function Page({ params }: { params: { username: string } }) {
  const { profile, sentInvites, receivedInvites, friends } = await fetchData(params.username)
  return (
    <FriendsPage
      profile={profile}
      sentInvites={sentInvites || []}
      receivedInvites={receivedInvites || []}
      friends={friends || []}
    />
  )
}
