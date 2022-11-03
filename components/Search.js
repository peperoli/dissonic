import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid"

export default function Search({ name, placeholder, query, setQuery }) {
  function handleChange(event) {
    setQuery(event.target.value)
  }
  return (
    <div className="form-control">
      <MagnifyingGlassIcon className="h-icon absolute top-1/2 ml-3 transform -translate-y-1/2" />
      <input
        type="search"
        name={name}
        id={name}
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        className="!pl-10"
      />
      {query && (
        <button onClick={() => setQuery('')} className="btn btn-icon absolute right-0">
          <span className="sr-only">Suche zurücksetzen</span>
          <XMarkIcon className="h-icon" />
        </button>
      )}
      <label htmlFor={name} className="sr-only">Suchen</label>
    </div>
  )
}