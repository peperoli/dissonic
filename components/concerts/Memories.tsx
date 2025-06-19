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

  return (
    <>
      <section className="rounded-lg bg-slate-800 p-4 md:p-6">
        <h2>{t('memories')}</h2>
        <ul className="grid grid-cols-4 gap-2">
          {memories?.map((memory, index) => (
            <li
              key={index}
              role="button"
              onClick={() => {
                setLightboxIsOpen(true)
                push(`#${memory.id}`)
              }}
              className="aspect-3/4 relative rounded-lg bg-slate-700"
            >
              <Image
                src={getR2AssetUrl(memory.file_name)}
                alt={memory.file_name}
                fill
                className="rounded-lg object-cover"
              />
              <div className="absolute bottom-0 m-1 rounded-lg bg-slate-900/50 px-2 py-1">
                {memory.band?.name}
              </div>
            </li>
          ))}
        </ul>
      </section>
      {memories && (
        <Lightbox memories={memories} open={lightboxIsOpen} onOpenChange={setLightboxIsOpen} />
      )}
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
            className="flex flex-col md:flex-row h-full snap-both snap-mandatory md:snap-none gap-2 overflow-x-auto scroll-smooth"
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
      className="aspect-3/4 relative snap-center rounded-lg bg-slate-700"
    >
      <Image
        src={getR2AssetUrl(memory.file_name)}
        alt={memory.file_name}
        fill
        className="rounded-lg object-cover"
      />
      {memory.band && (
        <div className="absolute bottom-0 m-1 rounded-lg bg-slate-900/50 px-2 py-1">
          {memory.band.name}
        </div>
      )}
    </li>
  )
}
