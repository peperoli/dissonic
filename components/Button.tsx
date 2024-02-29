import clsx from 'clsx'
import { forwardRef, HTMLAttributes, ReactElement } from 'react'
import { Loader2 } from 'lucide-react'

type ButtonProps = {
  type?: 'button' | 'submit' | 'reset' | undefined
  label: string
  appearance?: 'primary' | 'secondary' | 'tertiary'
  contentType?: 'text' | 'icon'
  icon?: ReactElement | string
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
          appearance === 'tertiary' && 'btn-tertiary',
          contentType === 'icon' && 'btn-icon',
          size === 'small' && 'btn-small',
          danger && 'btn-danger',
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="absolute h-icon animate-spin" />}
        <span className={clsx('flex gap-2 items-center', loading && 'opacity-0')}>
          {icon}
          <span className={`${contentType === 'icon' ? ' sr-only ' : ''}`}>{label}</span>
        </span>
      </button>
    )
  }
)
Button.displayName = 'Button'
