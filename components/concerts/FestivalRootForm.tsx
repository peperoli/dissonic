import { useForm } from 'react-hook-form'
import { Button } from '../Button'
import { TextField } from '../forms/TextField'
import { useAddFestivalRoot } from '@/hooks/concerts/useAddFestivalRoot'
import { StatusBanner } from '../forms/StatusBanner'
import { getErrorMessage } from '@/lib/getErrorMessage'
import { useState } from 'react'
import { SimilarItemsWarning } from '../shared/SimilarItemsWarning'
import { useTranslations } from 'next-intl'
import { FestivalRoot, ListItem } from '@/types/types'
import { useSearchFestivalRoots } from '@/hooks/festival-roots/useSearchFestivalRoots'
import { LocationSelectField } from './LocationSelectField'

export type FestivalRootFields = {
  name: FestivalRoot['name']
  default_location: ListItem
  website: FestivalRoot['website']
}

export const FestivalRootForm = ({ close }: { close: () => void }) => {
  const { register, control, watch, handleSubmit, formState } = useForm<FestivalRootFields>({
    defaultValues: { name: '', website: '' },
  })
  const name = watch('name')
  const [similarFestivalRootsSize, setSimilarFestivalRootsSize] = useState(3)
  const { data: similarFestivalRoots } = useSearchFestivalRoots({
    enabled: name.length >= 3,
    search: name,
    size: similarFestivalRootsSize,
  })
  const { mutate, status, error } = useAddFestivalRoot()
  const t = useTranslations('FestivalRootForm')
  const isSimilar = !!(formState.dirtyFields.name && similarFestivalRoots?.count)

  async function onSubmit(data: FestivalRootFields) {
    mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
      <h2>{t('addFestivalRoot')}</h2>
      <TextField
        {...register('name', { required: true })}
        error={formState.errors.name}
        label={t('name')}
        placeholder="Greenfield Festival"
      />
      {isSimilar && (
        <SimilarItemsWarning
          itemType="festivalRoots"
          similarItems={similarFestivalRoots}
          similarItemsSize={similarFestivalRootsSize}
          setSimilarItemsSize={setSimilarFestivalRootsSize}
        />
      )}
      <LocationSelectField
        name="default_location"
        control={control}
        label={t('defaultLocation')}
        error={formState.errors.default_location}
      />
      <TextField
        {...register('website')}
        label={t('website') + ' (optional)'}
        placeholder="https://greenfieldfestival.ch"
      />
      {!!error && <StatusBanner statusType="error" message={getErrorMessage(error)} />}
      <div className="flex gap-4 pt-4 [&>*]:flex-1">
        <Button onClick={close} label={t('cancel')} />
        <Button
          type="submit"
          label={t('save')}
          appearance="primary"
          loading={status === 'pending'}
        />
      </div>
    </form>
  )
}
