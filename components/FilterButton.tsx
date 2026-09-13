import { Button } from './Button'
import { ReactNode } from 'react'
import { ChevronDownIcon, XIcon } from 'lucide-react'
import { ListItem } from '@/types/types'
import { TruncatedList } from 'react-truncate-list'
import clsx from 'clsx'
import { Dialog } from './shared/Dialog'
import { Popover } from './shared/Popover'
import useMediaQuery from '@/hooks/helpers/useMediaQuery'
import { useTranslations } from 'next-intl'

type FilterButtonProps<TId extends string | number> = {
  label: string
  items?: ListItem<TId>[]
  size?: 'md' | 'sm'
  appearance?: 'secondary' | 'tertiary'
  children: ReactNode
  type?: 'multiselect' | 'range' | 'singleselect'
  selectedIds?: TId[]
  submittedValues?: TId[] | null
  onSubmit?: (value: TId[]) => void
  selectedId?: TId | null
}

export const FilterButton = <TId extends string | number = number>({
  label,
  type = 'multiselect',
  items,
  size = 'md',
  appearance = 'secondary',
  children,
  ...props
}: FilterButtonProps<TId>) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const t = useTranslations('FilterButton')
  const count = props.submittedValues?.length || 0
  const hasValues = count > 0 || (props.selectedId !== undefined && props.selectedId !== null)

  function triggerButton({ isOpen }: { isOpen?: boolean }) {
    return (
      <button
        type="button"
        className={clsx(
          'flex items-center gap-2 whitespace-nowrap',
          size === 'md' && 'rounded-lg px-4 py-2',
          size === 'sm' && 'rounded-md px-3 py-1.5 text-sm',
          appearance === 'secondary' &&
            (hasValues ? 'bg-gradient-to-r from-blue/20 to-venom/20' : 'bg-slate-700')
        )}
      >
        <div className="flex w-full">
          {hasValues ? <span className="text-slate-300">{label}:&nbsp;</span> : label}
          {type === 'range' && count > 0 && props.submittedValues && (
            <div>
              {Math.min(...props.submittedValues.map(Number))}&thinsp;&ndash;&thinsp;
              {Math.max(...props.submittedValues.map(Number))}
            </div>
          )}
          {type === 'multiselect' && count > 0 && props.submittedValues && (
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
          {type === 'singleselect' && props.selectedId !== undefined && (
            <div>{items?.find(item => item.id === props.selectedId)?.name}</div>
          )}
        </div>
        <ChevronDownIcon className={clsx('ml-auto size-icon flex-none', isOpen && 'rotate-180')} />
      </button>
    )
  }

  const submitButton =
    props.onSubmit && props.selectedIds ? (
      <Button
        onClick={() => {
          props.onSubmit?.(props.selectedIds ?? [])
        }}
        label={t('save')}
        appearance="primary"
        className="mt-2 w-full"
      />
    ) : null

  if (isDesktop) {
    return (
      <Popover.Root>
        {({ isOpen }) => (
          <>
            <Popover.Trigger asChild>{triggerButton({ isOpen })}</Popover.Trigger>
            <Popover.Content className="z-20 mt-1 w-[calc(anchor-size(width)+2rem)] flex-col rounded-lg bg-slate-700 p-4 shadow-xl">
              {children}
              <Popover.Close asChild>{submitButton}</Popover.Close>
            </Popover.Content>
          </>
        )}
      </Popover.Root>
    )
  }

  return (
    <Dialog.Root>
      {({ isOpen }) => (
        <>
          <Dialog.Trigger asChild>{triggerButton({ isOpen })}</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Content className="z-20 size-full flex-col overflow-hidden bg-slate-700 p-4 shadow-xl open:flex">
              <div className="mb-2 flex items-center justify-between gap-4">
                <Dialog.Title className="mb-0 capitalize">{label}</Dialog.Title>
                <Dialog.Close asChild>
                  <Button
                    label={t('close')}
                    contentType="icon"
                    icon={<XIcon className="size-icon" />}
                  />
                </Dialog.Close>
              </div>
              {children}
              <Dialog.Close asChild>{submitButton}</Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </>
      )}
    </Dialog.Root>
  )
}
