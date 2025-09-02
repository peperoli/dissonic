import { useMemories } from '@/hooks/concerts/useMemories'
import { getCloudflareImageUrl, getCloudflareThumbnailUrl } from '@/lib/cloudflareHelpers'
import Image from 'next/image'
import * as Dialog from '@radix-ui/react-dialog'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { XIcon } from 'lucide-react'
import { Memory } from '@/types/types'
import { UserItem } from '../shared/UserItem'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'
import { VideoPlayer } from '../shared/VideoPlayer'

async function fetchMemoriesCount(concertId: number, fileType?: 'image/' | 'video/') {
  let query = supabase.from('memories').select('id', { count: 'exact' }).eq('concert_id', concertId)

  if (fileType) {
    query = query.like('file_type', `%${fileType}%`)
  }

  const { count, error } = await query

  if (error) {
    throw error
  }

  return count
}

export function ConcertMemories({ concertId }: { concertId: number }) {
  const { data: memories } = useMemories({ concertId, size: 4 })
  const { data: imageMemoriesCount } = useQuery({
    queryKey: ['image-memories-count', concertId],
    queryFn: () => fetchMemoriesCount(concertId, 'image/'),
  })
  const { data: videoMemoriesCount } = useQuery({
    queryKey: ['video-memories-count', concertId],
    queryFn: () => fetchMemoriesCount(concertId, 'video/'),
  })
  const { data: memoriesCount } = useQuery({
    queryKey: ['memories-count', concertId],
    queryFn: () => fetchMemoriesCount(concertId),
  })
  const t = useTranslations('Memories')
  const [lightboxIsOpen, setLightboxIsOpen] = useState(false)
  const { push } = useRouter()

  if (!memories?.length) {
    return null
  }

  return (
    <>
      <section className="rounded-lg bg-slate-800 p-4 md:p-6">
        <div className="flex items-baseline gap-2">
          <h2>{t('memories')}</h2>
          {!!imageMemoriesCount && (
            <span className="text-sm text-slate-300">
              &bull; {t('nImages', { count: imageMemoriesCount })}
            </span>
          )}
          {!!videoMemoriesCount && (
            <span className="text-sm text-slate-300">
              {' '}
              &bull; {t('nVideos', { count: videoMemoriesCount })}
            </span>
          )}
        </div>
        <ul className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {memories.map((memory, index) => (
            <li
              key={memory.id}
              role="button"
              onClick={() => {
                setLightboxIsOpen(true)
                push(`#${memory.id}`)
              }}
              className="relative aspect-square rounded-lg bg-slate-700"
            >
              <Image
                src={
                  memory.file_type.startsWith('image/')
                    ? getCloudflareImageUrl(memory.cloudflare_file_id, {
                        width: 300,
                        height: 300,
                        fit: 'cover',
                      })
                    : getCloudflareThumbnailUrl(memory.cloudflare_file_id, {
                        time: '1s',
                        width: 300,
                        height: 300,
                      })
                }
                alt=""
                fill
                unoptimized
                className="rounded-lg object-cover"
              />
              {index === 3 && (memoriesCount ?? 0) > 4 && (
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-slate-900/50 text-xl backdrop-blur">
                  +{(memoriesCount ?? 0) - 4}
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
      <Lightbox
        concertId={concertId}
        imageMemoriesCount={imageMemoriesCount}
        videoMemoriesCount={videoMemoriesCount}
        open={lightboxIsOpen}
        onOpenChange={setLightboxIsOpen}
      />
    </>
  )
}

function Lightbox({
  concertId,
  imageMemoriesCount,
  videoMemoriesCount,
  ...dialogProps
}: {
  concertId: number
  imageMemoriesCount?: number | null
  videoMemoriesCount?: number | null
} & Dialog.DialogProps) {
  const { data: memories } = useMemories({ concertId })
  const t = useTranslations('Memories')

  return (
    <Dialog.Root {...dialogProps}>
      <Dialog.Portal>
        <Dialog.Overlay /> {/* Dialog Overlay is needed to prevent scrolling */}
        <Dialog.Content className="fixed inset-0 z-50 mx-auto max-w-xl snap-both snap-mandatory overflow-y-auto scroll-smooth bg-slate-900 md:snap-none">
          <div className="flex items-center gap-2 p-4">
            <Dialog.Title className="mb-0">{t('memories')}</Dialog.Title>
            {!!imageMemoriesCount && (
              <span className="text-sm text-slate-300">
                &bull; {t('nImages', { count: imageMemoriesCount })}
              </span>
            )}
            {!!videoMemoriesCount && (
              <span className="text-sm text-slate-300">
                {' '}
                &bull; {t('nVideos', { count: videoMemoriesCount })}
              </span>
            )}
            <Dialog.Close className="btn btn-secondary btn-icon ml-auto">
              <XIcon className="size-icon" />
            </Dialog.Close>
          </div>
          <ul className="flex flex-col gap-2 px-2 pb-2">
            {memories?.map(memory => <MemoryItem key={memory.id} memory={memory} />)}
          </ul>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function MemoryItem({ memory }: { memory: Memory }) {
  return (
    <li
      id={memory.id.toString()}
      className="relative grid flex-none snap-center place-content-center rounded-lg bg-slate-700"
      style={{
        aspectRatio: (memory.width ?? 1) / (memory.height ?? 1),
      }}
    >
      <div className="">
        {memory.file_type.startsWith('image/') ? (
          <Image
            src={getCloudflareImageUrl(memory.cloudflare_file_id, { width: 800 })}
            alt=""
            width={1000}
            height={1000}
            unoptimized
            className="max-h-full rounded-lg object-cover"
          />
        ) : (
          <VideoPlayer videoId={memory.cloudflare_file_id} />
        )}
        <div className="absolute bottom-0 left-0 m-2 flex flex-col items-start gap-1">
          {memory.band && (
            <div className="rounded-md bg-slate-900/50 px-2 py-1 font-bold">{memory.band.name}</div>
          )}
          {memory.profile && (
            <Link
              href={`/users/${memory.profile.id}`}
              className="group/user-item rounded-md bg-slate-900/50 p-2"
            >
              <UserItem user={memory.profile} size="sm" />
            </Link>
          )}
        </div>
      </div>
    </li>
  )
}
