import clsx from 'clsx'
import { useEffect } from 'react'
import { FieldError, Merge } from 'react-hook-form'
import { Select, SelectProps } from './Select'
import { ChevronDown, Loader2, XIcon } from 'lucide-react'
import { TruncatedList } from 'react-truncate-list'
import { Dialog } from '../shared/Dialog'
import useMediaQuery from '@/hooks/helpers/useMediaQuery'
import { useTranslations } from 'next-intl'
import { ListItem } from '@/types/types'
import { Popover } from '../shared/Popover'

type SingleSelectProps = {
  multiple?: false
  value: ListItem | null
  onValueChange: (value: ListItem | null) => void
}

type MultiSelectProps = {
  multiple: true
  values: ListItem[]
  onValuesChange: (values: ListItem[]) => void
}

type SelectFieldProps = {
  label: string
  error?: Merge<FieldError, unknown>
  isClearable?: boolean
  items: ListItem[]
} & SelectProps &
  (SingleSelectProps | MultiSelectProps)

export const SelectField = ({ label, items, error, isClearable, ...props }: SelectFieldProps) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const t = useTranslations('SelectField')
  const OverlayRoot = isDesktop ? Popover.Root : Dialog.Root
  const OverlayTrigger = isDesktop ? Popover.Trigger : Dialog.Trigger
  const OverlayContent = isDesktop ? Popover.Content : Dialog.Content
  const OverlayClose = isDesktop ? Popover.Close : Dialog.Close

  function getValue() {
    if ('value' in props && props.value) return props.value.name

    if ('values' in props && props.values.length > 0) {
      return (
        <TruncatedList
          renderTruncator={({ hiddenItemsCount }) => (
            <div className="text-slate-300">+{hiddenItemsCount}</div>
          )}
          className="flex"
        >
          {props.values.map((value, index) => (
            <div key={value.id} className="whitespace-nowrap">
              {value.name}
              {index + 1 < props.values.length && <>,&nbsp;</>}
            </div>
          ))}
        </TruncatedList>
      )
    }

    return <span className="text-slate-300">{t('choose')}</span>
  }

  return (
    <OverlayRoot>
      {({ close }) => (
        <>
          {'value' in props && <AutoClose value={props.value} close={close} />}
          <OverlayTrigger aria-label={label} className="form-control">
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
              <Loader2 className="pointer-events-none absolute right-[.9rem] top-[.9rem] size-icon animate-spin" />
            ) : (
              <ChevronDown className="pointer-events-none absolute right-[.9rem] top-[.9rem] size-icon" />
            )}
            {isClearable &&
              ('value' in props && props.value !== null ? (
                <button
                  onClick={() => props.onValueChange(null)}
                  className="btn btn-tertiary btn-icon btn-small absolute right-10 top-[.5rem]"
                >
                  <XIcon className="size-icon" />
                </button>
              ) : 'values' in props && props.values.length > 0 ? (
                <button
                  onClick={() => props.onValuesChange([])}
                  className="btn btn-tertiary btn-icon btn-small absolute right-10 top-[.5rem]"
                >
                  <XIcon className="size-icon" />
                </button>
              ) : null)}
          </OverlayTrigger>
          {error && <div className="mt-1 text-sm text-yellow">{t('pleaseSelectAnOption')}</div>}
          <OverlayContent className="inset-0 z-20 flex-col overflow-hidden bg-slate-700 p-4 shadow-xl open:flex md:inset-auto md:mt-1 md:w-anchor-width md:rounded-lg">
            <Dialog.Title className="sr-only">{label}</Dialog.Title>
            {'values' in props ? (
              <Select
                items={items}
                {...props}
                values={props.values.map(value => value.id)}
                onValuesChange={(values: number[]) =>
                  props.onValuesChange(items.filter(item => values.includes(item.id)))
                }
              />
            ) : (
              <Select
                items={items}
                {...props}
                value={props.value?.id ?? null}
                onValueChange={value =>
                  props.onValueChange(items.find(item => item.id === value) ?? null)
                }
              />
            )}
            {'values' in props && (
              <OverlayClose className="btn btn-primary">{t('save')}</OverlayClose>
            )}
          </OverlayContent>
        </>
      )}
    </OverlayRoot>
  )
}

function AutoClose({ value, close }: { value: ListItem | null; close: () => void }) {
  useEffect(() => {
    close()
  }, [value?.id])

  return null
}
