import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid"
import { useState, useRef } from "react"

function SelectedOption({ selectedOption, selectedOptions, setSelectedOptions }) {
  function handleClick() {
    setSelectedOptions(selectedOptions.filter(item => item.id !== selectedOption.id))
  }
  return (
    <button
      className="btn btn-tag"
      onClick={handleClick}
    >
      {selectedOption.name}
      <XMarkIcon className="h-text" />
    </button>
  )
}

function MultiSelectOption({ option, selectedOptions, setSelectedOptions, setQuery, searchRef }) {
  const isSelected = selectedOptions.some(item => item.id === option.id)

  function handleChange() {
    if (selectedOptions.some(item => item.id === option.id)) {
      setSelectedOptions(selectedOptions.filter(item => item.id !== option.id))
    } else {
      setSelectedOptions([
        ...selectedOptions,
        option
      ])
    }
    setQuery('')
    searchRef.current.focus()
  }

  return (
    <label className="flex gap-2 w-full px-2 py-1.5 rounded hover:bg-slate-500">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={handleChange}
      />
      {option.name}
    </label>
  )
}

export default function MultiSelect({ name, options, selectedOptions, setSelectedOptions }) {
  const [query, setQuery] = useState('')

  function handleChange(event) {
    setQuery(event.target.value)
  }

  const searchRef = useRef(null)
  const regExp = new RegExp(query, 'i')
  const filteredOptions = options.filter(option => option.name.match(regExp))
  return (
    <div className="relative w-full">
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedOptions.map(selectedOption => (
            <SelectedOption
              key={selectedOption.id}
              selectedOption={selectedOption}
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
            />
          ))}
        </div>
      )}
      <div className="form-control">
        <MagnifyingGlassIcon className="h-text absolute top-1/2 ml-3 transform -translate-y-1/2 pointer-events-none" />
        <input
          ref={searchRef}
          type="search"
          name={name}
          id={name}
          placeholder="Suchen"
          value={query}
          onChange={handleChange}
          className="!pl-10"
        />
        <label htmlFor={name} className="!ml-10 capitalize">{name}</label>
      </div>
      {query && (
        <div className="form-control absolute w-full max-h-72 mt-1 p-2 rounded-lg bg-slate-600 overflow-auto shadow-lg z-20">
          {filteredOptions.length > 0 ? filteredOptions.map(option => (
            <MultiSelectOption
              key={option.id}
              option={option}
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
              setQuery={setQuery}
              searchRef={searchRef}
            />
          )) : <div className="p-2 text-slate-300">Versuchs mal mit einem vernünftigen Suchbegriff.</div>}
        </div>
      )}
    </div>
  )
}