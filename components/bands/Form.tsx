import { useBands } from '../../hooks/bands/useBands'
import { AddBand } from '../../types/types'
import { Button } from '../Button'
import { SpotifyArtistSelect } from './SpotifyArtistSelect'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { TextField } from '../forms/TextField'
import { SelectField } from '../forms/SelectField'
import { useCountries } from '../../hooks/useCountries'
import { useGenres } from '../../hooks/genres/useGenres'
import { useBand } from '@/hooks/bands/useBand'
import { useParams } from 'next/navigation'
import { useAddBand } from '@/hooks/bands/useAddBand'
import { useEditBand } from '@/hooks/bands/useEditBand'
import { AlertTriangle, ChevronDown } from 'lucide-react'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { Fragment } from 'react'
import clsx from 'clsx'
import { BandItem } from './BandItem'
import { useTranslations } from 'use-intl'
import { useLocale } from 'next-intl'

interface FormProps {
  isNew?: boolean
  close: () => void
}

export const Form = ({ isNew, close }: FormProps) => {
  const { id: bandId } = useParams<{ id?: string }>()
  const { data: band } = useBand(bandId ? parseInt(bandId) : null)
  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { dirtyFields, errors },
  } = useForm<AddBand>({ defaultValues: isNew ? { name: '', genres: [] } : band })
  const name = watch('name')
  const { data: similarBands } = useBands({
    enabled: name.length >= 3,
    search: name,
  })
  const { data: countries } = useCountries()
  const { data: genres } = useGenres()
  const addBand = useAddBand()
  const editBand = useEditBand()
  const t = useTranslations('BandForm')
  const locale = useLocale()
  const { status } = isNew ? addBand : editBand
  const isSimilar = !!(dirtyFields.name && similarBands?.count)
  const regionNames = new Intl.DisplayNames(locale, { type: 'region' })

  const onSubmit: SubmitHandler<AddBand> = async function (formData) {
    if (isNew) {
      addBand.mutate(formData)
    } else {
      editBand.mutate(formData)
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <TextField
        {...register('name', { required: true })}
        error={errors.name}
        label={t('name')}
        placeholder="Beatles"
      />
      {isSimilar && (
        <div className="rounded-lg bg-yellow/10 p-4">
          <div className="flex items-center gap-4 text-yellow">
            <AlertTriangle className="size-icon flex-none" />
            <p>{t('duplicateBandsWarning', { count: similarBands.count })}</p>
          </div>
          <ul className="mt-4 grid">
            {similarBands.data.map(item => (
              <li key={item.id}>
                <BandItem band={item} />
              </li>
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
            label={t('country')}
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
            label={t('genres')}
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
      <Disclosure>
        <DisclosurePanel className="grid gap-6">
          <TextField {...register('alt_names')} label={`${t('altNames')} ${t('optional')}`} />
          <TextField
            {...register('youtube_url')}
            label={`${t('youtubeChannel')} ${t('optional')}`}
            placeholder="https://youtube.com/channel/UC4BSeEq7XNtihGqI309vhYg"
          />
        </DisclosurePanel>
        <DisclosureButton as={Fragment}>
          {({ open }) => (
            <Button
              label={open ? t('showLess') : t('showMore')}
              icon={<ChevronDown className={clsx('size-icon', open && 'rotate-180')} />}
              size="small"
              appearance="tertiary"
            />
          )}
        </DisclosureButton>
      </Disclosure>
      <div className="sticky bottom-0 z-10 flex gap-4 bg-slate-800 py-4 md:static md:z-0 md:justify-end md:pb-0 [&>*]:flex-1">
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
