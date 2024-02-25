import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { FieldError } from 'react-hook-form'
import { Select, SelectProps } from './Select'
import { ChevronDown, Loader2 } from 'lucide-react'
import { TruncatedList } from 'react-truncate-list'
import * as Dialog from '@radix-ui/react-dialog'
import useMediaQuery from '@/hooks/helpers/useMediaQuery'

type SelectFieldProps = {
  label: string
  error?: FieldError
} & SelectProps

export const SelectField = ({ label, items, error, ...props }: SelectFieldProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  function getLabel() {
    if (!items) return <Loader2 className="size-icon animate-spin" />

    if (!props.multiple && props.value) return items?.find(item => item.id === props.value)?.name

    if (props.multiple && props.values.length > 0) {
      return (
        <TruncatedList
          renderTruncator={({ hiddenItemsCount }) => (
            <div className="text-slate-300">+{hiddenItemsCount}</div>
          )}
          className="flex"
        >
          {items
            ?.filter(item => props.values.includes(item.id))
            .map((item, index) => (
              <li key={item.id} className="whitespace-nowrap">
                {item.name}
                {index + 1 < props.values.length && <>,&nbsp;</>}
              </li>
            ))}
        </TruncatedList>
      )
    }

    return 'Bitte wählen ...'
  }

  useEffect(() => {
    setIsOpen(false)
    // @ts-expect-error
  }, [props.value])
  return (
    <div className="relative">
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen} modal={!isDesktop}>
        <Dialog.Trigger aria-label={label} className="form-control">
          <div
            className={clsx(
              'form-input !pr-12 text-left',
              error ? 'border-yellow' : 'border-slate-500'
            )}
          >
            {getLabel()}
          </div>
          <label>{label}</label>
          <ChevronDown className="pointer-events-none absolute right-[18px] top-[18px] size-icon" />
        </Dialog.Trigger>
        {error && <div className="mt-1 text-sm text-yellow">Bitte wähle eine Option aus.</div>}
        <Dialog.Content className="fixed inset-0 z-20 flex min-w-full flex-col overflow-hidden bg-slate-700 p-4 shadow-xl md:absolute md:inset-auto md:mt-1 md:rounded-lg">
          <Select items={items} {...props} />
          {'values' in props && <Dialog.Close className="btn btn-primary">Übernehmen</Dialog.Close>}
        </Dialog.Content>
      </Dialog.Root>
    </div>
  )
}
