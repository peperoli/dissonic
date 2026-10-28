import { useEffect, useRef } from 'react'
import { ListItem } from '../../types/types'
import { CheckBoxGroup } from './CheckBoxGroup'
import { RadioGroup } from './RadioGroup'
import { SearchField } from './SearchField'
import { Loader2 } from 'lucide-react'
import clsx from 'clsx'
import { useTranslations } from 'next-intl'

type SingleSelectProps<TId extends string | number> = {
  multiple?: false
  value: TId | null
  onValueChange: (value: TId) => void
}

type MultiSelectProps<TId extends string | number> = {
  multiple: true
  values: TId[]
  onValuesChange: (values: TId[]) => void
}

export type SelectProps<TId extends string | number = number> = {
  name: string
  items: ListItem<TId>[]
  isLoading?: boolean
  onScrollToEnd?: () => void
  fixedHeight?: boolean
} & (
  | { searchable?: false }
  | { searchable: true; searchQuery: string; setSearchQuery: (query: string) => void }
)
export const Select = <TId extends string | number = number>({
  name,
  items,
  isLoading,
  onScrollToEnd,
  fixedHeight,
  ...props
}: SelectProps<TId> & (SingleSelectProps<TId> | MultiSelectProps<TId>)) => {
  const searchRef = useRef<HTMLInputElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const t = useTranslations('Select')

  useEffect(() => {
    if (searchRef.current && props.multiple && props.searchable && props.searchQuery) {
      searchRef.current.select()
    }
  }, ['values' in props && props.values?.length])

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    function handleScroll() {
      if (!scrollContainer || !onScrollToEnd) return

      const scrollPosition = Math.round(scrollContainer.scrollTop + scrollContainer.clientHeight)
      const containerHeight = scrollContainer.scrollHeight

      if (scrollPosition >= containerHeight) {
        onScrollToEnd()
      }
    }

    scrollContainer.addEventListener('scroll', handleScroll)

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      {props.searchable && (
        <SearchField
          ref={searchRef}
          name={`${name}-search`}
          query={props.searchQuery}
          setQuery={props.setSearchQuery}
        />
      )}
      <div
        ref={scrollContainerRef}
        className={clsx(
          'size-full overflow-auto',
          props.searchable && 'pt-2',
          fixedHeight ? 'md:h-72' : 'md:max-h-72'
        )}
      >
        {isLoading ? (
          <div className="grid h-full w-full place-content-center p-4">
            <Loader2 className="size-icon animate-spin" />
          </div>
        ) : (
          <>
            {items.length > 0 ? (
              props.multiple ? (
                <CheckBoxGroup name={name} items={items} {...props} />
              ) : (
                <RadioGroup name={name} items={items} {...props} />
              )
            ) : (
              <div className="p-2 text-slate-300">{t('tryUsingASensibleSearchTerm')}</div>
            )}
          </>
        )}
      </div>
    </>
  )
}
