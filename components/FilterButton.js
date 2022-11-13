import { ArrowUturnLeftIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import Button from "./Button";
import MultiSelect from "./MultiSelect";
import { Popover } from '@headlessui/react'

export default function FilterButton({ name, options, selectedOptions, setSelectedOptions }) {
  const filter = selectedOptions.length > 0 ? (selectedOptions.length > 1 ? selectedOptions.length : selectedOptions[0].name) : 'Alle'
  return (
    <Popover className="relative">
      <Popover.Button className="btn btn-filter btn-secondary w-full h-full">
        {({ open }) => (
          <>
            <span className="capitalize whitespace-nowrap overflow-hidden text-ellipsis">{name}: {filter}</span>
            <ChevronDownIcon className={`h-icon flex-none${open ? ' transform rotate-180' : ''}`} />
          </>
        )}
      </Popover.Button>
      <Popover.Panel className="absolute min-w-full mt-1 p-4 rounded-lg bg-slate-700 shadow-xl z-20">
        <MultiSelect
          name={name}
          options={options}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
          alwaysOpen
        />
        <div className="flex justify-end gap-2 w-full mt-4">
          <Button
            onClick={() => setSelectedOptions([])}
            icon={<ArrowUturnLeftIcon className="h-icon" />}
            type="icon"
            style="secondary"
            disabled={selectedOptions.length === 0}
          />
        </div>
      </Popover.Panel>
    </Popover>
  )
}