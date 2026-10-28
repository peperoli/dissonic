import { Control, Controller, FieldError, FieldPath, FieldValues, Merge } from 'react-hook-form'
import { SelectField } from '../forms/SelectField'
import { useState } from 'react'
import { useSearchLocations } from '@/hooks/locations/useSearchLocations'

export function LocationSelectField<TFieldValues extends FieldValues>({
  name,
  control,
  ...props
}: {
  name: FieldPath<TFieldValues>
  control: Control<TFieldValues>
  error?: Merge<FieldError, unknown>
  label: string
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [size, setSize] = useState(50)
  const { data: locations } = useSearchLocations({ search: searchQuery, size })

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: true }}
      render={({ field: { value, onChange } }) => (
        <SelectField
          name={name}
          value={value}
          onValueChange={onChange}
          items={
            locations?.data.map(item => ({
              id: item.id,
              name: `${item.name}, ${item.city}`,
            })) ?? []
          }
          searchable
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onScrollToEnd={() => setSize(prevSize => prevSize + 50)}
          {...props}
        />
      )}
    />
  )
}
