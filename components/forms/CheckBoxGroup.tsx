import { ListItem } from '@/types/types'
import * as Checkbox from '@radix-ui/react-checkbox'
import { CheckIcon } from 'lucide-react'

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
            <Checkbox.Root
              name={name}
              value={item.name}
              checked={values.includes(item.id)}
              onCheckedChange={() => handleChange(item.id)}
              className="grid size-4 flex-none place-content-center rounded border-2 border-slate-300 bg-white/5 data-[state=checked]:border-venom data-[state=checked]:bg-venom"
            >
              <Checkbox.Indicator>
                <CheckIcon className="size-3 text-slate-850" strokeWidth={4} />
              </Checkbox.Indicator>
            </Checkbox.Root>
            {item.name}
          </label>
        </li>
      ))}
    </ul>
  )
}
