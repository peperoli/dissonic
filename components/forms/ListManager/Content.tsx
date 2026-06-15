import { ImportIcon, ArrowDownUpIcon, XCircleIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useInstantSearch } from 'react-instantsearch'
import { Reorder } from 'motion/react'
import { Band, ReorderableListItem } from '../../../types/types'
import { Button } from '../../Button'
import clsx from 'clsx'
import { BandItem } from './BandItem'
import { ListManagerSearch } from './Search'
import { useListManager } from './Context'

const InsertHere = ({ reorderItems, isDown }: { reorderItems: () => void; isDown?: boolean }) => {
  const t = useTranslations('ListManager')
  return (
    <div className="relative flex items-center justify-center">
      <hr className="mx-2 my-0 w-full border-t border-slate-500" />
      <Button
        onClick={reorderItems}
        label={t('insertHere')}
        contentType="icon"
        size="small"
        icon={<ImportIcon className={clsx('size-icon', !isDown && 'rotate-180')} />}
        appearance="secondary"
        className="absolute"
      />
    </div>
  )
}

type ListItemProps = {
  band: ReorderableListItem<Band>
  index: number
  removeItem: () => void
}

const ListItem = ({ band, removeItem, index }: ListItemProps) => {
  const { selectedItemToReorder, setSelectedItemToReorder, reorderItems } = useListManager()
  const t = useTranslations('ListManager')
  const selectedToReorder = selectedItemToReorder === index

  return (
    <>
      {selectedItemToReorder !== null && !selectedToReorder && index === 0 && (
        <InsertHere reorderItems={() => reorderItems(selectedItemToReorder, index)} />
      )}
      <Reorder.Item
        value={band}
        dragListener={false}
        className={clsx(
          'group flex items-center gap-4 rounded-lg p-2',
          selectedToReorder && 'bg-venom/10'
        )}
      >
        <BandItem band={band} />
        <div
          className={clsx(
            'flex flex-none group-focus-within:opacity-100 group-hover:opacity-100 md:opacity-0',
            selectedItemToReorder !== null && 'invisible'
          )}
        >
          <Button
            onClick={removeItem}
            label={t('removeEntry')}
            contentType="icon"
            icon={<XCircleIcon className="size-icon text-red" />}
            appearance="tertiary"
          />
          <Button
            onClick={() => setSelectedItemToReorder(index)}
            label={t('reorderEntry')}
            contentType="icon"
            icon={<ArrowDownUpIcon className="size-icon" />}
            appearance="tertiary"
          />
        </div>
      </Reorder.Item>
      {selectedItemToReorder !== null &&
        !selectedToReorder &&
        selectedItemToReorder !== index + 1 && (
          <InsertHere
            reorderItems={() => reorderItems(selectedItemToReorder, index + 1)}
            isDown={selectedItemToReorder < index + 1}
          />
        )}
    </>
  )
}

export const ListManagerContent = () => {
  const { listItems, setListItems, removeItem } = useListManager()
  const { indexUiState } = useInstantSearch()

  if (indexUiState?.query?.length) {
    return <ListManagerSearch />
  }

  return (
    <Reorder.Group
      values={listItems}
      onReorder={setListItems}
      axis="y"
      className="my-2 grid h-[calc(100%-1rem)] content-start py-4"
    >
      {listItems.map((listItem, index) => (
        <ListItem
          key={listItem.id}
          band={listItem}
          index={index}
          removeItem={() => removeItem(listItem.id)}
        />
      ))}
    </Reorder.Group>
  )
}
