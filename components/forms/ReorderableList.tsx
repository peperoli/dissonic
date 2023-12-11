import clsx from 'clsx'
import { forwardRef, useEffect, useRef, useState } from 'react'
import { reorderList } from '../../lib/reorderList'
import { ListItem, Option } from '../../types/types'

type DropZoneProps = {
  isVisible: boolean
}

const DropZone = forwardRef<HTMLDivElement, DropZoneProps>(({ isVisible }, ref) => {
  return (
    <div
      ref={ref}
      className={clsx('drop-zone bg-slate-700', isVisible ? 'w-4 h-6' : 'h-0 overflow-hidden')}
    />
  )
})
DropZone.displayName = 'DropZone'

type ReorderableListItemProps = {
  item: Option
  index: number
  dragged: number | null
  setDragged: (value: number | null) => void
  dropZone: number
  getRef: (node: HTMLDivElement | null, index: number) => void
}

function ReorderableListItem({ item, index, getRef, ...props }: ReorderableListItemProps) {
  return (
    <div className="flex">
      <li
        role="button"
        onMouseDown={event => {
          event.preventDefault()
          props.setDragged(index)
        }}
        className="bg-slate-750"
      >
        {item.name}
      </li>
      <DropZone
        ref={node => getRef(node, index + 1)}
        isVisible={props.dragged !== null && props.dropZone === index + 1}
      />
    </div>
  )
}

type ReorderableListProps = {
  listItems: ReorderableListItem[]
  onListReorder: (values: ListItem[]) => void
}

export function ReorderableList({ listItems, onListReorder }: ReorderableListProps) {
  const [dragged, setDragged] = useState<number | null>(null)
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
      if (result > dragged) {
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
        onListReorder(reorderList(listItems, dragged, dropZone))
      }
    }

    document.addEventListener('mouseup', handleMouseUp)
    return () => document.removeEventListener('mouseup', handleMouseUp)
  })
  return (
    <>
      <ul className="flex flex-wrap gap-1">
        {dragged !== null && (
          <li
            className="fixed z-50 -translate-y-1/2 bg-slate-750 shadow-xl"
            style={{ left: `${mouse[0]}px`, top: `${mouse[1]}px` }}
          >
            {listItems[dragged].name}
          </li>
        )}
        <DropZone ref={node => getRef(node, 0)} isVisible={dragged !== null && dropZone === 0} />
        {listItems.map((item, index) => {
          if (dragged !== index) {
            return (
              <ReorderableListItem
                item={item}
                index={index}
                dragged={dragged}
                setDragged={setDragged}
                dropZone={dropZone}
                getRef={getRef}
                key={index}
              />
            )
          }
        })}
      </ul>
      <pre>dragged: {JSON.stringify(dragged)}</pre>
      <pre>dropZone: {JSON.stringify(dropZone)}</pre>
      <pre>mouse: {JSON.stringify(mouse)}</pre>
      <pre className="text-sm">items: {JSON.stringify(listItems, null, 2)}</pre>
    </>
  )
}
