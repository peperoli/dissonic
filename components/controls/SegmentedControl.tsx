import clsx from 'clsx'
import { LucideIcon } from 'lucide-react'

export type SegmentedControlProps = {
  options: { value: string; label: string; icon?: LucideIcon; count?: number }[]
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
    <div className="overflow-x-auto rounded-lg bg-slate-750 md:w-fit">
      <div className="flex w-full p-1 md:w-fit">
        {options.map(option => (
          <button
            type="button"
            onClick={() => onValueChange(option.value)}
            className={clsx(
              'flex min-w-12 shrink-0 grow items-center justify-center gap-1 whitespace-nowrap rounded-md px-2 py-1 md:w-fit md:flex-none',
              option.value === value
                ? 'bg-gradient-to-r from-blue/20 to-venom/20 text-white shadow-lg'
                : 'text-slate-300'
            )}
            key={option.value}
          >
            {option.icon && <option.icon className="size-icon" />}
            <span className={clsx(iconOnly && 'sr-only')}>{option.label}</span>
            {option.count !== undefined && (
              <div className="min-w-4 flex-none rounded bg-slate-700 px-1 text-center text-sm">
                {option.count}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
