import clsx from 'clsx'
import { forwardRef, useEffect, useRef, useState } from 'react'
import { reorderList } from '../../lib/reorderList'
import { ReorderableListItem } from '../../types/types'
import { Chip } from '../Chip'

type DropZoneProps = {
  item?: ReorderableListItem
  isVisible: boolean
}

const DropZone = forwardRef<HTMLDivElement, DropZoneProps>(({ item, isVisible }, ref) => {
  return (
    <div
      ref={ref}
      className={clsx(
        'drop-zone',
        isVisible
          ? 'px-2 py-1 border-2 border-dashed border-slate-300 rounded-md bg-slate-750'
          : 'w-0 h-0 p-0 overflow-hidden'
      )}
    >
      <span className="invisible">{item?.name}</span>
    </div>
  )
})
DropZone.displayName = 'DropZone'

type ReorderableItemProps = {
  item?: ReorderableListItem
  index: number
  dragged: { id: number; index: number } | null
  setDragged: (value: { id: number; index: number } | null) => void
  dropZone: number
  getRef: (node: HTMLDivElement | null, index: number) => void
  removeItem: () => void
}

function ReorderableItem({
  item,
  index,
  dragged,
  setDragged,
  dropZone,
  getRef,
  removeItem,
}: ReorderableItemProps) {
  return (
    <div className={clsx('flex', dragged !== null && dropZone === index + 1 && 'gap-1')}>
      <Chip
        label={item?.name ?? ''}
        onMouseDown={event => {
          event.preventDefault()
          setDragged({ id: item!.id, index })
        }}
        remove={removeItem}
      />
      <DropZone
        ref={node => getRef(node, index + 1)}
        item={item}
        isVisible={dragged !== null && dropZone === index + 1}
      />
    </div>
  )
}

type ReorderableListProps = {
  items?: ReorderableListItem[]
  selectedItems: number[]
  setSelectedItems: (values: number[]) => void
}

export function ReorderableList({ items, selectedItems, setSelectedItems }: ReorderableListProps) {
  const [dragged, setDragged] = useState<{ id: number; index: number } | null>(null)
  const [mouse, setMouse] = useState([0, 0])
  const [dropZone, setDropZone] = useState(0)
  const dropZonesRef = useRef<Map<number, HTMLDivElement> | null>(null)

  function getRef(node: HTMLDivElement | null, index: number) {
    if (!dropZonesRef.current) {
      dropZonesRef.current = new Map()
    }
    const map = dropZonesRef.current
    if (node) {
      map.set(index, node)
    } else {
      map.delete(index)
    }
  }

  useEffect(() => {
    function handleMouseMove(event: MouseEvent) {
      setMouse([event.x, event.y])
    }

    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    if (dragged !== null && dropZonesRef.current) {
      const dropZoneElements = Array.from(dropZonesRef.current.values())
      const elementPositions = dropZoneElements.map(element => element.getBoundingClientRect())
      const absoluteDifferences = elementPositions.map(
        position => Math.abs(position.left - mouse[0]) + Math.abs(position.top - mouse[1])
      )
      let result = absoluteDifferences.indexOf(Math.min(...absoluteDifferences))
      if (result > dragged.index) {
        result += 1
      }
      setDropZone(result)
    }
  }, [dragged, mouse])

  useEffect(() => {
    function handleMouseUp(event: MouseEvent) {
      if (dragged !== null) {
        event.preventDefault()
        setDragged(null)
        setSelectedItems(reorderList(selectedItems, dragged.index, dropZone))
      }
    }

    document.addEventListener('mouseup', handleMouseUp)
    return () => document.removeEventListener('mouseup', handleMouseUp)
  })

  function removeItem(selectedItem: number) {
    setSelectedItems(selectedItems.filter(item => item !== selectedItem))
  }
  return (
    <>
      <ul className="flex flex-wrap gap-1">
        {dragged !== null && (
          <Chip
            label={items?.find(item => item.id === dragged.id)?.name || 'Band'}
            className="fixed z-50 -translate-y-1/2 opacity-80 shadow-2xl pointer-events-none"
            style={{ left: `${mouse[0]}px`, top: `${mouse[1]}px` }}
          />
        )}
        {dragged && (
          <DropZone
            ref={node => getRef(node, 0)}
            item={items?.find(item => item.id === dragged.id)}
            isVisible={dragged !== null && dropZone === 0}
          />
        )}
        {selectedItems.map((selectedItem, index) => {
          if (dragged?.index !== index) {
            return (
              <ReorderableItem
                item={items?.find(item => item.id === selectedItem)}
                index={index}
                dragged={dragged}
                setDragged={setDragged}
                dropZone={dropZone}
                getRef={getRef}
                removeItem={() => removeItem(selectedItem)}
                key={index}
              />
            )
          }
        })}
      </ul>
      <div>
        <pre>dragged: {JSON.stringify(dragged)}</pre>
        <pre>dropZone: {JSON.stringify(dropZone)}</pre>
        <pre>mouse: {JSON.stringify(mouse)}</pre>
        <pre className="text-sm">selectedItems: {JSON.stringify(selectedItems, null, 2)}</pre>
      </div>
    </>
  )
}
