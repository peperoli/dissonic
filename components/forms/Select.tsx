import { useEffect, useRef, useState } from 'react'
import { ListItem } from '../../types/types'
import { normalizeString } from '../../lib/normalizeString'
import { CheckBoxGroup } from './CheckBoxGroup'
import { RadioGroup } from './RadioGroup'
import { SearchField } from './SearchField'
import { Loader2 } from 'lucide-react'
import clsx from 'clsx'

export type SelectProps = {
  name: string
  items?: ListItem[]
  isLoading?: boolean
  fixedHeight?: boolean
} & (
  | { multiple?: false; value: number | null; onValueChange: (value: number) => void }
  | { multiple: true; values: number[]; onValuesChange: (values: number[]) => void }
)
export const Select = ({ name, items, isLoading, fixedHeight, ...props }: SelectProps) => {
  const [query, setQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)
  const regExp = new RegExp(normalizeString(query), 'iu')
  const filteredOptions = items?.filter(item => normalizeString(item.name).match(regExp))

  useEffect(() => {
    if (searchRef.current && query) {
      searchRef.current.select()
    }
    // @ts-expect-error
  }, [props.values, props.value])
  return (
    <>
      <SearchField ref={searchRef} name={`${name}-search`} query={query} setQuery={setQuery} />
      <div className={clsx('size-full overflow-auto p-2', fixedHeight ? 'md:h-72' : 'md:max-h-72')}>
        {isLoading ? (
          <div className="grid h-full w-full place-content-center p-4">
            <Loader2 className="size-8 animate-spin" />
          </div>
        ) : (
          <>
            {filteredOptions && filteredOptions.length > 0 ? (
              props.multiple ? (
                <CheckBoxGroup name={name} items={filteredOptions} {...props} />
              ) : (
                <RadioGroup name={name} items={filteredOptions} {...props} />
              )
            ) : (
              <div className="p-2 text-slate-300">
                Versuchs mal mit einem vernünftigen Suchbegriff.
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
