import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'

type StatusBannerProps = {
  statusType: 'success' | 'error' | 'info'
  message?: string
  className?: string
}

export const StatusBanner = ({ statusType, message, className }: StatusBannerProps) => {
  return (
    <div
      className={clsx(
        'flex gap-3 p-4 rounded-lg',
        statusType === 'success' && 'text-venom bg-venom/10',
        statusType === 'error' && 'text-red bg-red/10',
        statusType === 'info' && 'text-yellow bg-yellow/10',
        className
      )}
    >
      {statusType === 'success' && <CheckCircleIcon className="h-icon flex-none" />}
      {statusType === 'error' && <ExclamationCircleIcon className="h-icon flex-none" />}
      {statusType === 'info' && <InformationCircleIcon className="h-icon flex-none" />}
      {message ?? 'Es ist ein Fehler aufgetreten.'}
    </div>
  )
}
