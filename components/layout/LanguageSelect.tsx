'use client'

import { useLocale, useTranslations } from 'next-intl'
import { FilterButton } from '../FilterButton'
import { Select } from '../forms/Select'
import { setLocale } from '@/actions/i18n'
import { ListItem } from '@/types/types'

export const LanguageSelect = () => {
  const t = useTranslations('LanguageSelect')
  const locale = useLocale()
  const languageItems: ListItem[] = [
    { id: 0, name: 'English', locale: 'en' },
    { id: 1, name: 'Deutsch', locale: 'de-CH' },
  ]
  console.log('locale', locale)

  return (
    <FilterButton
      label={t('language')}
      items={languageItems}
      type="singleselect"
      size="sm"
      appearance="tertiary"
      selectedId={languageItems.findIndex(item => item.locale === locale)}
    >
      <Select
        name="sort"
        items={languageItems}
        value={languageItems.findIndex(item => item.locale === locale)}
        onValueChange={value => setLocale(languageItems[value].locale)}
        searchable={false}
      />
    </FilterButton>
  )
}
