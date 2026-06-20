import { KeyboardEvent, ReactNode, RefObject, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useHits, useInstantSearch, useSearchBox } from 'react-instantsearch'
import { CheckIcon, PlusCircleIcon, XCircleIcon } from 'lucide-react'
import clsx from 'clsx'
import { Band, ReorderableListItem } from '../../../types/types'
import { BandItem } from './BandItem'
import { useListManager } from './Context'
import { BandRecord } from '@/types/algolia'

type SearchResultProps = {
  ref: RefObject<HTMLButtonElement | null>
  band: ReorderableListItem<Band>
  index: number
  selected: boolean
  addItem: () => void
  removeItem: () => void
  handleKeyNavigation: (event: KeyboardEvent<HTMLButtonElement>, index: number) => void
}

const SearchResult = ({
  ref,
  band,
  index,
  selected,
  addItem,
  removeItem,
  handleKeyNavigation,
}: SearchResultProps) => {
  const t = useTranslations('ListManager')

  return (
    <button
      ref={ref}
      onClick={selected ? removeItem : addItem}
      onKeyDown={e => handleKeyNavigation(e, index)}
      aria-label={selected ? t('removeEntry') : t('addEntry')}
      className={clsx('flex gap-4 rounded-lg p-2 text-left hover:bg-slate-700')}
    >
      <BandItem band={band} />
      {selected ? (
        <div className="flex flex-none">
          <div className="btn btn-icon btn-tertiary">
            <XCircleIcon className="size-icon text-red" />
          </div>
          <div className="btn btn-icon">
            <CheckIcon className="size-icon text-slate-300" />
          </div>
        </div>
      ) : (
        <div className="btn btn-icon btn-tertiary flex-none">
          <PlusCircleIcon className="size-icon text-venom" />
        </div>
      )}
    </button>
  )
}

export const ListManagerSearch = () => {
  const { indexUiState } = useInstantSearch()

  if (indexUiState?.query?.length) {
    return (
      <div className="grid content-start py-6">
        <NoResultsBoundary>
          <CustomHits />
        </NoResultsBoundary>
      </div>
    )
  }

  return null
}

function NoResultsBoundary({ children }: { children: ReactNode }) {
  const { results, indexUiState } = useInstantSearch()
  const t = useTranslations('SearchForm')

  if (!results.__isArtificial && results.nbHits === 0) {
    return (
      <>
        <div>
          <p className="text-slate-300">{t('noResults', { query: indexUiState.query })}</p>
        </div>
        <div hidden>{children}</div>
      </>
    )
  }

  return children
}

function CustomHits() {
  const {
    listItems,
    setListItems,
    removeItem,
    queryHook,
    searchRef,
    itemsRef,
    scrollContainerRef,
  } = useListManager()
  const { items: hits } = useHits<BandRecord>()
  const { clear } = useSearchBox({ queryHook })

  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, listItems.length)
  }, [listItems.length, itemsRef])

  function handleKeyNavigation(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === 'ArrowUp' && index > 0) {
      itemsRef.current[index - 1]?.focus()
    } else if (event.key === 'ArrowDown' && index < hits.length - 1) {
      itemsRef.current[index + 1]?.focus()
    }
  }

  function addItem(searchResult: ReorderableListItem<Band>) {
    setListItems([...listItems, { ...searchResult, item_index: listItems.length }])
    clear()
    searchRef.current?.focus()
    setTimeout(() => {
      const scrollHeight = scrollContainerRef.current?.scrollHeight
      scrollContainerRef.current?.scrollTo({ top: scrollHeight })
    }, 50)
  }

  return (
    <>
      {hits.map((hit, index) => {
        const searchResult = {
          id: hit.id,
          name: hit.name,
          alt_names: hit.alt_names,
          country: hit.country,
          genres: hit.genres,
          spotify_artist_id: hit.spotify_artist_id,
          spotify_artist_images: hit.spotify_artist_images,
          item_index: null,
        } as ReorderableListItem<Band>
        return (
          <SearchResult
            key={searchResult.id}
            // @ts-expect-error - ref could be null, but it won't
            ref={el => (itemsRef.current[index] = el)}
            band={searchResult}
            index={index}
            selected={!!listItems.find(item => searchResult.id === item.id)}
            handleKeyNavigation={handleKeyNavigation}
            addItem={() => addItem(searchResult)}
            removeItem={() => removeItem(searchResult.id)}
          />
        )
      })}
    </>
  )
}
