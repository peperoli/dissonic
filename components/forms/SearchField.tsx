import { Search, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ChangeEvent, forwardRef } from 'react'

type SearchFieldProps = {
  name: string
  placeholder?: string
  query: string
  setQuery: (query: string) => void
}

export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(
  ({ name, placeholder, query, setQuery }, ref) => {
    const t = useTranslations('SearchField')

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
      setQuery(event.target.value)
    }

    return (
      <div className="form-control">
        <Search className="absolute top-1/2 ml-3 size-icon -translate-y-1/2" />
        <input
          ref={ref}
          type="search"
          name={name}
          id={name}
          placeholder={placeholder ?? t('search')}
          value={query}
          onChange={handleChange}
          className="min-w-48 !pl-10"
        />
        {query && (
          <button onClick={() => setQuery('')} className="btn btn-icon btn-small absolute right-0 m-1">
            <span className="sr-only">Suche zurücksetzen</span>
            <X className="size-icon" />
          </button>
        )}
        <label htmlFor={name} className="sr-only">
          Suchen
        </label>
      </div>
    )
  }
)

SearchField.displayName = 'SearchField'
