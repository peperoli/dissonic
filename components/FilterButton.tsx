import { Button } from './Button'
import { ReactNode, useEffect, useState } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { ListItem } from '@/types/types'
import { TruncatedList } from 'react-truncate-list'
import clsx from 'clsx'
import * as Dialog from '@radix-ui/react-dialog'
import { Popover } from './shared/Popover'
import useMediaQuery from '@/hooks/helpers/useMediaQuery'
import { useTranslations } from 'next-intl'

type MultiSelectProps = {
  type?: 'multiselect' | 'range'
  selectedIds: number[]
  submittedValues: number[] | null
  onSubmit: (value: number[]) => void
}

type SingleSelectProps = { type?: 'singleselect'; selectedId: number | null }

type FilterButtonProps = {
  label: string
  items?: ListItem[]
  size?: 'md' | 'sm'
  appearance?: 'secondary' | 'tertiary'
  children: ReactNode
} & (MultiSelectProps | SingleSelectProps)

export const FilterButton = ({
  label,
  type = 'multiselect',
  items,
  size = 'md',
  appearance = 'secondary',
  children,
  ...props
}: FilterButtonProps) => {
  const [isOpen, setOpen] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const t = useTranslations('FilterButton')
  const close = () => setOpen(false)
  const count = ('submittedValues' in props && props.submittedValues?.length) || 0
  const hasValues = count > 0 || ('selectedId' in props && props !== null)

  useEffect(() => {
    close()
  }, ['selectedId' in props && props.selectedId])

  const triggerButton = (
    <button
      type="button"
      className={clsx(
        'flex w-full items-center gap-2 whitespace-nowrap',
        size === 'md' && 'rounded-lg px-4 py-2',
        size === 'sm' && 'rounded-md px-3 py-1.5 text-sm',
        appearance === 'secondary' &&
          (hasValues ? 'bg-gradient-to-r from-blue/20 to-venom/20' : 'bg-slate-700')
      )}
    >
      <div className="flex w-full">
        {hasValues ? <span className="text-slate-300">{label}:&nbsp;</span> : label}
        {type === 'range' && count > 0 && 'submittedValues' in props && props.submittedValues && (
          <div>
            {Math.min(...props.submittedValues)}&thinsp;&ndash;&thinsp;
            {Math.max(...props.submittedValues)}
          </div>
        )}
        {type === 'multiselect' &&
          count > 0 &&
          'submittedValues' in props &&
          props.submittedValues && (
            <TruncatedList
              renderTruncator={({ hiddenItemsCount }) => <div>+{hiddenItemsCount}</div>}
              className="flex w-full items-center overflow-auto"
            >
              {items
                ?.filter(item => props.submittedValues?.includes(item.id))
                .map((item, index) => (
                  <span key={item.id}>
                    {item.name}
                    {index + 1 < count && <>,&nbsp;</>}
                  </span>
                ))}
            </TruncatedList>
          )}
        {type === 'singleselect' && 'selectedId' in props && (
          <div>{items?.find(item => item.id === props.selectedId)?.name}</div>
        )}
      </div>
      <ChevronDown className={clsx('ml-auto size-icon flex-none', isOpen && 'rotate-180')} />
    </button>
  )

  const submitButton =
    'onSubmit' in props ? (
      <Button
        onClick={() => {
          props.onSubmit(props.selectedIds)
          close()
        }}
        label={t('save')}
        appearance="primary"
        className="mt-2"
      />
    ) : null

  if (isDesktop) {
    return (
      <div className="relative">
        <Popover.Root>
          <Popover.Trigger asChild>{triggerButton}</Popover.Trigger>
          <Popover.Content className="z-20 mt-1 flex-col rounded-lg bg-slate-700 p-4 text-white shadow-xl [&:popover-open]:flex">
            {children}
            {submitButton}
          </Popover.Content>
        </Popover.Root>
      </div>
    )
  }

  return (
    <div className="relative">
      <Dialog.Root open={isOpen} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>{triggerButton}</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Content className="fixed inset-0 z-20 flex flex-col overflow-hidden bg-slate-700 p-4 shadow-xl">
            <div className="mb-2 flex items-center justify-between gap-4">
              <Dialog.Title className="mb-0 capitalize">{label}</Dialog.Title>
              <Button
                onClick={() => close()}
                label={t('close')}
                contentType="icon"
                icon={<X className="size-icon" />}
              />
            </div>
            {children}
            {submitButton}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
