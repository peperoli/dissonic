import { Button } from '../Button'
import { AlertTriangle, ChevronDown, TentIcon } from 'lucide-react'
import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import { Band, Concert, ExtendedRes, FestivalRoot, Location } from '@/types/types'
import { BandItem } from '../bands/BandItem'
import { ConcertItem } from '../concerts/ConcertItem'
import { LocationItem } from '../locations/LocationItem'
import { BandRecord } from '@/types/algolia'

export function SimilarItemsWarning({
  itemType,
  similarItems,
  similarItemsSize,
  setSimilarItemsSize,
}: {
  similarItemsSize: number
  setSimilarItemsSize: (size: number) => void
} & (
  | { itemType: 'concerts'; similarItems: ExtendedRes<Concert[]> }
  | { itemType: 'bands'; similarItems: ExtendedRes<BandRecord[]> }
  | { itemType: 'locations'; similarItems: ExtendedRes<Location[]> }
  | { itemType: 'festivalRoots'; similarItems: ExtendedRes<FestivalRoot[]> }
)) {
  const t = useTranslations('SimilarItemsWarning')
  return (
    <div className="rounded-lg bg-yellow/10 p-4">
      <div className="flex items-center gap-4 text-yellow">
        <AlertTriangle className="size-icon flex-none" />
        {itemType === 'concerts' ? (
          <p>{t('similarConcertsWarning', { count: similarItems.count })}</p>
        ) : itemType === 'bands' ? (
          <p>{t('similarBandsWarning', { count: similarItems.count })}</p>
        ) : itemType === 'locations' ? (
          <p>{t('similarLocationsWarning', { count: similarItems.count })}</p>
        ) : itemType === 'festivalRoots' ? (
          <p>{t('similarFestivalRootsWarning', { count: similarItems.count })}</p>
        ) : null}
      </div>
      <ul className="mt-4 grid">
        {itemType === 'concerts' ? (
          similarItems.data.map(item => (
            <li key={item.id}>
              <ConcertItem concert={item} />
            </li>
          ))
        ) : itemType === 'bands' ? (
          <>
            {similarItems.data.map(item => (
              <li key={item.id}>
                <BandItem
                  band={
                    {
                      id: item.id,
                      name: item.name,
                      country: item.country,
                      genres: item.genres,
                      spotify_artist_id: item.spotify_artist_id,
                      spotify_artist_images: item.spotify_artist_images,
                    } as Band
                  }
                />
              </li>
            ))}
          </>
        ) : itemType === 'locations' ? (
          similarItems.data.map(item => (
            <li key={item.id}>
              <LocationItem location={item} />
            </li>
          ))
        ) : itemType === 'festivalRoots' ? (
          similarItems.data.map(item => (
            <li key={item.id}>
              <FestivalRootItem festivalRoot={item} />
            </li>
          ))
        ) : null}
        {similarItems.count && similarItems.count > 3 && (
          <Button
            label={similarItemsSize === 3 ? t('showAll') : t('showLess')}
            onClick={() => setSimilarItemsSize(similarItemsSize === 3 ? similarItems.count! : 3)}
            icon={
              <ChevronDown className={clsx('size-icon', similarItemsSize !== 3 && 'rotate-180')} />
            }
            appearance="tertiary"
            size="small"
          />
        )}
      </ul>
    </div>
  )
}

function FestivalRootItem({ festivalRoot }: { festivalRoot: FestivalRoot }) {
  return (
    <div className="flex gap-4 rounded-lg p-2 text-left">
      <div className="relative grid h-11 w-11 flex-none place-content-center rounded-lg bg-slate-750">
        <TentIcon className="size-icon text-slate-300" />
      </div>
      <div className="grid">
        <div className="truncate">{festivalRoot.name}</div>
        <div className="text-sm text-slate-300">{festivalRoot.default_location?.name}</div>
      </div>
    </div>
  )
}
