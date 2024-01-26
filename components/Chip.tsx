import { XMarkIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import { HTMLAttributes, PointerEventHandler } from 'react'

type ChipProps = {
  label: string
  remove?: () => void
  onPointerDown?: PointerEventHandler
  size?: 'small' | 'medium'
  className?: string
  style?: HTMLAttributes<HTMLDivElement>['style']
}

export const Chip = ({ label, size = 'medium', onPointerDown, remove, className, style }: ChipProps) => {
  const ConditionalTag = onPointerDown ? 'button' : 'div'
  return (
    <div tabIndex={0} className={clsx('btn btn-tag', size === 'small' && 'btn-small', className)} style={style}>
      <ConditionalTag type="button" onPointerDown={onPointerDown}>
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
