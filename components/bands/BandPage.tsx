'use client'

import Link from 'next/link'
import { Fragment } from 'react'
import { Button } from '../Button'
import { Band } from '../../types/types'
import { useBand } from '../../hooks/bands/useBand'
import { notFound, usePathname, useRouter } from 'next/navigation'
import { useSession } from '../../hooks/auth/useSession'
import { useModal } from '../shared/ModalProvider'
import {
  ArchiveIcon,
  ArchiveRestoreIcon,
  ArrowLeft,
  Edit,
  Guitar,
  MapPin,
  MusicIcon,
  Trash,
} from 'lucide-react'
import Image from 'next/image'
import { useSpotifyArtist } from '@/hooks/spotify/useSpotifyArtist'
import { MetaInfo } from '../shared/MetaInfo'
import { SpeedDial } from '../layout/SpeedDial'
import { BandCommunity } from './BandCommunity'
import { useLocale, useTranslations } from 'next-intl'
import clsx from 'clsx'
import { ConcertList } from '../profile/ConcertList'
import { useConcertsCount } from '@/hooks/concerts/useConcertsCount'
import { ShareButton } from '../shared/ShareButton'
import { useArchiveBand } from '@/hooks/bands/useArchiveBand'
import { useRestoreBand } from '@/hooks/bands/useRestoreBand'
import { StatusBanner } from '../forms/StatusBanner'

type BandPageProps = {
  initialBand: Band
  bandQueryState?: string
}

export const BandPage = ({ initialBand, bandQueryState }: BandPageProps) => {
  const { data: band } = useBand(initialBand.id, initialBand)
  const { data: spotifyArtist } = useSpotifyArtist(band?.spotify_artist_id)
  const { data: concertsCount } = useConcertsCount({ bands: [initialBand.id] })
  const archiveBand = useArchiveBand()
  const restoreBand = useRestoreBand()
  const [_, setModal] = useModal()
  const { data: session } = useSession()
  const { push } = useRouter()
  const pathname = usePathname()
  const t = useTranslations('BandPage')
  const locale = useLocale()
  const isMod = session?.user_role === 'developer' || session?.user_role === 'moderator'
  const regionNames = new Intl.DisplayNames(locale, { type: 'region' })

  if (!band) {
    notFound()
  }
  return (
    <main className="container grid gap-4">
      <div className="flex items-center justify-between">
        <Link href={`/bands${bandQueryState ?? ''}`} className="btn btn-small btn-tertiary">
          <ArrowLeft className="size-icon" />
          {t('bands')}
        </Link>
        <div className="flex gap-3">
          {band.is_archived ? (
            <Button
              onClick={() =>
                session ? restoreBand.mutate(band.id) : push(`/login?redirect=${pathname}`)
              }
              label={t('restore')}
              icon={<ArchiveRestoreIcon className="size-icon" />}
              contentType="icon"
              size="small"
              appearance="tertiary"
              loading={restoreBand.isPending}
            />
          ) : (
            <>
              <ShareButton />
              <Button
                onClick={
                  session ? () => setModal('edit-band') : () => push(`/login?redirect=${pathname}`)
                }
                label={t('edit')}
                icon={<Edit className="size-icon" />}
                contentType="icon"
                size="small"
                appearance="tertiary"
              />
              <Button
                onClick={() =>
                  session ? archiveBand.mutate(band.id) : push(`/login?redirect=${pathname}`)
                }
                label={t('archive')}
                icon={<ArchiveIcon className="size-icon" />}
                contentType="icon"
                danger
                size="small"
                appearance="tertiary"
                loading={archiveBand.isPending}
              />
            </>
          )}
          {isMod && (
            <Button
              onClick={() => setModal('delete-band')}
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
      {band.is_archived && <StatusBanner statusType="warning" message={t('bandArchivedBanner')} />}
      <header className="flex flex-col gap-5 rounded-2xl bg-radial-gradient from-blue/20 p-6 md:flex-row">
        <div className="relative grid aspect-square w-full flex-none place-content-center rounded-lg bg-slate-750 md:w-56">
          {spotifyArtist?.images[0] ? (
            <Image
              src={spotifyArtist.images[0].url}
              alt={band.name}
              fill
              className="rounded-lg object-cover"
            />
          ) : (
            <Guitar className="size-12 text-slate-300" />
          )}
        </div>
        <div>
          <h1 className={clsx(band.alt_names && 'mb-0')}>{band.name}</h1>
          {band.alt_names && (
            <p className="mb-6 text-sm text-slate-300">
              {t('altNames')}: {band.alt_names}
            </p>
          )}
          {band.country && (
            <div className="mb-2 flex items-center gap-4">
              <MapPin className="size-icon flex-none text-slate-300" />
              {regionNames.of(band.country.iso2)}
            </div>
          )}
          {band.genres.length > 0 && (
            <div className="mb-5 flex items-center gap-4">
              <MusicIcon className="size-icon flex-none text-slate-300" />
              <ul className="flex flex-wrap gap-x-2">
                {band.genres.map((genre, index) => (
                  <Fragment key={index}>
                    <li>
                      <Link href={`/bands?genres=${genre.id}`} className="hover:underline">
                        {genre.name}
                      </Link>
                    </li>
                    {index + 1 !== band.genres?.length && <span>&bull;</span>}
                  </Fragment>
                ))}
              </ul>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {band.youtube_url && (
              <Link href={band.youtube_url} target="_blank" className="btn btn-small btn-secondary">
                YouTube
              </Link>
            )}
            {spotifyArtist && (
              <Link
                href={spotifyArtist.external_urls.spotify}
                target="_blank"
                className="btn btn-small btn-secondary"
              >
                Spotify
              </Link>
            )}
          </div>
        </div>
      </header>
      <BandCommunity band={band} />
      {!!concertsCount && (
        <section className="grid gap-4 rounded-lg bg-slate-800 p-4 md:p-6">
          <h2 className="mb-0">{t('nConcertsWithX', { count: concertsCount, band: band.name })}</h2>
          <ConcertList bandId={band.id} nested />
        </section>
      )}
      <MetaInfo
        createdAt={band.created_at}
        creator={band.creator}
        ressourceType="bands"
        ressourceId={band.id}
      />
      <SpeedDial />
    </main>
  )
}
