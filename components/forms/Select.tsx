import { useEffect, useRef } from 'react'
import { ListItem } from '../../types/types'
import { CheckBoxGroup } from './CheckBoxGroup'
import { RadioGroup } from './RadioGroup'
import { SearchField } from './SearchField'
import { Loader2 } from 'lucide-react'
import clsx from 'clsx'
import { useTranslations } from 'next-intl'

type SingleSelectProps = {
  multiple?: false
  value: number | null
  onValueChange: (value: number) => void
}

type MultiSelectProps = {
  multiple: true
  values: number[]
  onValuesChange: (values: number[]) => void
}

export type SelectProps = {
  name: string
  items: ListItem[]
  isLoading?: boolean
  fixedHeight?: boolean
} & (
  | { searchable?: false }
  | { searchable: true; searchQuery: string; setSearchQuery: (query: string) => void }
)
export const Select = ({
  name,
  items,
  isLoading,
  fixedHeight,
  ...props
}: SelectProps & (SingleSelectProps | MultiSelectProps)) => {
  const searchRef = useRef<HTMLInputElement>(null)
  const t = useTranslations('Select')

  useEffect(() => {
    if (searchRef.current && props.multiple && props.searchable && props.searchQuery) {
      searchRef.current.select()
    }
  }, ['values' in props && props.values?.length])

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
