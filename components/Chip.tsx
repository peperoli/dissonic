import clsx from 'clsx'

type ChipProps = {
  label: string
  onClick?: () => void
  size?: 'md' | 'sm'
  count?: number
}

export const Chip = ({ label, onClick, size = 'md', count }: ChipProps) => {
  const ConditionalWrapper = onClick ? 'button' : 'div'
  return (
    <ConditionalWrapper
      type={onClick ? 'button' : undefined}
      className={clsx(
        'flex items-center justify-center gap-2 rounded-md border-2 border-slate-500 disabled:cursor-not-allowed disabled:opacity-30',
        size === 'md' && 'px-2 py-1',
        size === 'sm' && ''
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
