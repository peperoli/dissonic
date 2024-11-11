import { useEffect, useState } from 'react'
import { FilterButton } from './../FilterButton'
import { Select } from '../forms/Select'
import { useFestivalRoots } from '../../hooks/concerts/useFestivalRoots'
import { useTranslations } from 'next-intl'

type FestivalRootSelectProps = {
  values: number[]
  onValuesChange: (value: number[]) => void
}

const FestivalRootSelect = ({ ...props }: FestivalRootSelectProps) => {
  const { data: festivalRoots, isPending } = useFestivalRoots(true, {
    sort: { sort_by: 'name', sort_asc: true },
  })
  return (
    <Select
      name="festivalRoot"
      items={festivalRoots}
      isLoading={isPending}
      multiple
      fixedHeight
      {...props}
    />
  )
}

type FestivalRootFilterProps = {
  values: number[] | null
  onSubmit: (value: number[]) => void
}

export const FestivalRootFilter = ({
  values: submittedValues,
  onSubmit,
}: FestivalRootFilterProps) => {
  const { data: festivalRoots } = useFestivalRoots(null, { ids: submittedValues })
  const [selectedIds, setSelectedIds] = useState<number[]>(submittedValues ?? [])
  const t = useTranslations('FestivalRootFilter')

  useEffect(() => {
    setSelectedIds(submittedValues ?? [])
  }, [submittedValues])
  return (
    <FilterButton
      label={t("festival")}
      items={festivalRoots}
      selectedIds={selectedIds}
      submittedValues={submittedValues}
      onSubmit={onSubmit}
    >
      <FestivalRootSelect values={selectedIds} onValuesChange={setSelectedIds} />
    </FilterButton>
  )
}
