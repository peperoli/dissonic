import { ChevronDownIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import { forwardRef } from 'react'
import { FieldError } from 'react-hook-form'
import { Option } from '../../types/types'

type SelectProps = {
  name: string
  label: string
  options: Option[]
  placeholder?: string
  error?: FieldError
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ name, label, options, placeholder = '', error, ...props }, ref) => {
    return (
      <div className="form-control">
        <select
          ref={ref}
          id={name}
          name={name}
          placeholder={placeholder}
          className={clsx(error ? 'border-yellow' : 'border-slate-500')}
          {...props}
        >
          <option value="" hidden>
            Bitte wählen ...
          </option>
          {options.map(item => (
            <option value={item.id} key={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <label htmlFor={name}>{label}</label>
        <ChevronDownIcon className="absolute right-[18px] top-[18px] h-icon pointer-events-none" />
        {error && <span className="mt-1 text-sm text-yellow">Bitte wähle eine Option aus.</span>}
      </div>
    )
  }
)

Select.displayName = 'Select'
