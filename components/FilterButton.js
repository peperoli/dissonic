import { ArrowUturnLeftIcon, CheckIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { useState, useEffect, useRef } from "react";
import Button from "./Button";
import MultiSelect from "./MultiSelect";

function useOutsideAlerter(ref, setIsOpen) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [ref, setIsOpen])
}

export default function FilterButton({ name, options, selectedOptions, setSelectedOptions }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  useOutsideAlerter(dropdownRef, setIsOpen)
  const filter = selectedOptions.length > 0 ? (selectedOptions.length > 1 ? selectedOptions.length : selectedOptions[0].name) : 'Alle'
  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)} className="btn btn-filter btn-secondary w-full h-full">
        <span className="capitalize whitespace-nowrap overflow-hidden text-ellipsis">{name}: {filter}</span>
        <ChevronDownIcon className="h-icon flex-none" />
      </button>
      {isOpen && (
        <div ref={dropdownRef} className="absolute mt-1 p-4 rounded-lg bg-slate-600 z-20">
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
            <Button
              onClick={() => setIsOpen(false)}
              icon={<CheckIcon className="h-icon" />}
              type="icon"
              style="primary" 
            />
          </div>
        </div>
      )}
    </div>
  )
}