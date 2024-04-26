import clsx from 'clsx'

type ToggleSwitchProps = {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export const ToggleSwitch = ({ label, checked, onChange }: ToggleSwitchProps) => {
  return (
    <label className="flex items-center gap-3">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={event => onChange(event.target.checked)}
      />
      <span
        className={clsx(
          'block w-9 flex-none rounded-full border p-0.5 duration-200',
          checked ? 'border-venom bg-venom' : 'border-slate-500 bg-slate-750'
        )}
      >
        <span
          className={clsx(
            'block size-4 rounded-full duration-200',
            checked ? 'translate-x-[calc(0.75rem+2px)] bg-slate-850' : 'scale-75 bg-slate-300'
          )}
        />
      </span>
      <span>{label}</span>
    </label>
  )
}
