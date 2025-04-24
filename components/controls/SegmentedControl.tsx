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
    <div className="overflow-x-auto -mx-4 px-4">
      <fieldset className="flex w-full rounded-lg bg-slate-750 p-1 md:w-fit">
        {options.map(option => (
          <button
            type="button"
            onClick={() => onValueChange(option.value)}
            className={clsx(
              'flex min-w-12 w-fit items-center justify-center gap-2 whitespace-nowrap rounded-md px-2 py-1 md:flex-none',
              option.value === value ? 'bg-gradient-to-r from-blue/20 to-venom/20 text-white shadow-lg' : 'text-slate-300'
            )}
            key={option.value}
          >
            {option.icon && <option.icon className="size-icon" />}
            <span className={clsx(iconOnly && 'sr-only')}>{option.label}</span>
          </button>
        ))}
      </fieldset>
    </div>
  )
}
