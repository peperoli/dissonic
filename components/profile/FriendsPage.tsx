'use client'

import { Friend, Profile } from '../../types/types'
import { PageWrapper } from '../layout/PageWrapper'
import { FriendInvites } from './FriendInvites'
import { FriendItem } from './FriendItem'
import { useFriends } from '../../hooks/profiles/useFriends'
import { useSession } from '../../hooks/auth/useSession'
import { Button } from '../Button'
import { useRouter, usePathname } from 'next/navigation'

export interface FriendsPageProps {
  profile: Profile
  initialFriends: Friend[]
}

export const FriendsPage = ({ profile, initialFriends }: FriendsPageProps) => {
  const { data: session } = useSession()
  const { data: friends } = useFriends({ profileId: profile.id }, initialFriends)
  const acceptedFriends = friends?.filter(item => !item.pending)
  const { push } = useRouter()
  const pathname = usePathname()
  return (
    <PageWrapper>
      <main className="container">
        <h1>{profile.username}s Freunde</h1>
        {session ? (
          <div className="grid grid-cols-2 gap-4">
            {session.user.id === profile.id && friends && (
              <FriendInvites profile={profile} friends={friends} />
            )}
            {acceptedFriends && acceptedFriends.length > 0 ? (
              acceptedFriends.map(item => (
                <FriendItem
                  key={item.sender.id + item.receiver.id}
                  friend={item.sender.id === profile.id ? item.receiver : item.sender}
                  profile={profile}
                />
              ))
            ) : (
              <p className="col-span-full text-slate-300">
                {session?.user.id === profile.id ? 'Du hast' : `${profile.username} hat`} noch keine
                Konzertfreunde :/
              </p>
            )}
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-300 mb-4">
              Melde dich an, um {profile.username}s Freunde zu sehen.
            </p>
            <Button
              label="Anmelden"
              onClick={() => push(`/login?redirect=${pathname}`)}
              appearance="primary"
            />
          </>
        )}
      </main>
    </PageWrapper>
  )
}
