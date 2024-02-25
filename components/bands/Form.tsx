import { useBands } from '../../hooks/bands/useBands'
import { AddBand, EditBand } from '../../types/types'
import { Button } from '../Button'
import { SpotifyArtistSelect } from './SpotifyArtistSelect'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { TextField } from '../forms/TextField'
import { SelectField } from '../forms/SelectField'
import { useCountries } from '../../hooks/useCountries'
import { useGenres } from '../../hooks/useGenres'

interface FormProps {
  defaultValues?: EditBand
  onSubmit: SubmitHandler<AddBand> | SubmitHandler<EditBand>
  status: 'idle' | 'loading' | 'error' | 'success'
  close: () => void
}

export const Form = ({ defaultValues, onSubmit, status, close }: FormProps) => {
  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { dirtyFields, errors },
  } = useForm<AddBand>({ defaultValues: defaultValues })
  const { data: bands } = useBands()
  const { data: countries } = useCountries()
  const { data: genres } = useGenres()
  const regExp = new RegExp(watch('name'), 'i')
  const similarBands =
    bands?.data.filter(item =>
      item.name
        ?.normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .match(regExp)
    ) || []
  const isSimilar = dirtyFields.name && watch('name')?.length >= 3 && similarBands.length > 0
  const regionNames = new Intl.DisplayNames(['de'], { type: 'region' })
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <TextField
        {...register('name', { required: true })}
        error={errors.name}
        label="Name"
        placeholder="Beatles"
      />
      {isSimilar && (
        <div className="mt-2">
          <p className="text-red">Vorsicht, diese Band könnte schon vorhanden sein:</p>
          <ul className="list-inside list-disc text-slate-300">
            {similarBands.map(band => (
              <li key={band.id}>{band.name}</li>
            ))}
          </ul>
        </div>
      )}
      <Controller
        name="country_id"
        control={control}
        rules={{ required: true }}
        render={({ field: { value = null, onChange } }) => (
          <SelectField
            name="country_id"
            value={value}
            onValueChange={onChange}
            items={countries?.map(item => ({
              id: item.id,
              name: regionNames.of(item.iso2) ?? item.iso2,
            }))}
            error={errors.country_id}
            label="Land"
          />
        )}
      />
      <Controller
        name="genres"
        control={control}
        render={({ field: { value = [], onChange } }) => (
          <SelectField
            name="genres"
            items={genres}
            multiple
            values={value.map(item => item.id)}
            onValuesChange={value =>
              onChange(genres?.filter(item => value.includes(item.id)) ?? [])
            }
            label="Genres"
          />
        )}
      />
      <Controller
        name="spotify_artist_id"
        control={control}
        render={({ field: { value = null, onChange } }) => (
          <SpotifyArtistSelect bandName={watch('name')} value={value} onChange={onChange} />
        )}
      />
      <div className="sticky bottom-0 z-10 flex gap-4 bg-slate-800 py-4 md:static md:z-0 md:justify-end md:pb-0 [&>*]:flex-1">
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
