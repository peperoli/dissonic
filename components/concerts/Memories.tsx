import { useMemories } from '@/hooks/concerts/useMemories'
import { getR2AssetUrl } from '@/lib/getR2AssetUrl'
import Image from 'next/image'
import * as Dialog from '@radix-ui/react-dialog'
import { useTranslations } from 'next-intl'
import { useState, WheelEvent } from 'react'
import { useRouter } from 'next/navigation'
import { XIcon } from 'lucide-react'
import { Memory } from '@/types/types'
import useMediaQuery from '@/hooks/helpers/useMediaQuery'

export function Memories({ concertId }: { concertId?: number }) {
  const { data: memories } = useMemories({ concertId })
  const t = useTranslations('Memories')
  const [lightboxIsOpen, setLightboxIsOpen] = useState(false)
  const { push } = useRouter()

  if (!memories?.length) {
    return null
  }

  return (
    <>
      <section className="rounded-lg bg-slate-800 p-4 md:p-6">
        <h2>{t('memories')}</h2>
        <ul className="grid grid-cols-4 gap-2">
          {memories.map((memory, index) => (
            <li
              key={index}
              role="button"
              onClick={() => {
                setLightboxIsOpen(true)
                push(`#${memory.id}`)
              }}
              className="relative aspect-3/4 rounded-lg bg-slate-700"
            >
              <Image
                src={getR2AssetUrl(memory.file_name, { width: 300, height: 400 })}
                alt={memory.file_name}
                fill
                unoptimized
                className="rounded-lg object-cover"
              />
              {memory.band?.name && (
                <div className="absolute bottom-0 m-1 rounded-lg bg-slate-900/50 px-2 py-1">
                  {memory.band.name}
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
      <Lightbox memories={memories} open={lightboxIsOpen} onOpenChange={setLightboxIsOpen} />
    </>
  )
}

function Lightbox({
  memories,
  ...dialogProps
}: {
  memories: Memory[]
} & Dialog.DialogProps) {
  const t = useTranslations('Memories')
  const isDesktop = useMediaQuery('(min-width: 768px)')

  function handleWheel(event: WheelEvent<HTMLUListElement>) {
    if (event.deltaY == 0) return
    event.currentTarget.scrollTo({
      left: event.currentTarget.scrollLeft + event.deltaY * 5,
    })
  }

  return (
    <Dialog.Root {...dialogProps}>
      <Dialog.Portal>
        <Dialog.Overlay /> {/* Dialog Overlay is needed to prevent scrolling */}
        <Dialog.Content className="fixed inset-0 z-50 bg-slate-800 p-2">
          <Dialog.Title className="sr-only">{t('memories')}</Dialog.Title>
          <ul
            onWheel={isDesktop ? handleWheel : undefined}
            className="flex h-full snap-both snap-mandatory flex-col gap-2 overflow-x-auto scroll-smooth md:snap-none md:flex-row"
          >
            {memories?.map(memory => <MemoryItem key={memory.id} memory={memory} />)}
          </ul>
          <Dialog.Close className="btn btn-secondary btn-icon absolute right-4 top-4">
            <XIcon className="size-icon" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function MemoryItem({ memory }: { memory: Memory }) {
  return (
    <li
      id={memory.id.toString()}
      className="relative snap-center rounded-lg bg-slate-700 flex-none"
    >
      <Image
        src={getR2AssetUrl(memory.file_name, { height: 1000 })}
        alt={memory.file_name}
        width={memory.file_width || 750}
        height={memory.file_height || 1000}
        unoptimized
        className="rounded-lg h-full object-cover"
      />
      {memory.band && (
        <div className="absolute bottom-0 m-1 rounded-lg bg-slate-900/50 px-2 py-1">
          {memory.band.name}
        </div>
      )}
    </li>
  )
}
