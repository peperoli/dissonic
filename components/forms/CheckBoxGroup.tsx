import { ListItem } from '@/types/types'
import clsx from 'clsx'

type CheckBoxGroupProps = {
  name: string
  items: ListItem[]
  values: number[]
  onValuesChange: (values: number[]) => void
}

export const CheckBoxGroup = ({ name, items, values, onValuesChange }: CheckBoxGroupProps) => {
  function handleChange(id: number) {
    if (values.includes(id)) {
      onValuesChange(values.filter(item => item !== id))
    } else {
      onValuesChange([...values, id])
    }
  }

  return (
    <ul className="w-full">
      {items.map(item => (
        <li key={item.id}>
          <label className="flex w-full items-center gap-3 rounded px-2 py-1.5 hover:bg-slate-600">
            <Checkbox
              name={name}
              value={item.name}
              isChecked={values.includes(item.id)}
              onCheckedChange={() => handleChange(item.id)}
            />
            {item.name}
          </label>
        </li>
      ))}
    </ul>
  )
}

function Checkbox({
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
      type="checkbox"
      checked={isChecked}
      onChange={event => (onCheckedChange ? onCheckedChange(event.target.checked) : undefined)}
      className={clsx(
        'checkbox grid size-4 flex-none appearance-none place-content-center rounded border-2 border-slate-300 bg-white/5 accent-venom',
        'checked:border-venom checked:bg-venom'
      )}
      {...props}
    />
  )
}
