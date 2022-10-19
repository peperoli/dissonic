import { MagnifyingGlassIcon } from "@heroicons/react/24/solid"

export default function Search({ name, query, setQuery }) {
  function handleChange(event) {
    setQuery(event.target.value)
  }
  return (
    <div className="form-control">
      <MagnifyingGlassIcon className="h-text absolute top-1/2 ml-3 transform -translate-y-1/2" />
      <input
        type="search"
        name={name}
        id={name}
        placeholder="Suchen"
        value={query}
        onChange={handleChange}
        className="!pl-10"
      />
      <label htmlFor={name} className="!ml-10">Suchen</label>
    </div>
  )
}