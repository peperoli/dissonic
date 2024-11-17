import { useDeleteLocation } from '@/hooks/locations/useDeleteLocation'
import { useParams } from 'next/navigation'
import { Button } from '../Button'
import { useTranslations } from 'next-intl'

interface DeleteLocationFormProps {
  close: () => void
}

export const DeleteLocationForm = ({ close }: DeleteLocationFormProps) => {
  const { id: locationId } = useParams<{ id?: string }>()
  const { mutate, isPending } = useDeleteLocation()
  const t = useTranslations('DeleteLocationForm')

  return (
    <div>
      <p>{t('doYouReallyWantToDeleteThisLocation')}</p>
      <div className="sticky bottom-0 z-10 flex gap-4 bg-slate-800 py-4 md:justify-end [&>*]:flex-1">
        <Button label={t('cancel')} onClick={close} />
        <Button
          label={t('delete')}
          onClick={() => (locationId ? mutate(parseInt(locationId)) : null)}
          appearance="primary"
          danger
          loading={isPending}
        />
      </div>
    </div>
  )
}
