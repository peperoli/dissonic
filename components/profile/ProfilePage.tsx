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
import { ConcertsByYear } from './ConcertsByYear'
import { ConcertsByMonth } from './ConcertsByMonth'
import { AddFriendModal } from './AddFriendModal'
import { Band, Concert, Location, Profile } from '../../types/types'
import { useAvatar } from '../../hooks/profiles/useAvatar'
import { useProfile } from '../../hooks/profiles/useProfile'
import { useFriends } from '../../hooks/profiles/useFriends'
import { useBandsSeen } from '../../hooks/bands/useBandsSeen'
import { useSession } from '../../hooks/auth/useSession'
import { Tab } from '@headlessui/react'
import clsx from 'clsx'
import { useConcerts } from '../../hooks/concerts/useConcerts'
import { ConcertCard } from '../concerts/ConcertCard'
import { Score } from './Score'
import { UserItem } from '../shared/UserItem'

type ConcertListProps = {
  userId: string
}

function ConcertList({ userId }: ConcertListProps) {
  const [size, setSize] = useState(25)
  const { data: concerts, fetchStatus } = useConcerts(undefined, {
    bandsSeenUsers: [userId],
    sort: { sort_by: 'date_start', sort_asc: false },
    size,
  })
  return (
    <>
      {concerts ? (
        concerts.data.map(concert => <ConcertCard concert={concert} key={concert.id} />)
      ) : (
        <p>Loading ...</p>
      )}
      <div className="flex flex-col items-center gap-2">
        <p className="text-sm text-slate-300">
          {concerts?.data.length} von {concerts?.count} Einträgen
        </p>
        {concerts?.data.length !== concerts?.count && (
          <Button
            label="Mehr anzeigen"
            onClick={() => setSize(prev => (prev += 25))}
            loading={fetchStatus === 'fetching'}
            appearance="primary"
          />
        )}
      </div>
    </>
  )
}

type ProfilePageProps = {
  initialProfile: Profile
}

export const ProfilePage = ({ initialProfile }: ProfilePageProps) => {
  const { data: profile } = useProfile(initialProfile.id, null, initialProfile)
  const { data: friends } = useFriends({ profileId: initialProfile.id })
  const { data: bandsSeen } = useBandsSeen(initialProfile.id)
  const [editPassIsOpen, setEditPassIsOpen] = useState(false)
  const [editUsernameIsOpen, setEditUsernameIsOpen] = useState(false)
  const [addFriendIsOpen, setAddFriendIsOpen] = useState(false)
  const { data: session } = useSession()
  const { data: avatarUrl } = useAvatar(profile?.avatar_path)

  function unique(array: ({ id: string | number } | null | undefined)[]): any[] {
    const mapOfObjects = new Map(array.map(item => [item?.id, item]))
    return [...mapOfObjects.values()]
  }

  const isOwnProfile = session?.user.id === profile?.id
  const isFriend =
    isOwnProfile === false &&
    friends?.find(
      item =>
        item.pending === false &&
        (item.sender.id === session?.user.id || item.receiver.id === session?.user.id)
    ) != undefined
  const isPending = friends?.find(
    item =>
      item.pending && (item.sender.id === session?.user.id || item.receiver.id === session?.user.id)
  )
  const bands = (bandsSeen?.map(item => item.band) as Band[]) ?? []
  const uniqueBandsSeen: Band[] = bandsSeen ? unique(bandsSeen.map(item => item.band)) : []
  const concertsSeen: Concert[] = bandsSeen ? unique(bandsSeen.map(item => item.concert)) : []
  const festivalsSeen: Concert[] = bandsSeen
    ? unique(bandsSeen.filter(item => item.concert?.is_festival).map(item => item.concert))
    : []
  return (
    <PageWrapper>
      <>
        <main className="container">
          {profile ? (
            <div>
              <div className="mb-6 flex flex-wrap items-center gap-4">
                <UserItem user={profile} size="lg" />
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
              <div className="mb-6 grid gap-4 md:grid-cols-2">
                <Score
                  uniqueBandsSeen={uniqueBandsSeen}
                  bandsSeen={bands}
                  concertsSeen={concertsSeen}
                  festivalsSeen={festivalsSeen}
                />
                <Tab.Group as="section" className="col-span-full">
                  <Tab.List className="mb-4 rounded-lg bg-slate-700 px-3">
                    {['Statistik', 'Konzerte'].map(item => (
                      <Tab className="rounded px-3" key={item}>
                        {({ selected }) => (
                          <span
                            className={clsx(
                              'block border-b-2 py-3',
                              selected ? 'border-venom' : 'border-transparent text-slate-300'
                            )}
                          >
                            {item}
                          </span>
                        )}
                      </Tab>
                    ))}
                  </Tab.List>
                  <Tab.Panel className="grid grid-cols-3 gap-4">
                    {bandsSeen && (
                      <TopBands
                        bands={
                          bandsSeen
                            .filter(item => item.band != undefined)
                            .map(item => item.band) as Band[]
                        }
                      />
                    )}
                    {bandsSeen && uniqueBandsSeen && (
                      <div className="col-span-full rounded-lg bg-slate-800 p-6">
                        <GenreChart
                          bands={bands}
                          uniqueBands={uniqueBandsSeen}
                          profile={isOwnProfile ? null : profile}
                        />
                      </div>
                    )}
                    {concertsSeen && (
                      <div className="col-span-full rounded-lg bg-slate-800 p-6">
                        <ConcertsByYear concerts={concertsSeen} />
                      </div>
                    )}
                    {concertsSeen && (
                      <div className="col-span-full rounded-lg bg-slate-800 p-6">
                        <ConcertsByMonth concerts={concertsSeen} />
                      </div>
                    )}
                    {concertsSeen && (
                      <TopLocations
                        locations={
                          concertsSeen
                            .filter(item => item.location != undefined)
                            .map(item => item.location) as Location[]
                        }
                        username={profile.username}
                      />
                    )}
                  </Tab.Panel>
                  <Tab.Panel className="grid gap-4">
                    <ConcertList userId={profile.id} />
                  </Tab.Panel>
                </Tab.Group>
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
