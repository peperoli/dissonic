import { SpinnerIcon } from '@/components/layout/SpinnerIcon'
import { SearchIcon, XIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { useState, RefObject } from 'react'
import { useInstantSearch, useSearchBox } from 'react-instantsearch'

export function SearchBox({ ref: inputRef }: { ref?: RefObject<HTMLInputElement | null> }) {
  const { query, refine } = useSearchBox()
  const { status } = useInstantSearch()
  const [inputValue, setInputValue] = useState(query)
  const isSearchStalled = status === 'stalled'
  const t = useTranslations('SearchField')

  function setQuery(newQuery: string) {
    setInputValue(newQuery)
    refine(newQuery)
  }

  return (
    <div className="w-full">
      <form
        action=""
        role="search"
        noValidate
        onSubmit={event => {
          event.preventDefault()
          event.stopPropagation()

          if (inputRef?.current) {
            inputRef.current.blur()
          }
        }}
        onReset={event => {
          event.preventDefault()
          event.stopPropagation()

          setQuery('')

          if (inputRef?.current) {
            inputRef.current.focus()
          }
        }}
        className="form-control"
      >
        <input
          ref={inputRef}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          placeholder={t('search')}
          spellCheck={false}
          maxLength={512}
          type="search"
          value={inputValue}
          onChange={event => {
            setQuery(event.currentTarget.value)
          }}
          autoFocus
          className="!pl-10"
        />
        <button type="submit" className="absolute top-1/2 ml-3 size-icon -translate-y-1/2">
          <SearchIcon className="size-icon" />
        </button>
        <button
          type="reset"
          hidden={inputValue.length === 0 || isSearchStalled}
          className="btn btn-icon btn-small absolute right-0 m-1 size-icon"
        >
          {status === 'loading' ? (
            <SpinnerIcon className="size-icon" />
          ) : (
            <XIcon className="size-icon" />
          )}
        </button>
        <span hidden={!isSearchStalled}>Searching…</span>
      </form>
    </div>
  )
}
