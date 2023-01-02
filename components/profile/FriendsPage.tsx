import React, { FC } from 'react'
import { IFriendsPage } from '../../models/types'
import { PageWrapper } from '../layout/PageWrapper'
import { FriendInvites } from './FriendInvites'
import { FriendItem } from './FriendItem'

export const FriendsPage: FC<IFriendsPage> = ({
  profile,
  friends,
}) => {
  return (
    <PageWrapper>
      <main className="p-4 md:p-8 w-full max-w-2xl">
        <h1>{profile.username}&apos;s Freunde</h1>
        <div className="grid grid-cols-2 gap-4">
          <FriendInvites
            profile={profile}
            friends={friends}
          />
          {friends.filter(item => !item.pending).map(item => (
            <FriendItem
              key={item.sender.id + item.receiver.id}
              friendData={item.sender.id === profile.id ? item.receiver : item.sender}
              profile={profile}
            />
          ))}
        </div>
      </main>
    </PageWrapper>
  )
}
