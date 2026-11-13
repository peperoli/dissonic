import { useAddLocation } from '../../hooks/locations/useAddLocation'
import { AddLocation } from '../../types/types'
import { Button } from '../Button'
import { TextField } from '../forms/TextField'
import { useForm, Controller, UseFormWatch, UseFormSetValue } from 'react-hook-form'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { useLocation } from '@/hooks/locations/useLocation'
import { useEditLocation } from '@/hooks/locations/useEditLocation'
import { useLocale, useTranslations } from 'next-intl'
import { FileInput } from '../forms/FileInput'
import { getAssetUrl } from '@/lib/getAssetUrl'
import { SimilarItemsWarning } from '../shared/SimilarItemsWarning'
import { useSimilarLocations } from '@/hooks/locations/useSimilarLocations'
import { ListItem } from '@/types/types'
import { getCountryName } from '@/lib/getCountryName'
import { CountrySelectField } from './CountrySelectField'
import { useAutocompleteAddress } from '@/hooks/locations/useAutocompleteAddress'
import { useDebounce } from '@/hooks/helpers/useDebounce'
import { AutocompleteField } from '../forms/AutocompleteField'
import { GeoapifyFeature } from '@/types/geoapify'
import { getLocationCoordinates } from '@/lib/getLocationCoordinates'
import toast from 'react-hot-toast'
import { useCallback } from 'react'
import {
  GeolocateControl,
  Map as MapGL,
  MapRef,
  Marker,
  NavigationControl,
  type MarkerDragEvent,
} from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { setWorkerUrl } from 'maplibre-gl'
import { MapStyleControl, MapStyleName, mapStyles } from './MapStyleControl'
import { FurtherDetailsDisclosure } from '../forms/FurtherDetailsDisclosure'
import { parseCoordinates } from '@/lib/parseCoordinates'

setWorkerUrl('https://unpkg.com/maplibre-gl@6.16.0/dist/maplibre-gl-worker.mjs')

export type LocationFields = {
  id: AddLocation['id']
  name: AddLocation['name']
  image: AddLocation['image']
  imageFile: File | string | null
  street: AddLocation['street']
  zip_code: AddLocation['zip_code']
  city: AddLocation['city']
  country: ListItem<string>
  alt_names: AddLocation['alt_names']
  website: AddLocation['website']
  latitude: AddLocation['latitude']
  longitude: AddLocation['longitude']
}

export const Form = ({ close, isNew }: { close: () => void; isNew?: boolean }) => {
  const { id: locationId } = useParams<{ id?: string }>()
  const { data: location } = useLocation(locationId ? parseInt(locationId) : null)
  const locale = useLocale()
  const {
    register,
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { dirtyFields, errors },
  } = useForm<LocationFields>({
    defaultValues: isNew
      ? { name: '', zip_code: '', city: '' }
      : {
          ...location,
          country: location
            ? {
                id: location.country_iso2,
                name: getCountryName(location.country_iso2, locale) ?? location.country_iso2,
              }
            : undefined,
          imageFile: location?.image
            ? getAssetUrl('ressources', location.image, location.updated_at)
            : null,
        },
  })
  const name = watch('name')
  const [similarLocationsSize, setSimilarLocationsSize] = useState(3)
  const { data: similarLocations } = useSimilarLocations({
    enabled: isNew && name.length >= 3,
    search: name,
    size: similarLocationsSize,
  })
  const debouncedName = useDebounce(name, 200)
  const street = watch('street')
  const debouncedStreet = useDebounce(street, 200)
  const { data: suggestedAddresses, isFetching } = useAutocompleteAddress(
    [debouncedName, debouncedStreet].filter(Boolean).join(', ')
  )
  const coordinates = parseCoordinates({
    latitude: watch('latitude'),
    longitude: watch('longitude'),
  })
  const addLocation = useAddLocation()
  const editLocation = useEditLocation()
  const { status } = isNew ? addLocation : editLocation
  const t = useTranslations('LocationForm')
  const isSimilar = !!(dirtyFields.name && similarLocations?.count)
  const fileTypes = ['image/jpeg', 'image/webp']

  async function onSubmit(formData: LocationFields) {
    if (isNew) {
      addLocation.mutate(formData)
    } else {
      editLocation.mutate(formData)
    }
  }

  function onAutocomplete(value: ListItem<string> | null) {
    if (!value) return
    const { address } = value as ListItem<string> & { address: GeoapifyFeature['properties'] }
    setValue('street', [address.street, address.housenumber].filter(Boolean).join(' '))
    setValue('zip_code', address.postcode)
    setValue('city', address.city)
    setValue('country', {
      id: address.country_code,
      name: getCountryName(address.country_code.toUpperCase(), locale),
    })
    setValue('latitude', address.lat)
    setValue('longitude', address.lon)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <TextField
        {...register('name', { required: true })}
        error={errors.name}
        label={t('name')}
        placeholder="Hallenstadion"
      />
      {isSimilar && (
        <SimilarItemsWarning
          itemType="locations"
          similarItems={similarLocations}
          similarItemsSize={similarLocationsSize}
          setSimilarItemsSize={setSimilarLocationsSize}
        />
      )}
      <Controller
        name="imageFile"
        control={control}
        rules={{
          validate: {
            fileSize: value =>
              !(value instanceof File) ||
              value.size < 1024 * 1024 ||
              t('fileSizeError', { size: 1 }),
            fileType: value =>
              !(value instanceof File) || fileTypes.includes(value.type) || t('fileTypeError'),
          },
        }}
        render={({ field }) => (
          <FileInput
            label={t('image') + ' (optional)'}
            accept={fileTypes.join(',')}
            error={errors.imageFile}
            {...field}
          />
        )}
      />
      <AutocompleteField<string>
        {...register('street')}
        items={
          suggestedAddresses?.map(feature => ({
            id: feature.properties.place_id,
            name: feature.properties.name,
            address: feature.properties,
          })) ?? []
        }
        onAutocomplete={onAutocomplete}
        error={errors.street}
        label={t('street') + ' (optional)'}
        placeholder="Tannwaldstrasse 48"
        isLoading={isFetching}
      />

      <div className="grid grid-cols-3">
        <TextField
          {...register('zip_code')}
          label={t('zipCode') + ' (optional)'}
          placeholder="4600"
          grouped="start"
        />
        <div className="col-span-2">
          <TextField
            {...register('city', { required: true })}
            error={errors.city}
            label={t('city')}
            placeholder="Olten"
            grouped="end"
          />
        </div>
      </div>
      <CountrySelectField control={control} label={t('country')} error={errors.country} />
      <hr className="border-slate-700" />
      <FurtherDetailsDisclosure labels={[t('altNames'), t('website'), t('coordinates')]}>
        <TextField {...register('alt_names')} label={`${t('altNames')} ${t('optional')}`} />
        <TextField
          {...register('website')}
          label={`${t('website')} ${t('optional')}`}
          placeholder="https://hallenstadion.ch/"
        />
        <FindCoordinatesButton watch={watch} setValue={setValue} />
        <div className="grid grid-cols-2">
          <TextField
            {...register('latitude', { valueAsNumber: true })}
            type="number"
            step="any"
            error={errors.latitude}
            label={t('latitude') + ' (optional)'}
            placeholder="46.58411"
            grouped="start"
          />
          <TextField
            {...register('longitude', { valueAsNumber: true })}
            type="number"
            step="any"
            error={errors.longitude}
            label={t('longitude') + ' (optional)'}
            placeholder="7.08241"
            grouped="end"
          />
        </div>
        <MapPreview coordinates={coordinates} setValue={setValue} />
      </FurtherDetailsDisclosure>
      <div className="sticky bottom-0 z-10 flex gap-4 bg-slate-800 py-4 md:justify-end [&>*]:flex-1">
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

function FindCoordinatesButton({
  watch,
  setValue,
}: {
  watch: UseFormWatch<LocationFields>
  setValue: UseFormSetValue<LocationFields>
}) {
  const [isLoading, setLoading] = useState(false)
  const t = useTranslations('LocationForm')

  async function findCoordinates() {
    try {
      setLoading(true)
      const { latitude, longitude } = await getLocationCoordinates({
        name: watch('name'),
        street: watch('street'),
        zip_code: watch('zip_code'),
        city: watch('city'),
        country_iso2: watch('country')?.id ?? '',
      })
      setValue('latitude', latitude)
      setValue('longitude', longitude)
      toast.success(<div className="flex items-center gap-3">{t('coordinatesUpdated')}</div>)
    } catch (error) {
      console.error('Error finding coordinates:', error)
      toast.error(t('coordinatesUpdateFailed'))
    } finally {
      setLoading(false)
    }
  }

  return <Button onClick={findCoordinates} label={t('findCoordinates')} loading={isLoading} />
}

function MapPreview({
  coordinates,
  setValue,
}: {
  coordinates: { latitude: number; longitude: number } | null
  setValue: UseFormSetValue<LocationFields>
}) {
  const mapRef = useRef<MapRef>(null)
  const [currentMapStyle, setCurrentMapStyle] = useState<MapStyleName>('streetsDark')
  const onMarkerDrag = useCallback((event: MarkerDragEvent) => {
    setValue('latitude', event.lngLat.lat)
    setValue('longitude', event.lngLat.lng)
  }, [])

  useEffect(() => {
    if (coordinates) {
      mapRef.current?.easeTo({
        center: [coordinates.longitude, coordinates.latitude],
        duration: 500,
      })
    }
  }, [coordinates?.latitude, coordinates?.longitude])

  return (
    <MapGL
      ref={mapRef}
      initialViewState={{
        latitude: coordinates ? coordinates.latitude : 46.58411,
        longitude: coordinates ? coordinates.longitude : 7.08241,
        zoom: 16,
      }}
      mapStyle={mapStyles[currentMapStyle].url}
      style={{ width: '100%', height: 300, borderRadius: '1rem' }}
    >
      <MapStyleControl
        position="top-left"
        currentMapStyle={currentMapStyle}
        switchStyle={setCurrentMapStyle}
      />
      <NavigationControl />
      <GeolocateControl />
      {coordinates && (
        <Marker
          longitude={coordinates.longitude}
          latitude={coordinates.latitude}
          anchor="bottom"
          draggable
          onDrag={onMarkerDrag}
        >
          <Pin />
        </Marker>
      )}
    </MapGL>
  )
}

function Pin() {
  return (
    <svg width="36" height="44" viewBox="0 0 72 88" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M38.5454 85.0625C46.4231 78.3326 69.8824 56.5421 69.8824 35.619C69.8824 26.728 66.3127 18.201 59.9585 11.9141C53.6043 5.62718 44.9862 2.09521 36 2.09521C27.0139 2.09521 18.3958 5.62718 12.0416 11.9141C5.68741 18.201 2.11768 26.728 2.11768 35.619C2.11768 56.5421 25.577 78.3326 33.4546 85.0625C34.1885 85.6085 35.0818 85.9037 36 85.9037C36.9182 85.9037 37.8116 85.6085 38.5454 85.0625Z"
        fill="#99F162"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#1F282E"
      />
      <path
        d="M36.0001 48.1905C43.0173 48.1905 48.706 42.562 48.706 35.619C48.706 28.676 43.0173 23.0476 36.0001 23.0476C28.9828 23.0476 23.2942 28.676 23.2942 35.619C23.2942 42.562 28.9828 48.1905 36.0001 48.1905Z"
        fill="#1F282E"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#1F282E"
      />
    </svg>
  )
}
