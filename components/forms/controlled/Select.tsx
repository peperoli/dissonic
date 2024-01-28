import {
  CheckIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { FieldError } from 'react-hook-form'
import { ListItem } from '../../../types/types'
import { normalizeString } from '../../../lib/normalizeString'
import { Button } from '../../Button'

type SelectProps = {
  label: string
  options: ListItem[]
  value: number | null
  onValueChange: (value: number) => void
  error?: FieldError
}

export const Select = ({ label, options, value, onValueChange, error }: SelectProps) => {
  const selectedOption = options.find(item => item.id === value)
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const regExp = new RegExp(normalizeString(query), 'iu')
  const filteredOptions =
    query === '' ? options : options.filter(option => normalizeString(option.name).match(regExp))

  useEffect(() => {
    if (isOpen) {
      searchRef.current?.focus()
    }
  }, [isOpen])
  return (
    <div className="relative">
      <div className="form-control">
        <button
          type="button"
          aria-label={label}
          onClick={() => setIsOpen(!isOpen)}
          className={clsx('form-input text-left', error ? 'border-yellow' : 'border-slate-500')}
        >
          {selectedOption?.name || 'Bitte wählen ...'}
        </button>
        <label className="form-label">{label}</label>
        <ChevronDownIcon className="absolute right-[18px] top-[18px] h-icon pointer-events-none" />
      </div>
      {isOpen && (
        <>
        <div className='fixed md:hidden z-20 inset-0 bg-black opacity-30' />
        <div className="fixed md:absolute z-20 grid content-start inset-8 md:inset-auto md:mt-1 md:w-full p-4 rounded-lg bg-slate-700">
          <div className="flex md:hidden justify-between items-center mb-2">
            <h2 className="mb-0">{label}</h2>
            <Button
              label="Schließen"
              onClick={() => setIsOpen(false)}
              size="small"
              icon={<XMarkIcon className="h-icon" />}
              contentType="icon"
              appearance="tertiary"
            />
          </div>
          <div className="form-control">
            <div className="flex items-center w-full">
              <MagnifyingGlassIcon className="h-icon absolute ml-4 pointer-events-none" />
              <input
                ref={searchRef}
                type="search"
                aria-label="Suche"
                autoComplete="off"
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder="Suchbegriff eingeben ..."
                className="!pl-12"
              />
            </div>
          </div>
          <ul className="max-h-full md:max-h-56 overflow-auto py-2">
            {filteredOptions.map(option => (
              <li
                onClick={() => {
                  onValueChange(option.id)
                  setIsOpen(false)
                }}
                className={clsx(
                  'flex items-center gap-2 p-1 rounded-md cursor-pointer',
                  'hover:bg-slate-600'
                )}
                key={option.id}
              >
                <CheckIcon
                  className={clsx(
                    'h-icon text-venom',
                    selectedOption?.id !== option.id && 'invisible'
                  )}
                />
                {option.name}
              </li>
            ))}
          </ul>
        </div>
        </>
      )}
      {error && <div className="mt-1 text-sm text-yellow">Bitte wähle eine Option aus.</div>}
    </div>
  )
}
