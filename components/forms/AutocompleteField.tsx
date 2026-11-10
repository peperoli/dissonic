import clsx from 'clsx'
import { ChangeEventHandler, FocusEventHandler, Ref, useCallback, useRef } from 'react'
import { FieldError, Merge } from 'react-hook-form'
import {
  BuildingIcon,
  Loader2,
  MapPinIcon,
  SignpostBigIcon,
  FlagIcon,
  MapIcon,
  BuildingComplexIcon,
  RoadIcon,
  BirdIcon,
  LucideIcon,
} from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { ListItem } from '@/types/types'
import { Popover } from '../shared/Popover'
import { GeoapifyFeature } from '@/types/geoapify'
import { getCountryName } from '@/lib/getCountryName'

type AutocompleteFieldProps<TId extends string | number> = {
  ref: Ref<HTMLInputElement>
  name: string
  onChange?: ChangeEventHandler<HTMLInputElement>
  onBlur?: FocusEventHandler<HTMLInputElement>
  onFocus?: FocusEventHandler<HTMLInputElement>
  label: string
  placeholder?: string
  error?: Merge<FieldError, unknown>
  items: ListItem<TId>[]
  onAutocomplete: (value: ListItem<TId> | null) => void
  isLoading?: boolean
}

const resultTypeIcons = {
  country: FlagIcon,
  state: MapIcon,
  city: BuildingComplexIcon,
  postcode: SignpostBigIcon,
  street: RoadIcon,
  amenity: BuildingIcon,
  locality: MapPinIcon,
  building: BuildingIcon,
} satisfies Record<GeoapifyFeature['properties']['result_type'], LucideIcon>

export function AutocompleteField<TId extends string | number = number>({
  ref,
  name,
  label,
  items,
  error,
  onAutocomplete,
  isLoading,
  onBlur,
  onFocus,
  ...props
}: AutocompleteFieldProps<TId>) {
  const t = useTranslations('AutocompleteField')
  const inputRef = useRef<HTMLInputElement>(null)
  const focusRegionRef = useRef<HTMLDivElement>(null)

  const setInputRef = useCallback(
    (element: HTMLInputElement | null) => {
      inputRef.current = element

      if (typeof ref === 'function') {
        ref(element)
      } else if (ref) {
        ref.current = element
      }
    },
    [ref]
  )

  return (
    <Popover.Root shouldCloseOnClickOutside={false}>
      {({ isOpen, show, close }) => (
        <div
          ref={focusRegionRef}
          onKeyDown={event => {
            if (event.key === 'Escape' && isOpen) {
              event.preventDefault()
              event.stopPropagation()
              close()
            }
          }}
        >
          <div className="form-control">
            <input
              ref={setInputRef}
              id={name}
              name={name}
              type="text"
              autoComplete="off"
              onFocus={event => {
                onFocus?.(event)
                if (!isOpen) show()
              }}
              onBlur={event => {
                onBlur?.(event)
                requestAnimationFrame(() => {
                  if (!focusRegionRef.current?.contains(document.activeElement)) close()
                })
              }}
              data-1p-ignore
              className={clsx(error ? 'border-yellow' : 'border-slate-500')}
              {...props}
            />
            <label htmlFor={name}>{label}</label>
            {isLoading && (
              <Loader2 className="pointer-events-none absolute right-[.9rem] top-[.9rem] size-icon animate-spin" />
            )}
            <Popover.Trigger inert className="w-full" />
          </div>
          {error && <div className="mt-1 text-sm text-yellow">{t('pleaseSelectAnOption')}</div>}
          <Popover.Content
            onFocus={show}
            onBlur={() => {
              requestAnimationFrame(() => {
                if (!focusRegionRef.current?.contains(document.activeElement)) close()
              })
            }}
            className="inset-0 z-20 w-anchor-width bg-slate-700 p-4 shadow-xl md:inset-auto md:mt-1 md:rounded-lg"
          >
            {isLoading ? (
              <div className="grid h-full w-full place-content-center p-4">
                <Loader2 className="size-icon animate-spin" />
              </div>
            ) : items.length > 0 ? (
              <ul className="w-full">
                {items.map(item => (
                  <ResultItem
                    key={item.id}
                    item={item}
                    close={close}
                    onAutocomplete={onAutocomplete}
                  />
                ))}
              </ul>
            ) : (
              <div className="p-2 text-slate-300">{t('noResultsFound')}</div>
            )}
          </Popover.Content>
        </div>
      )}
    </Popover.Root>
  )
}

AutocompleteField.displayName = 'AutocompleteField'

function ResultItem<TId extends string | number = number>({
  item,
  close,
  onAutocomplete,
}: {
  item: ListItem<TId>
  close: () => void
  onAutocomplete: (value: ListItem<TId> | null) => void
}) {
  const locale = useLocale()
  const { address } = item as ListItem<TId> & {
    address: GeoapifyFeature['properties']
  }
  const addressParts = [
    [address.street, address.housenumber].filter(Boolean).join(' '),
    [address.postcode, address.city].filter(Boolean).join(' '),
    getCountryName(address.country_code.toUpperCase(), locale),
  ]
  const Icon = resultTypeIcons[address.result_type] ?? BirdIcon

  return (
    <li key={item.id}>
      <button
        type="button"
        role="option"
        onClick={() => {
          onAutocomplete(item)
          close()
        }}
        className="flex w-full items-center gap-3 rounded px-2 py-1.5 text-left hover:bg-slate-600"
      >
        <Icon className="size-icon text-slate-300" />
        <div>
          <div>{item.name}</div>
          <small className="text-slate-300">{addressParts.filter(Boolean).join(', ')}</small>
        </div>
      </button>
    </li>
  )
}
