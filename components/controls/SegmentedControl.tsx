import clsx from 'clsx'
import { LucideIcon } from 'lucide-react'

type SegmentedControlProps = {
  options: { value: string; label: string; icon: LucideIcon }[]
  value: string
  onValueChange: (value: string) => void
  iconOnly?: boolean
}

export function SegmentedControl({
  options,
  value,
  onValueChange,
  iconOnly,
}: SegmentedControlProps) {
  return (
    <fieldset className="flex rounded-lg bg-slate-800 p-1">
      {options.map(option => (
        <button
          onClick={() => onValueChange(option.value)}
          className={clsx(
            'flex items-center gap-2 rounded-md px-2 py-1',
            option.value === value ? 'bg-slate-700 text-slate-50 shadow-lg' : 'text-slate-300'
          )}
          key={option.value}
        >
          {<option.icon className="size-icon" />}
          <span className={clsx(iconOnly && 'sr-only')}>{option.label}</span>
        </button>
      ))}
    </fieldset>
  )
}
