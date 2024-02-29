import { Controller, useForm } from 'react-hook-form'
import { useLocations } from '../../hooks/locations/useLocations'
import { Button } from '../Button'
import { TextField } from '../forms/TextField'
import { SelectField } from '../forms/SelectField'
import { TablesInsert } from '@/types/supabase'
import { useAddFestivalRoot } from '@/hooks/concerts/useAddFestivalRoot'
import { StatusBanner } from '../forms/StatusBanner'
import { useEffect } from 'react'
import { getErrorMessage } from '@/lib/getErrorMessage'

interface FestivalRootFormProps {
  close: () => void
}

export const FestivalRootForm = ({ close }: FestivalRootFormProps) => {
  const { register, control, handleSubmit, formState } = useForm<TablesInsert<'festival_roots'>>({
    defaultValues: {},
  })
  const { data: locations } = useLocations()
  const { mutate, status, error } = useAddFestivalRoot()

  async function onSubmit(data: TablesInsert<'festival_roots'>) {
    console.log(data)
    mutate(data)
  }

  useEffect(() => {
    if (status === 'success') {
      close()
    }
  }, [status])
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
      <h2>Festival-Stamm hinzufügen</h2>
      <TextField
        {...register('name', { required: true })}
        error={formState.errors.name}
        label="Name"
        placeholder="Greenfield Festival"
      />
      <Controller
        name="default_location_id"
        control={control}
        rules={{ required: true }}
        render={({ field: { value = null, onChange } }) => (
          <SelectField
            name="default_location_id"
            items={locations?.data}
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
          loading={status === 'loading'}
        />
      </div>
    </form>
  )
}
