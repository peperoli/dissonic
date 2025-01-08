'use client'

import Link from 'next/link'
import { useConcert } from '../../hooks/concerts/useConcert'
import { ConcertContext } from '../../hooks/concerts/useConcertContext'
import { Concert } from '../../types/types'
import { Button } from '../Button'
import { Comments } from './Comments'
import { notFound, usePathname, useRouter } from 'next/navigation'
import { useSession } from '../../hooks/auth/useSession'
import { BandList } from './BandList'
import { ArrowLeft, Edit, MapPin, Trash } from 'lucide-react'
import { useSpotifyArtist } from '@/hooks/spotify/useSpotifyArtist'
import Image from 'next/image'
import { ConcertDate } from './ConcertDate'
import clsx from 'clsx'
import { ConcertStats } from './ConcertStats'
import { useModal } from '../shared/ModalProvider'
import { MetaInfo } from '../shared/MetaInfo'
import { SpeedDial } from '../layout/SpeedDial'
import { ConcertCommunity } from './ConcertCommunity'
import { useTranslations } from 'next-intl'
import { ShareButton } from '../shared/ShareButton'

type ConcertPageProps = {
  initialConcert: Concert
  concertQueryState?: string
  bandListHintPreference?: string
}

export const ConcertPage = ({
  initialConcert,
  concertQueryState,
  bandListHintPreference,
}: ConcertPageProps) => {
  const { data: concert } = useConcert(initialConcert.id, { placeholderData: initialConcert })
  const { data: session } = useSession()
  const { data: spotifyArtist } = useSpotifyArtist(concert?.bands?.[0]?.spotify_artist_id)
  const [_, setModal] = useModal()
  const { push } = useRouter()
  const pathname = usePathname()
  const t = useTranslations('ConcertPage')
  const isMod = session?.user_role === 'developer' || session?.user_role === 'moderator'

  if (!concert) {
    notFound()
  }

  return (
    <ConcertContext.Provider value={{ concert }}>
      <main className="container grid gap-4">
        <div className="flex items-center justify-between">
          <Link href={`/${concertQueryState ?? ''}`} className="btn btn-small btn-tertiary">
            <ArrowLeft className="size-icon" />
            {t('concerts')}
          </Link>
          <div className="flex gap-3">
            <ShareButton />
            <Button
              onClick={
                session ? () => setModal('edit-concert') : () => push(`/login?redirect=${pathname}`)
              }
              label={t('edit')}
              icon={<Edit className="size-icon" />}
              contentType="icon"
              size="small"
              appearance="tertiary"
            />
            {isMod && (
              <Button
                onClick={() => setModal('delete-concert')}
                label={t('delete')}
                icon={<Trash className="size-icon" />}
                contentType="icon"
                danger
                size="small"
                appearance="tertiary"
              />
            )}
          </div>
        </div>
        <header
          className={clsx(
            'relative aspect-square overflow-hidden rounded-2xl',
            concert.is_festival ? 'bg-purple md:aspect-2/1' : 'bg-venom md:aspect-4/3'
          )}
        >
          {!concert.is_festival && spotifyArtist?.images[0] && (
            <Image src={spotifyArtist.images[0].url} alt="" fill className="object-cover" />
          )}
          <div
            className={clsx(
              'absolute inset-0 bg-radial-gradient from-transparent to-slate-850',
              !concert.is_festival && spotifyArtist?.images[0] && 'via-transparent'
            )}
          />
          <div className="relative grid size-full content-end justify-start p-4 md:p-6">
            <div className="mb-4 flex w-fit items-center">
              <ConcertDate date={new Date(concert.date_start)} isFirst contrast />
              {concert.date_end && concert.date_end !== concert.date_start && (
                <>
                  <div className="w-2 border-t border-white/20 md:w-4" />
                  <ConcertDate date={new Date(concert.date_end)} contrast />
                </>
              )}
            </div>
            {concert.festival_root && (
              <Link
                href={`/?festivals=${concert.festival_root_id}`}
                className="mb-2 justify-self-start rounded-md bg-white px-2 py-1 font-bold text-slate-850"
              >
                Festival
              </Link>
            )}
            {concert.name && <div className="font-bold">{concert.name}</div>}
            <h1 className="mb-2">
              {concert.festival_root
                ? `${concert.festival_root?.name} ${new Date(concert.date_start).getFullYear()}`
                : concert.bands?.[0]?.name}
            </h1>
            <Link
              href={`/locations/${concert.location_id}`}
              className="h2 mb-0 flex items-center gap-3 hover:underline"
            >
              <MapPin className="size-icon text-slate-300" />
              {concert.location?.name}, {concert.location?.city}
            </Link>
          </div>
        </header>
        <section className="rounded-lg bg-slate-800 p-4 md:p-6">
          <h2>{t('lineup')}</h2>
          {concert.bands && (
            <BandList concert={concert} bandListHintPreference={bandListHintPreference} />
          )}
        </section>
        <ConcertCommunity concert={concert} />
        {concert.bands && <ConcertStats bands={concert.bands} />}
        <div className="rounded-lg bg-slate-800 p-4 md:p-6">
          <Comments />
        </div>
        <MetaInfo
          createdAt={concert.created_at}
          creator={concert.creator}
          ressourceType="concerts"
          ressourceId={concert.id}
        />
        <SpeedDial />
      </main>
    </ConcertContext.Provider>
  )
}
