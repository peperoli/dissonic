import React, { FC } from 'react'
import { IFriendsPage } from '../../models/types'
import { PageWrapper } from '../layout/PageWrapper'
import { FriendInvites } from './FriendInvites'
import { FriendItem } from './FriendItem'

export const FriendsPage: FC<IFriendsPage> = ({
  profile,
  sentInvites,
  receivedInvites,
  friends,
}) => {
  return (
    <PageWrapper>
      <main className="p-4 md:p-8 w-full max-w-2xl">
        <h1>{profile.username}&apos;s Freunde</h1>
        <div className="grid grid-cols-2 gap-4">
          <FriendInvites
            profile={profile}
            sentInvites={sentInvites || []}
            receivedInvites={receivedInvites || []}
          />
          {friends.map(item => (
            <FriendItem
              key={item.user1.id + item.user2.id}
              friend={item.user1.id === profile.id ? item.user2 : item.user1}
            />
          ))}
        </div>
      </main>
    </PageWrapper>
  )
}
