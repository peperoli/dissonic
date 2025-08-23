import useMediaQuery from '@/hooks/helpers/useMediaQuery'
import { getCounts, ItemCount } from '@/lib/getCounts'
import { useEffect, useState, JSX } from 'react'
import { Button } from '../Button'
import { useTranslations } from 'next-intl'
import { Tables } from '@/types/supabase'

type TopGridProps = {
  headline: string
} & (
  | {
      items: Tables<'bands'>[]
      Item: ({ topItem }: { topItem: ItemCount & Tables<'bands'> }) => JSX.Element
    }
  | {
      items: Tables<'locations'>[]
      Item: ({ topItem }: { topItem: ItemCount & Tables<'locations'> }) => JSX.Element
    }
)

export const TopGrid = ({ headline, items, Item }: TopGridProps) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [visibleItems, setVisibleItems] = useState(9)
  const t = useTranslations('TopGrid')
  const itemCounts = getCounts<Tables<'bands'> | Tables<'locations'>>(items).filter(item => item.count > 1)

  useEffect(() => {
    if (isDesktop) {
      setVisibleItems(8)
    } else {
      setVisibleItems(9)
    }
  }, [isDesktop])

  function compare(a: ItemCount, b: ItemCount) {
    if (a.count === b.count) {
      return a.name.localeCompare(b.name)
    }
    return b.count - a.count
  }

  if (itemCounts.length > 0) {
    return (
      <div className="rounded-lg bg-slate-800 p-6">
        <h2>{headline}</h2>
        <div className="grid grid-cols-3 gap-4 md:grid-cols-4 md:gap-5">
          {itemCounts
            .sort(compare)
            .slice(0, visibleItems)
            .map(item => (
              <Item topItem={item as any} key={item.id} />
            ))}
        </div>
        {itemCounts.length >= (isDesktop ? 8 : 9) && (
          <div className="mt-6 flex justify-center">
            {visibleItems < itemCounts.length ? (
              <Button onClick={() => setVisibleItems(itemCounts.length)} label={t('showMore')} />
            ) : (
              <Button onClick={() => setVisibleItems(8)} label={t('showLess')} />
            )}
          </div>
        )}
      </div>
    )
  }

  return null
}
