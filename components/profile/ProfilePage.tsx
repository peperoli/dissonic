'use client'

import { useState } from 'react'
import { Button } from '../Button'
import { ConcertsByYear } from './ConcertsByYear'
import { Profile } from '../../types/types'
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
import { useModal } from '../shared/ModalProvider'
import { FriendItem } from './FriendItem'
import { getUniqueObjects } from '@/lib/getUniqueObjects'
import { Edit, Settings, CheckCircleIcon, UserPlusIcon } from 'lucide-react'
import { ConcertStats } from '../concerts/ConcertStats'
import { TopGrid } from './TopGrid'
import { BandItem } from './BandItem'
import { LocationItem } from './LocationItem'
import { StatusBanner } from '../forms/StatusBanner'
import { PieChart } from './PieChart'
import Link from 'next/link'
import { SpeedDial } from '../layout/SpeedDial'
import { useContributionsCount } from '@/hooks/contributions/useContributionsCount'

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

  if (!concerts) return <p className="text-sm text-slate-300">Lade ...</p>

  if (concerts.data.length === 0) {
    return <StatusBanner statusType="info" message="Blyat! Noch keine Konzerte vorhanden." />
  }

  return (
    <>
      {concerts?.data.map(concert => <ConcertCard concert={concert} key={concert.id} />)}
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
  const { data: profile } = useProfile(null, initialProfile.username, initialProfile)
  const { data: friends } = useFriends({ profileId: initialProfile.id })
  const acceptedFriends = friends?.filter(item => !item.pending)
  const { data: bandsSeen } = useBandsSeen(initialProfile.id)
  const { data: contributionsCount } = useContributionsCount({ userId: initialProfile.id })
  const [_, setModal] = useModal()
  const { data: session } = useSession()
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
  const bands = bandsSeen?.map(item => item.band).filter(item => !!item) ?? []
  const uniqueBandsSeen = getUniqueObjects(bandsSeen?.map(item => item.band) ?? [])
  const concertsSeen = getUniqueObjects(bandsSeen?.map(item => item.concert) ?? [])

  return (
    <main className="container grid gap-4">
      {profile ? (
        <>
          <section className="mb-6 flex flex-wrap items-center gap-4">
            <UserItem
              user={profile}
              description={isOwnProfile ? session?.user.email : ''}
              size="lg"
            />
            {isFriend && (
              <p className="flex gap-2 text-slate-300">
                <CheckCircleIcon className="size-icon" />
                Freund
              </p>
            )}
            {!isFriend && session?.user.id !== profile.id && (
              <Button
                onClick={() => setModal('add-friend')}
                label="Freund hinzufügen"
                contentType="icon"
                icon={<UserPlusIcon className="size-icon" />}
                disabled={!!isPending}
              />
            )}
            {isOwnProfile && (
              <div className="ml-auto flex gap-2">
                <Button
                  label="Profil bearbeiten"
                  onClick={() => setModal('edit-profile')}
                  icon={<Edit className="size-icon" />}
                  contentType="icon"
                  size="small"
                  appearance="tertiary"
                />
                <Link
                  href="/settings"
                  aria-label="Einstellungen"
                  className="btn btn-icon btn-small btn-tertiary"
                >
                  <Settings className="size-icon" />
                </Link>
              </div>
            )}
          </section>
          <Score uniqueBandsSeen={uniqueBandsSeen} concertsSeen={concertsSeen} />
          <Tab.Group as="section">
            <Tab.List as="nav" className="mb-4 rounded-lg bg-slate-700 px-3">
              {['Statistik', 'Konzerte', 'Freunde'].map(item => (
                <Tab className="relative rounded p-3" key={item}>
                  {({ selected }) => (
                    <>
                      {item}
                      <span
                        className={clsx(
                          'absolute bottom-0 left-0 h-1 w-full rounded-t',
                          selected ? 'bg-venom' : 'bg-transparent'
                        )}
                      />
                    </>
                  )}
                </Tab>
              ))}
              {!!contributionsCount && (
                <Link href={`/contributions?userId=${profile.id}`} className="relative rounded p-3">
                  Bearbeitungen
                  <span className="absolute bottom-0 left-0 h-1 w-full rounded-t bg-transparent" />
                </Link>
              )}
            </Tab.List>
            <Tab.Panel className="grid gap-4">
              {!bandsSeen && <p className="text-sm text-slate-300">Lade ...</p>}
              {bandsSeen && bandsSeen.length === 0 && (
                <StatusBanner statusType="info" message="Blyat! Noch keine Statistik vorhanden." />
              )}
              {bandsSeen && (
                <TopGrid
                  headline="Top Bands"
                  items={bandsSeen.map(item => item.band).filter(item => !!item)}
                  Item={BandItem}
                />
              )}
              {bandsSeen && bandsSeen.length > 0 && (
                <section className="grid gap-4 rounded-lg bg-slate-800 p-4 md:grid-cols-2 md:p-6">
                  <PieChart
                    data={[
                      {
                        name: 'Konzerte',
                        value: concertsSeen.filter(item => !item.is_festival).length,
                      },
                      {
                        name: 'Festivals',
                        value: concertsSeen.filter(item => item.is_festival).length,
                      },
                    ]}
                  />
                  <PieChart
                    data={[
                      { name: 'Einmal erlebte Bands', value: uniqueBandsSeen.length },
                      {
                        name: 'Mehrfach erlebte Bands',
                        value: bandsSeen?.length - uniqueBandsSeen.length,
                      },
                    ]}
                  />
                </section>
              )}
              {bandsSeen && bandsSeen.length > 0 && uniqueBandsSeen && (
                <ConcertStats bands={bands} uniqueBands={uniqueBandsSeen} />
              )}
              <ConcertsByYear userId={profile.id} />
              {concertsSeen && (
                <TopGrid
                  headline="Top Locations"
                  items={concertsSeen.map(item => item.location).filter(item => !!item)}
                  Item={LocationItem}
                />
              )}
            </Tab.Panel>
            <Tab.Panel className="grid gap-4">
              <ConcertList userId={profile.id} />
            </Tab.Panel>
            <Tab.Panel>
              {acceptedFriends && acceptedFriends.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {acceptedFriends.map(item => (
                    <FriendItem
                      key={item.sender.id + item.receiver.id}
                      friend={item.sender.id === profile.id ? item.receiver : item.sender}
                      profile={profile}
                    />
                  ))}
                </div>
              ) : (
                <StatusBanner
                  statusType="info"
                  message={`${session?.user.id === profile.id ? 'Du hast' : profile.username + ' hat'} noch
                  keine Konzertfreunde :/`}
                />
              )}
            </Tab.Panel>
          </Tab.Group>
        </>
      ) : (
        <div>Bitte melde dich an.</div>
      )}
      <SpeedDial />
    </main>
  )
}
