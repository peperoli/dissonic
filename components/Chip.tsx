import { XMarkIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import { HTMLAttributes, MouseEventHandler, TouchEventHandler } from 'react'

type ChipProps = {
  label: string
  remove?: () => void
  onMouseDown?: MouseEventHandler
  onTouchStart?: TouchEventHandler
  size?: 'small' | 'medium'
  className?: string
  style?: HTMLAttributes<HTMLDivElement>['style']
}

export const Chip = ({
  label,
  size = 'medium',
  onMouseDown,
  onTouchStart,
  remove,
  className,
}: ChipProps) => {
  const ConditionalTag = onMouseDown ? 'button' : 'div'
  return (
    <div tabIndex={0} className={clsx('btn btn-tag', size === 'small' && 'btn-small', className)}>
      <ConditionalTag type="button" onMouseDown={onMouseDown} onTouchStart={onTouchStart}>
        {label}
      </ConditionalTag>
      {remove && (
        <button type="button" onClick={remove}>
          <XMarkIcon className="h-icon text-slate-300" />
        </button>
      )}
    </div>
  )
}
Chip.displayName = 'Chip'
