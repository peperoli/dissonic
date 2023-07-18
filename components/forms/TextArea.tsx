import clsx from 'clsx'
import { forwardRef } from 'react'
import { FieldError } from 'react-hook-form'

type TextAreaProps = {
  name: string
  label: string
  placeholder?: string
  error?: FieldError
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ name, label, placeholder = '', error, ...props }, ref) => {
    return (
      <div className="form-control">
        <textarea
          ref={ref}
          id={name}
          name={name}
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

TextArea.displayName = 'TextArea'
