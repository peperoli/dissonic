import clsx from 'clsx'
import { forwardRef, HTMLAttributes, ReactElement } from 'react'
import { Loader2 } from 'lucide-react'
import * as Tooltip from '@radix-ui/react-tooltip'

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

function IconButton({ ...props }) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger />
      <Tooltip.Portal>
        <Tooltip.Content>
          <Tooltip.Arrow />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  )
}

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
        <Tooltip.Root>
          <Tooltip.Trigger
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
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              sideOffset={2}
              className="z-10 max-w-72 rounded-lg border border-slate-800 bg-slate-900 p-2 text-sm shadow-lg"
            >
              {label}
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
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
