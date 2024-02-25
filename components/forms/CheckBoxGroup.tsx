import { ListItem } from '@/types/types'

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
            <input
              type="checkbox"
              name={name}
              value={item.name}
              checked={values.includes(item.id)}
              onChange={() => handleChange(item.id)}
              className="size-4 flex-none accent-venom"
            />
            {item.name}
          </label>
        </li>
      ))}
    </ul>
  )
}
