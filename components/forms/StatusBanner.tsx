import clsx from 'clsx'
import { AlertCircleIcon, AlertTriangleIcon, CheckCircle, InfoIcon } from 'lucide-react'

type StatusBannerProps = {
  statusType: 'success' | 'error' | 'warning' | 'info'
  message?: string
  className?: string
}

export const StatusBanner = ({ statusType, message, className }: StatusBannerProps) => {
  return (
    <div
      className={clsx(
        'flex items-center gap-3 rounded-lg p-4',
        statusType === 'success' && 'bg-venom/10 text-venom',
        statusType === 'error' && 'bg-red/10 text-red',
        statusType === 'warning' && 'bg-yellow/10 text-yellow',
        statusType === 'info' && 'bg-blue/10 text-blue',
        className
      )}
    >
      {statusType === 'success' && <CheckCircle className="size-icon flex-none" />}
      {statusType === 'error' && <AlertCircleIcon className="size-icon flex-none" />}
      {statusType === 'warning' && <AlertTriangleIcon className="size-icon flex-none" />}
      {statusType === 'info' && <InfoIcon className="size-icon flex-none" />}
      {message ?? 'Es ist ein Fehler aufgetreten.'}
    </div>
  )
}
