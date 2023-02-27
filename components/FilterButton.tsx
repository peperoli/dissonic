import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { Button } from './Button'
import { Popover } from '@headlessui/react'
import { Option } from '../types/types'
import React, { FC, ReactNode } from 'react'

interface FilterButtonProps {
  name: string
  selectedOptions: Option[] | number[]
  children: ReactNode
}

export const FilterButton: FC<FilterButtonProps> = ({
  name,
  selectedOptions,
  children
}) => {
  return (
    <Popover className="relative">
      {({ open, close }) => {
        return (
          <>
            <Popover.Button className="btn btn-filter btn-secondary w-full h-full">
              <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                {selectedOptions.length > 0 ? (
                  <>
                    <span className="capitalize">{name}: </span>
                    <span className="px-1 py-0.5 rounded-md bg-slate-800">
                      {selectedOptions.length} ausgewählt
                    </span>
                  </>
                ) : (
                  <span className="capitalize">{name}</span>
                )}
              </span>
              <ChevronDownIcon
                className={`h-icon flex-none${open ? ' transform rotate-180' : ''}`}
              />
            </Popover.Button>
            <Popover.Panel className="fixed md:absolute flex flex-col overflow-hidden inset-0 md:inset-auto min-w-full md:mt-1 p-4 md:rounded-lg bg-slate-700 shadow-xl z-20">
              <div className="flex md:hidden justify-between items-center gap-4 mb-4">
                <h2 className="mb-0 capitalize">{name}</h2>
                <Button
                  onClick={() => close()}
                  label="Schliessen"
                  contentType="icon"
                  icon={<XMarkIcon className="h-icon" />}
                />
              </div>
              {children}
            </Popover.Panel>
          </>
        )
      }}
    </Popover>
  )
}
