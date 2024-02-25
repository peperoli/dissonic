import { Button } from './Button'
import { ReactNode, useState } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { ListItem } from '@/types/types'
import { TruncatedList } from 'react-truncate-list'
import clsx from 'clsx'
import * as Dialog from '@radix-ui/react-dialog'
import useMediaQuery from '@/hooks/helpers/useMediaQuery'

interface FilterButtonProps {
  label: string
  type?: 'multiselect' | 'range'
  items?: ListItem[]
  selectedIds: number[]
  submittedValues: number[] | null
  onSubmit: (value: number[]) => void
  children: ReactNode
}

export const FilterButton = ({
  label,
  type = 'multiselect',
  items,
  selectedIds,
  submittedValues,
  onSubmit,
  children,
}: FilterButtonProps) => {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const close = () => setOpen(false)
  const count = submittedValues?.length ?? 0
  return (
    <div className="relative">
      <Dialog.Root open={open} onOpenChange={setOpen} modal={!isDesktop}>
        <Dialog.Trigger className="flex gap-2 w-full items-center whitespace-nowrap rounded-lg bg-slate-700 px-4 py-2">
          <div>{count > 0 ? <>{label}:&nbsp;</> : label}</div>
          {count > 0 &&
            submittedValues &&
            (type === 'range' ? (
              <div className="whitespace-nowrap rounded bg-slate-800 px-1 py-0.5 text-sm">
                {Math.min(...submittedValues)}&thinsp;–&thinsp;{Math.max(...submittedValues)}
              </div>
            ) : (
              <TruncatedList
                renderTruncator={({ hiddenItemsCount }) => <div>+{hiddenItemsCount}</div>}
                className="flex w-full items-center gap-1 overflow-auto"
              >
                {items
                  ?.filter(item => submittedValues.includes(item.id))
                  .map(item => (
                    <li
                      className="whitespace-nowrap rounded bg-slate-800 px-1 py-0.5 text-sm"
                      key={item.id}
                    >
                      {item.name}
                    </li>
                  ))}
              </TruncatedList>
            ))}
          <ChevronDown className={clsx('ml-auto size-icon flex-none', open && 'rotate-180')} />
        </Dialog.Trigger>
        <Dialog.Content className="fixed inset-0 z-20 flex min-w-full flex-col overflow-hidden bg-slate-700 p-4 shadow-xl md:absolute md:inset-auto md:mt-1 md:rounded-lg">
          <div className="mb-2 flex items-center justify-between gap-4 md:hidden">
            <h2 className="mb-0 capitalize">{label}</h2>
            <Button
              onClick={() => close()}
              label="Schliessen"
              contentType="icon"
              icon={<X className="size-icon" />}
            />
          </div>
          {children}
          <Button
            onClick={() => {
              onSubmit(selectedIds)
              close()
            }}
            label="Übernehmen"
            appearance="primary"
            className="mt-2"
          />
        </Dialog.Content>
      </Dialog.Root>
    </div>
  )
}
