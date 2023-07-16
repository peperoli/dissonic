import clsx from 'clsx'
import { forwardRef } from 'react'
import { FieldError } from 'react-hook-form'

type TextFieldProps = {
  name: string
  label: string
  type?: string
  placeholder?: string
  error?: FieldError
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ name, label, type = 'text', placeholder = '', error, ...props }, ref) => {
    return (
      <div className="form-control">
        <input
          ref={ref}
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          className={clsx(error ? 'border-yellow' : 'border-slate-500')}
          {...props}
        />
        <label htmlFor={name}>{label}</label>
        {error && <span className="mt-1 text-sm text-yellow">Bitte fülle dieses Feld aus.</span>}
      </div>
    )
  }
)

TextField.displayName = 'TextField'
