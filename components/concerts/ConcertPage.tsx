'use client'

import Link from 'next/link'
import { useConcert } from '../../hooks/concerts/useConcert'
import { ConcertContext } from '../../hooks/concerts/useConcertContext'
import { Concert, SpotifyArtist } from '../../types/types'
import { Button } from '../Button'
import { Comments } from './Comments'
import { notFound, usePathname, useRouter } from 'next/navigation'
import { useSession } from '../../hooks/auth/useSession'
import { BandList } from './BandList'
import {
  ArchiveIcon,
  ArchiveRestoreIcon,
  ArrowLeft,
  BadgeCheckIcon,
  BadgeMinus,
  CalendarPlusIcon,
  Edit,
  LinkIcon,
  MapPin,
  Trash,
} from 'lucide-react'
import { useSpotifyArtist } from '@/hooks/spotify/useSpotifyArtist'
import Image from 'next/image'
import clsx from 'clsx'
import { SimpleConcertStats } from './ConcertStats'
import { useModal } from '../shared/ModalProvider'
import { MetaInfo } from '../shared/MetaInfo'
import { SpeedDial } from '../layout/SpeedDial'
import { ConcertCommunity } from './ConcertCommunity'
import { useLocale, useTranslations } from 'next-intl'
import { ShareButton } from '../shared/ShareButton'
import { useArchiveConcert } from '@/hooks/concerts/useArchiveConcert'
import { useRestoreConcert } from '@/hooks/concerts/useRestoreConcert'
import { StatusBanner } from '../forms/StatusBanner'
import { Tooltip } from '../shared/Tooltip'
import { getIcsFile } from '@/lib/getIcsFile'

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
  const { data: spotifyArtist } = useSpotifyArtist(concert?.bands?.[0]?.spotify_artist_id, {
    enabled: !concert?.bands?.[0]?.spotify_artist_images,
  })
  const archiveConcert = useArchiveConcert()
  const restoreConcert = useRestoreConcert()
  const [_, setModal] = useModal()
  const { push } = useRouter()
  const pathname = usePathname()
  const t = useTranslations('ConcertPage')

  if (!concert) {
    notFound()
  }

  const isMod = session?.user_role === 'developer' || session?.user_role === 'moderator'
  const image =
    (concert.bands?.[0]?.spotify_artist_images as SpotifyArtist['images'])?.[0] ||
    spotifyArtist?.images?.[0]
  const isFutureOrToday =
    new Date(concert.date_start).setHours(0) >= new Date().setHours(0, 0, 0, 0)

  return (
    <ConcertContext.Provider value={{ concert }}>
      <main className="container grid gap-4">
        <div className="flex items-center justify-between">
          <Link href={`/${concertQueryState ?? ''}`} className="btn btn-small btn-tertiary">
            <ArrowLeft className="size-icon" />
            {t('concerts')}
          </Link>
          <div className="flex gap-3">
            {concert.is_archived ? (
              <Button
                onClick={() =>
                  session ? restoreConcert.mutate(concert.id) : push(`/login?redirect=${pathname}`)
                }
                label={t('restore')}
                icon={<ArchiveRestoreIcon className="size-icon" />}
                contentType="icon"
                size="small"
                appearance="tertiary"
                loading={restoreConcert.isPending}
              />
            ) : (
              <>
                <ShareButton />
                {isFutureOrToday && (
                  <Button
                    onClick={() => getIcsFile(concert)}
                    label={t('addToCalendar')}
                    icon={<CalendarPlusIcon className="size-icon" />}
                    contentType="icon"
                    size="small"
                    appearance="tertiary"
                  />
                )}
                <Button
                  onClick={
                    session
                      ? () => setModal('edit-concert')
                      : () => push(`/login?redirect=${pathname}`)
                  }
                  label={t('edit')}
                  icon={<Edit className="size-icon" />}
                  contentType="icon"
                  size="small"
                  appearance="tertiary"
                />
                <Button
                  onClick={() =>
                    session
                      ? archiveConcert.mutate(concert.id)
                      : push(`/login?redirect=${pathname}`)
                  }
                  label={t('archive')}
                  icon={<ArchiveIcon className="size-icon" />}
                  contentType="icon"
                  danger
                  size="small"
                  appearance="tertiary"
                  loading={archiveConcert.isPending}
                />
              </>
            )}
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
        {concert.is_archived && (
          <StatusBanner statusType="warning" message={t('concertArchivedBanner')} />
        )}
        <header
          className={clsx(
            'relative aspect-square overflow-hidden rounded-2xl',
            concert.is_festival ? 'bg-purple md:aspect-2/1' : 'bg-venom md:aspect-4/3'
          )}
        >
          {!concert.is_festival && image && (
            <Image src={image.url} alt="" fill unoptimized className="object-cover object-top" />
          )}
          <div
            className={clsx(
              'absolute inset-0 bg-radial-gradient from-transparent to-slate-850',
              !concert.is_festival && image && 'via-transparent'
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
                className="mb-2 justify-self-start rounded-md bg-white px-2 font-bold text-slate-850"
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
          <div className="flex items-baseline gap-2">
            <h2>{t('lineup')}</h2>
            <span className="inline-flex gap-1 text-sm text-slate-300">
              {t('nBands', { count: concert.bands.length })}
              {isMod &&
                (concert.ressource_status === 'complete' ? (
                  <Tooltip content={t('complete')} triggerOnClick>
                    <BadgeCheckIcon className="size-icon text-venom" />
                  </Tooltip>
                ) : concert.ressource_status === 'incomplete_lineup' ? (
                  <Tooltip content={t('incompleteLineup')} triggerOnClick>
                    <BadgeMinus className="size-icon text-yellow" />
                  </Tooltip>
                ) : null)}
            </span>
          </div>
          {concert.bands && (
            <BandList concert={concert} bandListHintPreference={bandListHintPreference} />
          )}
        </section>
        <ConcertCommunity concert={concert} />
        {isFutureOrToday && <ConcertInfo concert={concert} />}
        {concert.bands && <SimpleConcertStats bands={concert.bands} />}
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

function ConcertDate({
  date,
  isFirst,
  contrast,
}: {
  date: Date
  isFirst?: boolean
  contrast?: boolean
}) {
  const locale = useLocale()
  const isCurrentYear = date.getFullYear() === new Date().getFullYear()
  return (
    <div
      className={clsx(
        'relative flex aspect-square w-16 flex-none flex-col items-center justify-center rounded-lg p-2 transition duration-200',
        clsx(
          contrast
            ? isFirst
              ? 'bg-white/20 backdrop-blur-lg group-hover:bg-white/30'
              : 'border border-white/20 backdrop-blur-lg'
            : isFirst
              ? 'bg-slate-700 group-hover:bg-slate-600'
              : 'border border-slate-700'
        )
      )}
    >
      {isCurrentYear ? (
        <>
          <span className="text-2xl font-bold leading-none">
            {date.toLocaleDateString(locale, { day: 'numeric' })}
          </span>
          <span className="text-sm">{date.toLocaleDateString(locale, { month: 'short' })}</span>
        </>
      ) : (
        <>
          <div className="flex gap-1">
            <span className="font-bold">{date.toLocaleDateString(locale, { day: 'numeric' })}</span>
            <span>{date.toLocaleDateString(locale, { month: 'short' })}</span>
          </div>
          <span className="text-sm">{date.getFullYear()}</span>
        </>
      )}
    </div>
  )
}

function ConcertInfo({ concert }: { concert: Concert }) {
  const t = useTranslations('ConcertPage')

  if (!concert.doors_time && !concert.show_time && !concert.source_link) {
    return null
  }

  return (
    <div className="rounded-lg bg-slate-800 p-4 md:p-6">
      <h2 className="sr-only">{t('info')}</h2>
      <div className="flex items-center gap-4">
        <p className="font-bold">
          {t('doorsTime')}{' '}
          <span className="font-normal text-slate-300">
            {concert.doors_time?.slice(0, 5) || '–'}
          </span>
        </p>
        <p className="font-bold">
          {t('showTime')}{' '}
          <span className="font-normal text-slate-300">
            {concert.show_time?.slice(0, 5) || '–'}
          </span>
        </p>
        {concert.source_link && (
          <Link href={concert.source_link} target="_blank" className="btn btn-secondary btn-small ml-auto">
            <LinkIcon className="size-icon" />
            {t('sourceLink')}
          </Link>
        )}
      </div>
    </div>
  )
}
