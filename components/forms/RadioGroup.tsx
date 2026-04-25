import { ListItem } from '@/types/types'
import clsx from 'clsx'

type RadioGroupProps = {
  name: string
  items: ListItem[]
  value: number | null
  onValueChange: (value: number) => void
}

export function RadioGroup({ name, items, value, onValueChange }: RadioGroupProps) {
  return (
    <ul className="w-full">
      {items.map(item => (
        <li key={item.id}>
          <label className="flex w-full items-center gap-3 rounded px-2 py-1.5 hover:bg-slate-600">
            <RadioButton
              name={name}
              value={item.name}
              isChecked={value === item.id}
              onCheckedChange={() => onValueChange(item.id)}
            />
            {item.name}
          </label>
        </li>
      ))}
    </ul>
  )
}

export function RadioButton({
  isChecked,
  onCheckedChange,
  ...props
}: {
  name: string
  value: string
  isChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
}) {
  return (
    <input
      type="radio"
      checked={isChecked}
      onChange={event => (onCheckedChange ? onCheckedChange(event.target.checked) : undefined)}
      className={clsx(
        'radio grid size-4 flex-none appearance-none place-content-center rounded-full border-2 border-slate-300 bg-white/5',
        'checked:border-venom'
      )}
      {...props}
    />
  )
}
