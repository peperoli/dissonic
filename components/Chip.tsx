import clsx from 'clsx'

type ChipProps = {
  label: string
  onClick?: () => void
  size?: 'md' | 'sm'
  count?: number
  color?: 'secondary' | 'purple' | 'blue'
}

export const Chip = ({ label, onClick, size = 'md', count, color = 'secondary' }: ChipProps) => {
  const ConditionalWrapper = onClick ? 'button' : 'div'
  return (
    <ConditionalWrapper
      type={onClick ? 'button' : undefined}
      className={clsx(
        'flex w-fit items-center justify-center gap-2 rounded-full border-2 disabled:cursor-not-allowed disabled:opacity-30',
        size === 'md' && 'px-3 py-1',
        size === 'sm' && 'px-2 py-0.5 text-sm',
        color === 'secondary' && 'border-slate-500 text-slate-50',
        color === 'purple' && 'border-purple/50 text-purple',
        color === 'blue' && 'border-blue/50 text-blue'
      )}
    >
      {label}
      {count && (
        <div className="min-w-4 rounded bg-slate-700 px-1 text-center text-sm">{count}</div>
      )}
    </ConditionalWrapper>
  )
}
Chip.displayName = 'Chip'
