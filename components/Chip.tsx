import clsx from 'clsx'
import { ConditionalLinkTag } from './helpers/ConditionalLinkTag'

type ChipProps = {
  label: string
  onClick?: () => void
  href?: string
  size?: 'md' | 'sm'
  count?: number
  color?: 'secondary' | 'purple' | 'blue'
}

export const Chip = ({
  label,
  onClick,
  href,
  size = 'md',
  count,
  color = 'secondary',
}: ChipProps) => {
  return (
    <ConditionalLinkTag
      onClick={onClick}
      href={href}
      className={clsx(
        'flex w-fit items-center justify-center border-2 disabled:cursor-not-allowed disabled:opacity-30',
        size === 'sm' && 'gap-1 rounded-2xl px-3 py-0.5 text-sm',
        size === 'md' && 'gap-2 rounded-3xl px-4 py-1',
        color === 'secondary' && 'border-slate-500 text-white',
        color === 'purple' && 'border-purple/50 text-purple',
        color === 'blue' && 'border-blue/50 text-blue',
        (onClick || href) && 'hover:underline'
      )}
    >
      {label}
      {count && count > 1 && (
        <div
          className={clsx(
            'min-w-4 rounded bg-slate-700 px-1 text-center',
            size === 'sm' && 'text-xs',
            size === 'md' && 'text-sm'
          )}
        >
          {count}
        </div>
      )}
    </ConditionalLinkTag>
  )
}
Chip.displayName = 'Chip'
