import React, { Dispatch, FC, SetStateAction } from 'react'

interface NumberFieldProps {
  id: string
  unit: string
  min?: number
  max?: number
  value: number
  setValue: Dispatch<SetStateAction<number>>
  onBlur?: any
}

export const NumberField: FC<NumberFieldProps> = ({ id, unit, min, max, value, setValue, onBlur }) => {
  return (
    <div className='relative flex'>
      <input
        id={id}
        min={min}
        max={max}
        type="number"
        value={value}
        onBlur={event => onBlur(event)}
        onChange={event => setValue(Number(event.target.value))}
        style={{ MozAppearance: 'textfield' }}
        className="block w-full m-0 pl-4 pr-12 py-3 rounded-lg border border-slate-500 bg-slate-700 accent-white appearance-none"
      />
      <span className='absolute right-0 px-4 self-center text-slate-300 pointer-events-none'>{unit}</span>
    </div>
  )
}
