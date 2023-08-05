'use client'

import { PageWrapper } from '../layout/PageWrapper'
import { useState } from 'react'
import { Button } from '../Button'
import { EditPasswordForm } from './EditPasswordForm'
import { EditProfileForm } from './EditProfileForm'
import { GenreChart } from '../concerts/GenreChart'
import Image from 'next/image'
import { CheckCircleIcon, UserIcon, UserPlusIcon } from '@heroicons/react/20/solid'
import { TopBands } from './TopBands'
import { TopLocations } from './TopLocations'
import { ConcertsChart } from './ConcertsChart'
import { AddFriendModal } from './AddFriendModal'
import { Band, Concert, Location, Profile } from '../../types/types'
import { useAvatar } from '../../hooks/useAvatar'
import { useProfile } from '../../hooks/useProfile'
import { useFriends } from '../../hooks/useFriends'
import { useBandsSeen } from '../../hooks/useBandsSeen'
import { useSession } from '../../hooks/useSession'

interface IProfilePage {
  initialProfile: Profile
}

export const ProfilePage = ({ initialProfile }: IProfilePage) => {
  const { data: profile } = useProfile(initialProfile.id, initialProfile)
  const { data: friends } = useFriends(initialProfile.id)
  const { data: bandsSeen } = useBandsSeen(initialProfile.id)
  const [editPassIsOpen, setEditPassIsOpen] = useState(false)
  const [editUsernameIsOpen, setEditUsernameIsOpen] = useState(false)
  const [addFriendIsOpen, setAddFriendIsOpen] = useState(false)
  const { data: session } = useSession()
  const { data: avatarUrl } = useAvatar(profile?.avatar_path)

  function unique(array: ({ id: string | number } | undefined)[]): any[] {
    const mapOfObjects = new Map(array.map(item => [item?.id, item]))
    return [...mapOfObjects.values()]
  }
  const isOwnProfile = session?.user.id === profile?.id
  const isFriend =
    isOwnProfile === false &&
    friends?.find(
      item =>
        item.pending === false && (item.sender.id === session?.user.id || item.receiver.id === session?.user.id)
    ) != undefined
  const isPending = friends?.find(
    item => item.pending && (item.sender.id === session?.user.id || item.receiver.id === session?.user.id)
  )
  const uniqueBandsSeen: Band[] = bandsSeen ? unique(bandsSeen.map(item => item.band)) : []
  const concertsSeen: Concert[] = bandsSeen ? unique(bandsSeen.map(item => item.concert)) : []
  const festivalsSeen: Concert[] = bandsSeen
    ? unique(bandsSeen.filter(item => item.concert?.is_festival).map(item => item.concert))
    : []
  return (
    <PageWrapper>
      <>
        <main className="p-4 md:p-8 w-full max-w-2xl">
          {profile ? (
            <div>
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="relative flex-shrink-0 flex justify-center items-center w-16 h-16 rounded-full text-lg text-slate-850 bg-blue-300">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt="Profile picture"
                      fill={true}
                      className="object-cover rounded-full"
                    />
                  ) : (
                    <UserIcon className="h-icon" />
                  )}
                </div>
                <h1 className="mb-0">{profile.username}</h1>
                {isFriend && (
                  <p className="flex gap-2 text-slate-300">
                    <CheckCircleIcon className="h-icon" />
                    Freund
                  </p>
                )}
                {!isFriend && session?.user.id !== profile.id && (
                  <Button
                    onClick={() => setAddFriendIsOpen(true)}
                    label="Freund hinzufügen"
                    contentType="icon"
                    icon={<UserPlusIcon className="h-icon" />}
                    disabled={!!isPending}
                  />
                )}
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-6 rounded-lg bg-slate-800">
                  <p className="mb-0 text-2xl text-venom">{uniqueBandsSeen?.length}</p>
                  <h2 className="text-sm font-normal mb-0">Bands live erlebt</h2>
                </div>
                <div className="p-6 rounded-lg bg-slate-800">
                  <p className="mb-0 text-2xl text-venom">{concertsSeen?.length}</p>
                  <h2 className="text-sm font-normal mb-0">Konzerte besucht</h2>
                </div>
                <div className="p-6 rounded-lg bg-slate-800">
                  <p className="mb-0 text-2xl text-venom">{festivalsSeen?.length}</p>
                  <h2 className="text-sm font-normal mb-0">Festivals besucht</h2>
                </div>
                {bandsSeen && (
                  <TopBands
                    bands={
                      bandsSeen
                        .filter(item => item.band != undefined)
                        .map(item => item.band) as Band[]
                    }
                  />
                )}
                {uniqueBandsSeen && (
                  <div className="col-span-full p-6 rounded-lg bg-slate-800">
                    <GenreChart bands={uniqueBandsSeen} />
                  </div>
                )}
                {concertsSeen && (
                  <div className="col-span-full p-6 rounded-lg bg-slate-800">
                    <ConcertsChart concerts={concertsSeen} />
                  </div>
                )}
                {concertsSeen && (
                  <TopLocations
                    locations={
                      concertsSeen
                        .filter(item => item.location != undefined)
                        .map(item => item.location) as Location[]
                    }
                  />
                )}
              </div>
              {isOwnProfile && (
                <div className="flex gap-3">
                  <Button label="Profil bearbeiten" onClick={() => setEditUsernameIsOpen(true)} />
                  <Button label="Passwort ändern" onClick={() => setEditPassIsOpen(true)} />
                </div>
              )}
            </div>
          ) : (
            <div>Bitte melde dich an.</div>
          )}
        </main>
        {profile && (
          <EditProfileForm
            profile={profile}
            isOpen={editUsernameIsOpen}
            setIsOpen={setEditUsernameIsOpen}
          />
        )}
        <EditPasswordForm isOpen={editPassIsOpen} setIsOpen={setEditPassIsOpen} />
        {session && profile && (
          <AddFriendModal
            isOpen={addFriendIsOpen}
            setIsOpen={setAddFriendIsOpen}
            user={session.user}
            profile={profile}
          />
        )}
      </>
    </PageWrapper>
  )
}
