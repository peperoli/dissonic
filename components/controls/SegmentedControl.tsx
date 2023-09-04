import clsx from 'clsx'
import { ChangeEventHandler, ReactElement } from 'react'

type SegmentedControlProps = {
  options: { value: string; label: string; icon: ReactElement }[]
  value: string
  onValueChange: ChangeEventHandler<HTMLInputElement>
  iconOnly?: boolean
}

export function SegmentedControl({
  options,
  value,
  onValueChange,
  iconOnly,
}: SegmentedControlProps) {
  return (
    <fieldset className="flex p-1 rounded-lg bg-slate-800">
      {options.map(option => (
        <label
          className={clsx(
            'flex items-center gap-2 min-h-[2rem] px-2 py-1 rounded-md focus-within:outline',
            option.value === value ? 'text-slate-50 bg-slate-700 shadow-lg' : 'text-slate-300'
          )}
          key={option.value}
        >
          {option.icon}
          <span className={clsx(iconOnly && 'sr-only')}>{option.label}</span>
          <input
            type="radio"
            name={option.value}
            value={option.value}
            onChange={onValueChange}
            checked={option.value === value}
            className="sr-only"
          />
        </label>
      ))}
    </fieldset>
  )
}
