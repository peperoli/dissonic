import { useSpotifyArtist } from "@/hooks/spotify/useSpotifyArtist"
import { ItemCount } from "@/lib/getCounts"
import { Band } from "@/types/types"
import Image from "next/legacy/image"
import Link from "next/link"
import { UserMusicIcon } from "../layout/UserMusicIcon"

type BandItemProps = {
  topItem: ItemCount & Band
}

export const BandItem = ({ topItem }: BandItemProps) => {
  const { data } = useSpotifyArtist(topItem.spotify_artist_id)
  const picture = data?.images[1]
  return (
    <Link href={`/bands/${topItem.id}`} className="block">
      <div className="relative flex aspect-square flex-shrink-0 items-center justify-center rounded-2xl bg-slate-750">
        {picture ? (
          <Image
            src={picture.url}
            alt={topItem.name}
            layout="fill"
            objectFit="cover"
            placeholder="blur"
            blurDataURL={data?.images[2].url}
            className="rounded-2xl"
          />
        ) : (
          <UserMusicIcon className="h-8 text-slate-300" />
        )}
      </div>
      <div className="mt-2 overflow-hidden">
        <h3 className="mb-0 truncate whitespace-nowrap text-base">{topItem.name}</h3>
        <div className="text-slate-300 text-sm">{topItem.count} Konzerte</div>
      </div>
    </Link>
  )
}