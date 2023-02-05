import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid"
import React, { useState, useRef, FC, Dispatch, RefObject, SetStateAction } from "react"
import { Option } from "../types/types"

interface SelectedOptionProps {
  selectedOption: Option
  selectedOptions: Option[]
  setSelectedOptions: Dispatch<SetStateAction<any[]>>
}

const SelectedOption: FC<SelectedOptionProps> = ({
  selectedOption,
  selectedOptions,
  setSelectedOptions,
}) => {
  function handleClick() {
    setSelectedOptions(selectedOptions.filter(item => item.id !== selectedOption.id))
  }
  return (
    <button className="btn btn-tag" onClick={handleClick}>
      {selectedOption.name}
      <XMarkIcon className="h-icon" />
    </button>
  )
}

interface MultiSelectOptionProps {
  option: Option
  selectedOptions: Option[]
  setSelectedOptions: Dispatch<SetStateAction<any[]>>
  setQuery: Dispatch<SetStateAction<string>>
  searchRef: RefObject<HTMLInputElement>
}

const MultiSelectOption: FC<MultiSelectOptionProps> = ({
  option,
  selectedOptions,
  setSelectedOptions,
  setQuery,
  searchRef,
}) => {
  const isSelected = selectedOptions.some(item => item.id === option.id)

  function handleChange() {
    if (selectedOptions.some(item => item.id === option.id)) {
      setSelectedOptions(selectedOptions.filter(item => item.id !== option.id))
    } else {
      setSelectedOptions([...selectedOptions, option])
    }
    setQuery('')
    searchRef.current?.focus()
  }

  return (
    <label className="flex gap-2 w-full px-2 py-1.5 rounded hover:bg-slate-600">
      <input type="checkbox" checked={isSelected} onChange={handleChange} />
      {option.name}
    </label>
  )
}

interface MultiSelectProps {
  name: string
  options: Option[]
  selectedOptions: Option[]
  setSelectedOptions: Dispatch<SetStateAction<any[]>>
  alwaysOpen?: boolean
  fullHeight?: boolean
}

export const MultiSelect: FC<MultiSelectProps> = ({
  name,
  options,
  selectedOptions,
  setSelectedOptions,
  alwaysOpen,
  fullHeight,
}) => {
  const [query, setQuery] = useState('')

  const searchRef = useRef<HTMLInputElement>(null)
  const regExp = new RegExp(query, 'i')
  const filteredOptions = options.filter(option => option.name?.match(regExp))

  function capitalize(string: string) {
    const arr = string.split(' ')

    const newArr = arr.map(item => item.charAt(0).toUpperCase() + item.slice(1)).join(' ')

    return newArr
  }
  return (
    <div
      className={`w-full h-full${
        alwaysOpen && fullHeight ? ' absolute md:relative flex flex-col' : ' relative'
      }`}
    >
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
        <MagnifyingGlassIcon className="h-icon absolute top-1/2 ml-3 transform -translate-y-1/2 pointer-events-none" />
        <input
          ref={searchRef}
          type="search"
          name={name}
          id={name}
          placeholder={capitalize(name)}
          value={query}
          onChange={event => setQuery(event.target.value)}
          className="!pl-10"
        />
        <label htmlFor={name} className="sr-only">
          {name}
        </label>
      </div>
      {(query || alwaysOpen) && (
        <div
          className={`form-control w-full mt-1 p-2 rounded-lg bg-slate-700 overflow-auto${
            alwaysOpen ? '' : ' absolute shadow-lg z-20'
          }${fullHeight ? ' max-h-full md:max-h-72' : ' max-h-72'}`}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map(option => (
              <MultiSelectOption
                key={option.id}
                option={option}
                selectedOptions={selectedOptions}
                setSelectedOptions={setSelectedOptions}
                setQuery={setQuery}
                searchRef={searchRef}
              />
            ))
          ) : (
            <div className="p-2 text-slate-300">
              Versuchs mal mit einem vernünftigen Suchbegriff.
            </div>
          )}
        </div>
      )}
    </div>
  )
}