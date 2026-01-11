import { useMemories } from '@/hooks/concerts/useMemories'
import {
  getCloudflareImageUrl,
  getCloudflareThumbnailUrl,
  getCloudflareVideoUrl,
} from '@/lib/cloudflareHelpers'
import Image from 'next/image'
import * as Dialog from '@radix-ui/react-dialog'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlaySquareIcon, PlusIcon, XIcon } from 'lucide-react'
import { Memory } from '@/types/types'
import { UserItem } from '../shared/UserItem'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'
import { VideoPlayer } from '../shared/VideoPlayer'
import { Button } from '../Button'
import { useModal } from '../shared/ModalProvider'

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
  const [_, setModal] = useModal()

  return (
    <>
      <section className="rounded-lg bg-slate-800 p-4 md:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <h2 className="mb-0">
            {t('memories')}{' '}
            <span className="rounded-md bg-slate-300 px-1 text-sm font-bold text-slate-850">
              Beta
            </span>
          </h2>
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
          <Button
            label={t('addMemory')}
            onClick={() => setModal('edit-log')}
            icon={<PlusIcon className="size-icon" />}
            size="small"
            className="md:ml-auto"
          />
        </div>
        <ul className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {memories?.length ? (
            memories.map((memory, index) => (
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
                      ? getCloudflareImageUrl(memory.file_id, {
                          width: 300,
                          height: 300,
                          fit: 'cover',
                        })
                      : getCloudflareThumbnailUrl(memory.file_id, {
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
                {memory.file_type.startsWith('video/') && (
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded bg-slate-900/70 p-1 text-sm">
                    <PlaySquareIcon className="size-icon" />
                    {memory.duration && (
                      <span>
                        {Math.floor(memory.duration / 60)}:
                        {(memory.duration % 60).toString().padStart(2, '0')}
                      </span>
                    )}
                  </div>
                )}
                {index === 3 && (memoriesCount ?? 0) > 4 && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-slate-900/50 text-xl backdrop-blur-sm">
                    <div className="btn btn-small btn-secondary !bg-slate-900/70">
                      +{(memoriesCount ?? 0) - 4}
                    </div>
                  </div>
                )}
              </li>
            ))
          ) : (
            <p className="col-span-full text-sm text-slate-300">{t('noMemoriesYet')}</p>
          )}
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
  const [metadataIsVisible, setMetadataIsVisible] = useState(true)
  const t = useTranslations('Memories')

  function toggleMetadata() {
    setMetadataIsVisible(!metadataIsVisible)
  }

  return (
    <Dialog.Root {...dialogProps}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-900" />
        <Dialog.Content className="fixed inset-0 z-50 mx-auto max-w-xl overflow-y-auto scroll-smooth bg-slate-900">
          <div className="flex flex-wrap items-center gap-2 p-4">
            <Dialog.Title className="mb-0">{t('memories')}</Dialog.Title>
            <span className="rounded-md bg-slate-300 px-1 text-sm font-bold text-slate-850">
              Beta
            </span>
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
            {memories?.map(memory => (
              <MemoryItem
                key={memory.id}
                memory={memory}
                metadataIsVisible={metadataIsVisible}
                toggleMetadata={toggleMetadata}
              />
            ))}
          </ul>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function MemoryItem({
  memory,
  metadataIsVisible,
  toggleMetadata,
}: {
  memory: Memory
  metadataIsVisible: boolean
  toggleMetadata: () => void
}) {
  return (
    <li
      id={memory.id.toString()}
      onClick={toggleMetadata}
      className="relative grid flex-none place-content-center rounded-lg bg-slate-700"
      style={{
        aspectRatio: memory.width && memory.height ? memory.width / memory.height : undefined,
      }}
    >
      {memory.file_type.startsWith('image/') ? (
        <Image
          src={getCloudflareImageUrl(memory.file_id, { width: 800 })}
          alt=""
          width={1000}
          height={1000}
          unoptimized
          className="max-h-full rounded-lg object-cover"
        />
      ) : (
        <VideoPlayer src={getCloudflareVideoUrl(memory.file_id)} />
      )}
      {metadataIsVisible && (
        <div className="absolute inset-0 bottom-auto m-2 flex flex-col items-start gap-1">
          {memory.profile && (
            <Link
              href={`/users/${encodeURIComponent(memory.profile.username)}`}
              className="group/user-item rounded-md bg-slate-900/50 p-2"
            >
              <UserItem user={memory.profile} size="sm" />
            </Link>
          )}
          {memory.band && (
            <div className="rounded-md bg-slate-900/50 px-2 py-1 font-bold">{memory.band.name}</div>
          )}
        </div>
      )}
    </li>
  )
}
