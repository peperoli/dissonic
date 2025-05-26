import { useBands } from '../../hooks/bands/useBands'
import { AddBand, SpotifyArtist } from '../../types/types'
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
import { ChevronDown } from 'lucide-react'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { Fragment, useState } from 'react'
import clsx from 'clsx'
import { useTranslations } from 'use-intl'
import { useLocale } from 'next-intl'
import { SimilarItemsWarning } from '../shared/SimilarItemsWarning'

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
  } = useForm<Omit<AddBand, 'spotify_artist_images'> & { spotify_artist: SpotifyArtist }>({
    defaultValues: isNew
      ? {
          name: '',
          genres: [],
        }
      : {
          ...band,
          spotify_artist: {
            id: band?.spotify_artist_id,
            images: band?.spotify_artist_images,
          } as SpotifyArtist,
        },
  })
  const name = watch('name')
  const [similarBandsSize, setSimilarBandsSize] = useState(3)
  const { data: similarBands } = useBands({
    enabled: name.length >= 3,
    search: name,
    size: similarBandsSize,
  })
  const [countriesSearchQuery, setCountriesSearchQuery] = useState('')
  const [genresSearchQuery, setGenresSearchQuery] = useState('')
  const { data: countries } = useCountries({ search: countriesSearchQuery })
  const { data: allCountries } = useCountries()
  const { data: genres } = useGenres({ search: genresSearchQuery })
  const { data: allGenres } = useGenres()
  const addBand = useAddBand()
  const editBand = useEditBand()
  const t = useTranslations('BandForm')
  const locale = useLocale()
  const { status } = isNew ? addBand : editBand
  const isSimilar = !!(dirtyFields.name && similarBands?.count)
  const regionNames = new Intl.DisplayNames(locale, { type: 'region' })

  const onSubmit: SubmitHandler<AddBand & { spotify_artist: SpotifyArtist }> = async function (
    formData
  ) {
    if (isNew) {
      addBand.mutate({
        ...formData,
        spotify_artist_id: formData.spotify_artist?.id,
        spotify_artist_images: formData.spotify_artist?.images ?? null,
      })
    } else {
      editBand.mutate({
        ...formData,
        spotify_artist_id: formData.spotify_artist?.id ?? null,
        spotify_artist_images: formData.spotify_artist?.images ?? null,
      })
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
        <SimilarItemsWarning
          itemType="bands"
          similarItems={similarBands}
          similarItemsSize={similarBandsSize}
          setSimilarItemsSize={setSimilarBandsSize}
        />
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
            allItems={allCountries?.map(item => ({
              id: item.id,
              name: regionNames.of(item.iso2) ?? item.iso2,
            }))}
            searchable
            searchQuery={countriesSearchQuery}
            setSearchQuery={setCountriesSearchQuery}
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
            allItems={allGenres}
            multiple
            values={value.map(item => item.id)}
            onValuesChange={values =>
              onChange(allGenres?.filter(item => values.includes(item.id)) ?? [])
            }
            searchable
            searchQuery={genresSearchQuery}
            setSearchQuery={setGenresSearchQuery}
            label={t('genres')}
          />
        )}
      />
      <Controller
        name="spotify_artist"
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
