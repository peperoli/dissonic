import clsx from 'clsx'
import { AlertTriangle, CheckCircle, InfoIcon } from 'lucide-react'

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
      {statusType === 'success' && <CheckCircle className="h-icon flex-none" />}
      {statusType === 'error' && <AlertTriangle className="h-icon flex-none" />}
      {statusType === 'info' && <InfoIcon className="h-icon flex-none" />}
      {message ?? 'Es ist ein Fehler aufgetreten.'}
    </div>
  )
}
