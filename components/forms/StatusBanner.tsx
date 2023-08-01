import { ExclamationCircleIcon } from '@heroicons/react/20/solid'

type StatusBannerProps = {
  message?: string
}

export const StatusBanner = ({ message }: StatusBannerProps) => {
  return (
    <div className="flex gap-3 p-4 rounded-lg text-yellow bg-yellow/10">
      <ExclamationCircleIcon className="h-icon flex-none" />
      {message ?? 'Ein Fehler ist aufgetreten.'}
    </div>
  )
}
