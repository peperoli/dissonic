import { AddBand, ListItem, SpotifyArtist } from '../../types/types'
import { Button } from '../Button'
import { SpotifyArtistSelect } from './SpotifyArtistSelect'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { TextField } from '../forms/TextField'
import { SelectField } from '../forms/SelectField'
import { useSearchGenres } from '../../hooks/genres/useSearchGenres'
import { useBand } from '@/hooks/bands/useBand'
import { useParams } from 'next/navigation'
import { useAddBand } from '@/hooks/bands/useAddBand'
import { useEditBand } from '@/hooks/bands/useEditBand'
import { ChevronDown } from 'lucide-react'
import { Disclosure } from '../shared/Disclosure'
import { useState } from 'react'
import clsx from 'clsx'
import { useTranslations } from 'use-intl'
import { useLocale } from 'next-intl'
import { SimilarItemsWarning } from '../shared/SimilarItemsWarning'
import { useSimilarBands } from '@/hooks/bands/useSimilarBands'
import { getCountryName } from '@/lib/getCountryName'
import { useSearchCountries } from '@/hooks/countries/useSearchCountries'

export type BandFields = {
  id: AddBand['id']
  name: AddBand['name']
  countries: ListItem<string>[]
  genres: ListItem[]
  spotify_artist: SpotifyArtist | null
  alt_names: AddBand['alt_names']
  youtube_url: AddBand['youtube_url']
}

export const Form = ({ isNew, close }: { isNew?: boolean; close: () => void }) => {
  const { id: bandId } = useParams<{ id?: string }>()
  const { data: band } = useBand(bandId ? parseInt(bandId) : null)
  const locale = useLocale()
  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { dirtyFields, errors },
  } = useForm<BandFields>({
    defaultValues: isNew
      ? {
          name: '',
          genres: [],
        }
      : {
          ...band,
          countries:
            band?.countries_iso2.map(countryIso2 => ({
              id: countryIso2,
              name: getCountryName(countryIso2, locale) ?? countryIso2,
            })) || [],
          spotify_artist: {
            id: band?.spotify_artist_id,
            images: band?.spotify_artist_images,
          } as SpotifyArtist,
        },
  })
  const name = watch('name')
  const [similarBandsSize, setSimilarBandsSize] = useState(3)
  const { data: similarBands } = useSimilarBands({
    enabled: isNew && name.length >= 1,
    search: name,
    size: similarBandsSize,
  })
  const [countriesSearchQuery, setCountriesSearchQuery] = useState('')
  const [genresSearchQuery, setGenresSearchQuery] = useState('')
  const { data: countries } = useSearchCountries({ search: countriesSearchQuery })
  const { data: genres } = useSearchGenres({ search: genresSearchQuery })
  const addBand = useAddBand()
  const editBand = useEditBand()
  const t = useTranslations('BandForm')
  const { status } = isNew ? addBand : editBand
  const isSimilar = !!(dirtyFields.name && similarBands?.count)

  const onSubmit: SubmitHandler<BandFields> = async function (formData) {
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
        <SimilarItemsWarning
          itemType="bands"
          similarItems={similarBands}
          similarItemsSize={similarBandsSize}
          setSimilarItemsSize={setSimilarBandsSize}
        />
      )}
      <Controller
        name="countries"
        control={control}
        rules={{ required: true }}
        render={({ field: { value = [], onChange } }) => (
          <SelectField<string>
            name="countries"
            multiple={true}
            values={value}
            onValuesChange={onChange}
            items={
              countries?.data.map(item => ({
                id: item.iso2,
                name: getCountryName(item.iso2, locale) ?? item.iso2,
              })) ?? []
            }
            searchable
            searchQuery={countriesSearchQuery}
            setSearchQuery={setCountriesSearchQuery}
            error={errors.countries}
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
            items={genres?.data ?? []}
            multiple
            values={value}
            onValuesChange={onChange}
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
      <Disclosure.Root>
        <Disclosure.Content className="mt-3 grid gap-6">
          <TextField {...register('alt_names')} label={`${t('altNames')} ${t('optional')}`} />
          <TextField
            {...register('youtube_url')}
            label={`${t('youtubeChannel')} ${t('optional')}`}
            placeholder="https://youtube.com/channel/UC4BSeEq7XNtihGqI309vhYg"
          />
        </Disclosure.Content>
        <Disclosure.Trigger className="btn btn-small btn-tertiary">
          {({ isOpen }) => (
            <>
              {isOpen ? t('showLess') : t('showMore')}
              <ChevronDown className={clsx('size-icon', isOpen && 'rotate-180')} />
            </>
          )}
        </Disclosure.Trigger>
      </Disclosure.Root>
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
