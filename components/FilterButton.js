import { ArrowUturnLeftIcon, ChevronDownIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { Button } from './Button'
import { MultiSelect } from './MultiSelect'
import { Popover } from '@headlessui/react'

export default function FilterButton({ name, options, selectedOptions, setSelectedOptions }) {
  const filter =
    selectedOptions.length > 0
      ? selectedOptions.length > 1
        ? selectedOptions.length
        : selectedOptions[0].name
      : 'Alle'
  return (
    <Popover className="relative">
      {({ open, close }) => (
        <>
          <Popover.Button className="btn btn-filter btn-secondary w-full h-full">
            <span className="capitalize whitespace-nowrap overflow-hidden text-ellipsis">
              {name}: {filter}
            </span>
            <ChevronDownIcon className={`h-icon flex-none${open ? ' transform rotate-180' : ''}`} />
          </Popover.Button>
          <Popover.Panel className="fixed md:absolute flex flex-col inset-0 md:inset-auto min-w-full md:mt-1 p-4 rounded-lg bg-slate-700 shadow-xl z-20">
            <div className="flex md:hidden justify-between items-center gap-4 mb-4">
              <h2 className="mb-0 capitalize">{name}</h2>
              <Button
                onClick={() => close()}
                label="Schliessen"
                contentType="icon"
                icon={<XMarkIcon className="h-icon" />}
              />
            </div>
            <div className='relative h-full'>
              <MultiSelect
                name={name}
                options={options}
                selectedOptions={selectedOptions}
                setSelectedOptions={setSelectedOptions}
                alwaysOpen
                fullHeight
              />
            </div>
            <div className="relative flex justify-end gap-2 w-full pt-4 bg-slate-700 z-10">
              <Button
                onClick={() => setSelectedOptions([])}
                icon={<ArrowUturnLeftIcon className="h-icon" />}
                contentType="icon"
                style="secondary"
                disabled={selectedOptions.length === 0}
              />
              <Button onClick={() => close()} label="Ergebnisse anzeigen" style="primary" />
            </div>
          </Popover.Panel>
        </>
      )}
    </Popover>
  )
}
