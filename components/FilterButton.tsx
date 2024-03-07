import { Button } from './Button'
import { ReactNode, useState } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { ListItem } from '@/types/types'
import { TruncatedList } from 'react-truncate-list'
import clsx from 'clsx'
import * as Dialog from '@radix-ui/react-dialog'
import useMediaQuery from '@/hooks/helpers/useMediaQuery'

type FilterButtonProps = {
  label: string
  items?: ListItem[]
  size?: 'md' | 'sm'
  appearance?: 'secondary' | 'tertiary'
  children: ReactNode
} & (
  | {
      type?: 'multiselect' | 'range'
      selectedIds: number[]
      submittedValues: number[] | null
      onSubmit: (value: number[]) => void
    }
  | { type?: 'singleselect'; selectedId: number | null }
)

export const FilterButton = ({
  label,
  type = 'multiselect',
  items,
  size = 'md',
  appearance = 'secondary',
  children,
  ...props
}: FilterButtonProps) => {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const close = () => setOpen(false)
  const count = ('submittedValues' in props && props.submittedValues?.length) || 0
  const hasValues = count > 0 || ('selectedId' in props && props !== null)
  return (
    <div className="relative">
      <Dialog.Root open={open} onOpenChange={setOpen} modal={!isDesktop}>
        <Dialog.Trigger
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
            {type === 'range' &&
              count > 0 &&
              'submittedValues' in props &&
              props.submittedValues && (
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
                      <li key={item.id}>
                        {item.name}
                        {index + 1 < count && <>,&nbsp;</>}
                      </li>
                    ))}
                </TruncatedList>
              )}
            {type === 'singleselect' && 'selectedId' in props && (
              <div>{items?.find(item => item.id === props.selectedId)?.name}</div>
            )}
          </div>
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
          {'onSubmit' in props && (
            <Button
              onClick={() => {
                props.onSubmit(props.selectedIds)
                close()
              }}
              label="Übernehmen"
              appearance="primary"
              className="mt-2"
            />
          )}
        </Dialog.Content>
      </Dialog.Root>
    </div>
  )
}
