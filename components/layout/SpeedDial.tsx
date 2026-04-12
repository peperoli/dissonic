'use client'

import { useSession } from '@/hooks/auth/useSession'
import { CalendarPlus, MapPinPlus, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { ReactElement } from 'react'
import { Button } from '../Button'
import { Dialog } from '../shared/Dialog'
import { modalPaths, useModal } from '../shared/ModalProvider'
import { GuitarPlusIcon } from './GuitarPlusIcon'

export const SpeedDial = () => {
  const t = useTranslations('SpeedDial')

  return (
    <Dialog.Root shouldCloseOnClickOutside>
      <div className="fixed bottom-16 right-0 z-20 m-4 md:bottom-0">
        <Dialog.Trigger asChild>
          <Button
            label={t('addResource')}
            contentType="icon"
            icon={<Plus className="size-icon" />}
            appearance="primary"
          />
        </Dialog.Trigger>
      </div>
      <Dialog.Portal>
        <Dialog.Content className="bottom-0 left-auto right-0 top-auto z-50 flex-col items-end gap-4 p-4 backdrop:bg-slate-800/90 open:flex">
          <Dialog.Title className="sr-only">{t('addResource')}</Dialog.Title>

          <DialButton
            modal="add-location"
            label={t('addLocation')}
            icon={<MapPinPlus className="size-icon" />}
          />
          <DialButton
            modal="add-band"
            label={t('addBand')}
            icon={<GuitarPlusIcon className="size-icon" />}
          />
          <DialButton
            modal="add-concert"
            label={t('addConcert')}
            icon={<CalendarPlus className="size-icon" />}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function DialButton({
  modal,
  label,
  icon,
}: {
  modal: (typeof modalPaths)[number]
  label: string
  icon: ReactElement
}) {
  const { data: session } = useSession()
  const [, setModal] = useModal()
  const { push } = useRouter()
  const pathname = usePathname()

  return (
    <Dialog.Close asChild>
      <button
        onClick={session ? () => setModal(modal) : () => push(`/login?redirect=${pathname}`)}
        className="flex items-center gap-2"
      >
        <div className="rounded-lg border border-slate-800 bg-slate-850 p-2 text-sm font-bold shadow-lg">
          {label}
        </div>
        <div className="btn btn-icon btn-primary">{icon}</div>
      </button>
    </Dialog.Close>
  )
}
