import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid"
import { useState } from "react"

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

function MultiSelectOption({ option, selectedOptions, setSelectedOptions }) {
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
  }

  return (
    <label className="flex gap-2 px-2 py-1.5 rounded hover:bg-slate-500">
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

  const regExp = new RegExp(query, 'i')
  const filteredOptions = options.filter(option => option.name.match(regExp))
  return (
    <div className="relative">
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
      <div className="relative flex items-center">
        <MagnifyingGlassIcon className="h-text absolute ml-3" />
        <input
          type="search"
          name={name}
          id={name}
          placeholder="Suchen"
          value={query}
          onChange={handleChange}
          className="!pl-10"
        />
      </div>
      {query && (
        <div className="absolute w-full max-h-72 mt-1 p-2 rounded-lg bg-slate-600 overflow-auto shadow-lg">
          {filteredOptions.length > 0 ? filteredOptions.map(option => (
            <MultiSelectOption
              key={option.id}
              option={option}
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
            />
          )) : <div className="p-2 text-slate-300">Versuchs mal mit einem gültigen Suchbegriff.</div>}
        </div>
      )}
    </div>
  )
}