import { Controller, useForm } from 'react-hook-form'
import { useLocations } from '../../hooks/locations/useLocations'
import { Button } from '../Button'
import { TextField } from '../forms/TextField'
import { SelectField } from '../forms/SelectField'
import { TablesInsert } from '@/types/supabase'
import { useAddFestivalRoot } from '@/hooks/concerts/useAddFestivalRoot'
import { StatusBanner } from '../forms/StatusBanner'
import { getErrorMessage } from '@/lib/getErrorMessage'
import { useFestivalRoots } from '@/hooks/concerts/useFestivalRoots'
import { AlertTriangleIcon, TentIcon } from 'lucide-react'
import { useState } from 'react'

interface FestivalRootFormProps {
  close: () => void
}

export const FestivalRootForm = ({ close }: FestivalRootFormProps) => {
  const { register, control, watch, handleSubmit, formState } = useForm<
    TablesInsert<'festival_roots'>
  >({
    defaultValues: { name: '', website: '' },
  })
  const name = watch('name')
  const { data: similarFestivalRoots } = useFestivalRoots({
    enabled: name.length >= 3,
    search: name,
  })
  const [locationsSearchQuery, setLocationsSearchQuery] = useState('')
  const { data: locations } = useLocations({ search: locationsSearchQuery })
  const { data: allLocations } = useLocations()
  const { mutate, status, error } = useAddFestivalRoot()
  const isSimilar = !!(formState.dirtyFields.name && similarFestivalRoots?.length)

  async function onSubmit(data: TablesInsert<'festival_roots'>) {
    mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
      <h2>Festival-Serie hinzufügen</h2>
      <TextField
        {...register('name', { required: true })}
        error={formState.errors.name}
        label="Name"
        placeholder="Greenfield Festival"
      />
      {isSimilar && (
        <div className="rounded-lg bg-yellow/10 p-4">
          <div className="flex items-center gap-4 text-yellow">
            <AlertTriangleIcon className="size-icon flex-none" />
            <p>
              <strong>Achtung:</strong>{' '}
              {similarFestivalRoots.length === 1
                ? 'Eine Festival-Serie'
                : 'Folgende Festival-Serien'}{' '}
              mit ähnlichem Namen {similarFestivalRoots.length === 1 ? 'existiert' : 'existieren'}{' '}
              bereits:
            </p>
          </div>
          <ul className="mt-4 grid">
            {similarFestivalRoots.map(item => (
              <li key={item.id} className="flex gap-4 rounded-lg p-2 text-left">
                <div className="relative grid h-11 w-11 flex-none place-content-center rounded-lg bg-slate-750">
                  <TentIcon className="size-icon text-slate-300" />
                </div>
                <div className="grid">
                  <div className="truncate">{item.name}</div>
                  <div className="text-sm text-slate-300">{item.default_location?.name}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      <Controller
        name="default_location_id"
        control={control}
        rules={{ required: true }}
        render={({ field: { value = null, onChange } }) => (
          <SelectField
            name="default_location_id"
            items={locations?.data.map(item => ({
              id: item.id,
              name: `${item.name}, ${item.city}`,
            }))}
            allItems={allLocations?.data.map(item => ({
              id: item.id,
              name: `${item.name}, ${item.city}`,
            }))}
            searchable
            searchQuery={locationsSearchQuery}
            setSearchQuery={setLocationsSearchQuery}
            value={value}
            onValueChange={onChange}
            error={formState.errors.default_location_id}
            label="Standard-Location"
          />
        )}
      />
      <TextField
        {...register('website')}
        label="Website (optional)"
        placeholder="https://greenfieldfestival.ch"
      />
      {!!error && <StatusBanner statusType="error" message={getErrorMessage(error)} />}
      <div className="flex gap-4 pt-4 [&>*]:flex-1">
        <Button onClick={close} label="Abbrechen" />
        <Button
          type="submit"
          label="Speichern"
          appearance="primary"
          loading={status === 'pending'}
        />
      </div>
    </form>
  )
}
