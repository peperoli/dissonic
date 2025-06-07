import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { FieldError } from 'react-hook-form'
import { Select, SelectProps } from './Select'
import { ChevronDown, Loader2 } from 'lucide-react'
import { TruncatedList } from 'react-truncate-list'
import * as Dialog from '@radix-ui/react-dialog'
import useMediaQuery from '@/hooks/helpers/useMediaQuery'
import { useTranslations } from 'next-intl'
import { ListItem } from '@/types/types'

type SelectFieldProps = {
  label: string
  allItems: ListItem[] | undefined
  error?: FieldError
} & SelectProps

export const SelectField = ({ label, items, allItems, error, ...props }: SelectFieldProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const t = useTranslations('SelectField')

  function getValue() {
    if ('value' in props && props.value)
      return allItems?.find(item => item.id === props.value)?.name ?? props.value

    if ('values' in props && props.values.length > 0) {
      return (
        <TruncatedList
          renderTruncator={({ hiddenItemsCount }) => (
            <div className="text-slate-300">+{hiddenItemsCount}</div>
          )}
          className="flex"
        >
          {props.values.map((value, index) => (
            <div key={value} className="whitespace-nowrap">
              {allItems?.find(item => item.id === value)?.name ?? value}
              {index + 1 < props.values.length && <>,&nbsp;</>}
            </div>
          ))}
        </TruncatedList>
      )
    }

    return <span className="text-slate-300">{t('choose')}</span>
  }

  useEffect(() => {
    setIsOpen(false)
  }, ['value' in props && props.value])

  return (
    <div className="relative">
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen} modal={!isDesktop}>
        <Dialog.Trigger aria-label={label} className="form-control">
          <div
            className={clsx(
              'form-input truncate !pr-12 text-left',
              error ? 'border-yellow' : 'border-slate-500'
            )}
          >
            {getValue()}
          </div>
          <label>{label}</label>
          {!items ? (
            <Loader2 className="pointer-events-none absolute right-[18px] top-[18px] size-icon animate-spin" />
          ) : (
            <ChevronDown className="pointer-events-none absolute right-[18px] top-[18px] size-icon" />
          )}
        </Dialog.Trigger>
        {error && <div className="mt-1 text-sm text-yellow">{t('pleaseSelectAnOption')}</div>}
        <Dialog.Content className="fixed inset-0 z-20 flex min-w-full flex-col overflow-hidden bg-slate-700 p-4 shadow-xl md:absolute md:inset-auto md:mt-1 md:rounded-lg">
          <Dialog.Title className="sr-only">{label}</Dialog.Title>
          <Select items={items} {...props} />
          {'values' in props && (
            <Dialog.Close className="btn btn-primary">{t('save')}</Dialog.Close>
          )}
        </Dialog.Content>
      </Dialog.Root>
    </div>
  )
}
