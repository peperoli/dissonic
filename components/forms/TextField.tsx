import { EyeIcon, EyeOffIcon } from 'lucide-react'
import clsx from 'clsx'
import { forwardRef, HTMLInputTypeAttribute, useState } from 'react'
import { FieldError } from 'react-hook-form'
import { Button } from '../Button'
import { useTranslations } from 'next-intl'

type TextFieldProps = {
  name: string
  label: string
  type?: HTMLInputTypeAttribute
  placeholder?: string
  error?: FieldError
  autoComplete?: 'on' | 'off'
  grouped?: 'start' | 'end'
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ name, label, type = 'text', placeholder = '', error, grouped, ...props }, ref) => {
    const [inputType, setInputType] = useState(type)
    const t = useTranslations('TextField')

    return (
      <div className="form-control">
        <input
          ref={ref}
          id={name}
          name={name}
          type={inputType}
          placeholder={placeholder}
          className={clsx(
            type === 'password' && '!pr-14',
            error ? 'border-yellow' : 'border-slate-500',
            grouped === 'start' && '!rounded-r-none',
            grouped === 'end' && '!rounded-l-none !border-l-transparent'
          )}
          {...props}
        />
        <label htmlFor={name}>{label}</label>
        {type === 'password' && (
          <Button
            label={inputType === 'password' ? t('showPassword') : t('hidePassword')}
            onClick={() => setInputType(inputType === 'password' ? 'text' : 'password')}
            icon={
              inputType === 'password' ? (
                <EyeIcon className="size-icon" />
              ) : (
                <EyeOffIcon className="size-icon" />
              )
            }
            contentType="icon"
            size="small"
            className="absolute right-0 m-[11px]"
          />
        )}
        {error && (
          <span className="mt-1 text-sm text-yellow">
            {error.message || t('pleaseFillOutThisField')}
          </span>
        )}
      </div>
    )
  }
)

TextField.displayName = 'TextField'
