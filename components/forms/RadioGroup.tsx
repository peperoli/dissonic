import { ListItem } from '@/types/types'

type CheckBoxGroupProps = {
  name: string
  items: ListItem[]
  value: number | null
  onValueChange: (value: number) => void
}

export const RadioGroup = ({ name, items, value, onValueChange }: CheckBoxGroupProps) => {
  return (
    <ul className="w-full">
      {items.map(item => (
        <li key={item.id}>
          <label className="flex w-full items-center gap-3 rounded px-2 py-1.5 hover:bg-slate-600">
            <input
              type="radio"
              name={name}
              value={item.name}
              checked={value === item.id}
              onChange={() => onValueChange(item.id)}
              className="size-4 flex-none accent-venom"
            />
            {item.name}
          </label>
        </li>
      ))}
    </ul>
  )
}
