import clsx from 'clsx'
import { forwardRef } from 'react'
import { SpinnerIcon } from './layout/SpinnerIcon'

type ButtonProps = {
  onClick?: any
  type?: 'button' | 'submit' | 'reset' | undefined
  label: string
  style?: 'primary' | 'secondary' | 'tag'
  contentType?: 'text' | 'icon'
  icon?: JSX.Element | string
  disabled?: boolean
  loading?: boolean
  size?: 'small' | 'medium'
  danger?: boolean
  className?: string
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      onClick,
      type = 'button',
      label,
      style = 'secondary',
      contentType = 'text',
      icon,
      disabled,
      loading,
      size = 'medium',
      danger,
      className,
    },
    ref
  ) => {
    return (
      <button
        type={type || 'button'}
        onClick={onClick}
        disabled={disabled || loading}
        className={clsx(
          'btn',
          style === 'primary' && 'btn-primary',
          style === 'secondary' && 'btn-secondary',
          style === 'tag' && 'btn-tag',
          contentType === 'icon' && 'btn-icon',
          size === 'small' && 'btn-small',
          danger && 'btn-danger',
          className
        )}
      >
        {loading && <SpinnerIcon className="absolute h-icon animate-spin" />}
        <span
          className={clsx(
            'flex gap-2 items-center',
            loading && 'opacity-0',
            style === 'tag' && 'flex-row-reverse'
          )}
        >
          <>
            {icon}
            <span className={`${contentType === 'icon' ? ' sr-only ' : ''}`}>{label}</span>
          </>
        </span>
      </button>
    )
  }
)
Button.displayName = 'Button'
