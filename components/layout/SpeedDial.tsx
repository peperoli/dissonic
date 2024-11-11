'use client'

import { CalendarPlus, MapPinPlus, Plus } from 'lucide-react'
import { Button } from '../Button'
import { useSession } from '@/hooks/auth/useSession'
import { useModal } from '../shared/ModalProvider'
import { usePathname, useRouter } from 'next/navigation'
import * as Dialog from '@radix-ui/react-dialog'
import { GuitarPlusIcon } from './GuitarPlusIcon'
import { useState } from 'react'
import { useTranslations } from 'next-intl'

export const SpeedDial = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()
  const [_, setModal] = useModal()
  const { push } = useRouter()
  const pathname = usePathname()
  const t = useTranslations('SpeedDial')

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <div className="fixed bottom-0 right-0 m-4">
        <Dialog.Trigger asChild>
          <Button
            label="Speed-Dial öffnen"
            contentType="icon"
            icon={<Plus className="size-icon" />}
            appearance="primary"
          />
        </Dialog.Trigger>
      </div>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-800/90" />
        <Dialog.Content className="fixed bottom-0 right-0 z-50 flex flex-col items-end justify-end gap-4 p-4">
          <Dialog.Title className="sr-only">{t('speedDial')}</Dialog.Title>
          <button
            onClick={
              session
                ? () => {
                    setIsOpen(false)
                    setModal('add-location')
                  }
                : () => push(`/login?redirect=${pathname}`)
            }
            className="flex items-center gap-2"
          >
            <div className="rounded-lg border border-slate-800 bg-slate-850 p-2 text-sm font-bold shadow-lg">
              {t('addLocation')}
            </div>
            <div className="btn btn-icon btn-primary">
              <MapPinPlus className="size-icon" />
            </div>
          </button>
          <button
            onClick={
              session
                ? () => {
                    setIsOpen(false)
                    setModal('add-band')
                  }
                : () => push(`/login?redirect=${pathname}`)
            }
            className="flex items-center gap-2"
          >
            <div className="rounded-lg border border-slate-800 bg-slate-850 p-2 text-sm font-bold shadow-lg">
              {t('addBand')}
            </div>
            <div className="btn btn-icon btn-primary">
              <GuitarPlusIcon className="size-icon" />
            </div>
          </button>
          <button
            onClick={
              session
                ? () => {
                    setIsOpen(false)
                    setModal('add-concert')
                  }
                : () => push(`/login?redirect=${pathname}`)
            }
            className="flex items-center gap-2"
          >
            <div className="rounded-lg border border-slate-800 bg-slate-850 p-2 text-sm font-bold shadow-lg">
              {t('addConcert')}
            </div>
            <div className="btn btn-icon btn-primary">
              <CalendarPlus className="size-icon" />
            </div>
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
