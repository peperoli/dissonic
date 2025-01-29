import clsx from 'clsx'
import { forwardRef, HTMLAttributes, ReactElement } from 'react'
import { Loader2 } from 'lucide-react'
import { Tooltip } from './shared/Tooltip'

type ButtonProps = {
  type?: 'button' | 'submit' | 'reset' | undefined
  label: string
  appearance?: 'primary' | 'secondary' | 'tertiary'
  contentType?: 'text' | 'icon'
  icon?: ReactElement | string
  loading?: boolean
  disabled?: boolean
  size?: 'small' | 'medium'
  block?: boolean
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
      block,
      danger,
      className,
      ...props
    },
    ref
  ) => {
    if (contentType === 'icon') {
      return (
        <Tooltip content={label}>
          <button
            type={type}
            ref={ref}
            disabled={disabled || loading}
            className={clsx(
              'btn btn-icon',
              appearance === 'primary' && 'btn-primary',
              appearance === 'secondary' && 'btn-secondary',
              appearance === 'tertiary' && 'btn-tertiary',
              size === 'small' && 'btn-small',
              block && 'btn-block',
              danger && 'btn-danger',
              className
            )}
            {...props}
          >
            {loading ? <Loader2 className="absolute size-icon animate-spin" /> : icon}
          </button>
        </Tooltip>
      )
    }

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
          size === 'small' && 'btn-small',
          block && 'btn-block',
          danger && 'btn-danger',
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="absolute size-icon animate-spin" />}
        <span className={clsx('flex items-center gap-2', loading && 'opacity-0')}>
          {icon}
          {label}
        </span>
      </button>
    )
  }
)
Button.displayName = 'Button'
