import clsx from 'clsx'
import { forwardRef, HTMLAttributes } from 'react'
import { SpinnerIcon } from './layout/SpinnerIcon'

type ButtonProps = {
  type?: 'button' | 'submit' | 'reset' | undefined
  label: string
  appearance?: 'primary' | 'secondary' | 'tag'
  contentType?: 'text' | 'icon'
  icon?: JSX.Element | string
  loading?: boolean
  disabled?: boolean
  size?: 'small' | 'medium'
  danger?: boolean
} & HTMLAttributes<HTMLButtonElement>

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      type = 'button',
      label,
      appearance = 'secondary',
      contentType = 'text',
      icon,
      loading,
      disabled,
      size = 'medium',
      danger,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <button
        type={type}
        ref={ref}
        disabled={disabled || loading}
        className={clsx(
          'btn',
          appearance === 'primary' && 'btn-primary',
          appearance === 'secondary' && 'btn-secondary',
          appearance === 'tag' && 'btn-tag',
          contentType === 'icon' && 'btn-icon',
          size === 'small' && 'btn-small',
          danger && 'btn-danger',
          className
        )}
        {...props}
      >
        {loading && <SpinnerIcon className="absolute h-icon animate-spin" />}
        <span
          className={clsx(
            'flex gap-2 items-center',
            loading && 'opacity-0',
            appearance === 'tag' && 'flex-row-reverse'
          )}
        >
          <>
            {icon && (
              <span className={clsx(appearance === 'tag' && 'p-0.5 rounded-full text-sm bg-slate-800')}>
                {icon}
              </span>
            )}{' '}
            <span className={`${contentType === 'icon' ? ' sr-only ' : ''}`}>{label}</span>
          </>
        </span>
      </button>
    )
  }
)
Button.displayName = 'Button'
