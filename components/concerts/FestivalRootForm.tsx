import { Controller, useForm } from 'react-hook-form'
import { useLocations } from '../../hooks/locations/useLocations'
import { Button } from '../Button'
import { TextField } from '../forms/TextField'
import { SelectField } from '../forms/SelectField'
import { Tables } from '@/types/supabase'
import { useAddFestivalRoot } from '@/hooks/concerts/useAddFestivalRoot'
import { StatusBanner } from '../forms/StatusBanner'
import { getErrorMessage } from '@/lib/getErrorMessage'
import { useFestivalRoots } from '@/hooks/concerts/useFestivalRoots'
import { useState } from 'react'
import { SimilarItemsWarning } from '../shared/SimilarItemsWarning'
import { useTranslations } from 'next-intl'
import { ListItem } from '@/types/types'

export type FestivalRootFields = {
  name: Tables<'festival_roots'>['name']
  default_location: ListItem
  website: Tables<'festival_roots'>['website']
}

export const FestivalRootForm = ({ close }: { close: () => void }) => {
  const { register, control, watch, handleSubmit, formState } = useForm<FestivalRootFields>({
    defaultValues: { name: '', website: '' },
  })
  const name = watch('name')
  const [similarFestivalRootsSize, setSimilarFestivalRootsSize] = useState(3)
  const { data: similarFestivalRoots } = useFestivalRoots({
    enabled: name.length >= 3,
    search: name,
    size: similarFestivalRootsSize,
  })
  const [locationsSearchQuery, setLocationsSearchQuery] = useState('')
  const { data: locations } = useLocations({ search: locationsSearchQuery })
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
      <Controller
        name="default_location"
        control={control}
        rules={{ required: true }}
        render={({ field: { value = null, onChange } }) => (
          <SelectField
            name="default_location"
            items={locations?.data.map(item => ({
              id: item.id,
              name: `${item.name}, ${item.city}`,
            }))}
            searchable
            searchQuery={locationsSearchQuery}
            setSearchQuery={setLocationsSearchQuery}
            value={value}
            onValueChange={onChange}
            error={formState.errors.default_location}
            label={t('defaultLocation')}
          />
        )}
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
