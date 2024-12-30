import { ListItem } from '@/types/types'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'

type CheckBoxGroupProps = {
  name: string
  items: ListItem[]
  value: number | null
  onValueChange: (value: number) => void
}

export const RadioGroup = ({ name, items, value, onValueChange }: CheckBoxGroupProps) => {
  return (
    <RadioGroupPrimitive.Root
      name={name}
      value={typeof value === 'number' ? value.toString() : undefined}
      onValueChange={value => onValueChange(parseInt(value))}
      orientation="vertical"
    >
      <ul className="w-full">
        {items.map(item => (
          <li key={item.id}>
            <label className="flex w-full items-center gap-3 rounded px-2 py-1.5 hover:bg-slate-600">
              <RadioGroupPrimitive.Item
                value={item.id.toString()}
                className="grid size-4 flex-none place-content-center rounded-full border-2 border-slate-300 bg-white/5 data-[state=checked]:border-venom data-[state=checked]:bg-venom"
              >
                <RadioGroupPrimitive.Indicator className="size-3 rounded-lg border-3 border-slate-850 bg-venom" />
              </RadioGroupPrimitive.Item>
              {item.name}
            </label>
          </li>
        ))}
      </ul>
    </RadioGroupPrimitive.Root>
  )
}
