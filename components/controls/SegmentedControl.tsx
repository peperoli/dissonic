import clsx from 'clsx'
import { LucideIcon } from 'lucide-react'

type SegmentedControlProps = {
  options: { value: string; label: string; icon?: LucideIcon }[]
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
    <fieldset className="flex w-full rounded-lg bg-slate-750 p-1 md:w-fit">
      {options.map(option => (
        <button
          type="button"
          onClick={() => onValueChange(option.value)}
          className={clsx(
            'flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-md px-2 py-1 md:w-fit md:flex-none',
            option.value === value ? 'bg-slate-700 text-slate-50 shadow-lg' : 'text-slate-300'
          )}
          key={option.value}
        >
          {option.icon && <option.icon className="size-icon" />}
          <span className={clsx(iconOnly && 'sr-only')}>{option.label}</span>
        </button>
      ))}
    </fieldset>
  )
}
