import { Search, X } from 'lucide-react'
import { ChangeEvent, forwardRef } from 'react'

type SearchFieldProps = {
  name: string
  placeholder?: string
  query: string
  setQuery: (query: string) => void
}

export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(
  ({ name, placeholder = 'Suchen', query, setQuery }, ref) => {
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
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          className="min-w-48 !pl-10"
        />
        {query && (
          <button onClick={() => setQuery('')} className="btn btn-icon absolute right-0">
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
