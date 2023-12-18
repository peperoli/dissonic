import { XMarkIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import { HTMLAttributes, MouseEventHandler } from 'react'

type ChipProps = {
  label: string
  remove?: () => void
  onMouseDown?: MouseEventHandler
  size?: 'small' | 'medium'
} & HTMLAttributes<HTMLDivElement>

export const Chip = ({ label, size = 'medium', remove, className, ...props }: ChipProps) => {
  return (
    <div
      role={props.onMouseDown ? 'button' : undefined}
      tabIndex={0}
      className={clsx('btn btn-tag', size === 'small' && 'btn-small', className)}
      {...props}
    >
      {label}
      {remove && (
        <button
          type="button"
          onClick={event => {
            event.stopPropagation()
            remove()
          }}
        >
          <XMarkIcon className="h-icon text-slate-300" />
        </button>
      )}
    </div>
  )
}
Chip.displayName = 'Chip'
