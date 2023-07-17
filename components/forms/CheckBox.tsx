import { forwardRef } from 'react'

type CheckBoxProps = {
  label: string
}

export const CheckBox = forwardRef<HTMLInputElement, CheckBoxProps>(({ label, ...props }, ref) => {
  return (
    <div className="form-control">
      <label>
        <input ref={ref} type="checkbox" {...props} />
        <span>{label}</span>
      </label>
    </div>
  )
})

CheckBox.displayName = 'CheckBox'
