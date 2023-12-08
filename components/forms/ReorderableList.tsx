import { useEffect, useState } from 'react'
import { Option } from '../../types/types'
import clsx from 'clsx'

type DropZoneProps = {
  isVisible: boolean
}

function DropZone({ isVisible }: DropZoneProps) {
  return (
    <div className={clsx('drop-zone bg-slate-700', isVisible ? 'h-6' : 'h-0 overflow-hidden')} />
  )
}

type ReorderableListItemProps = {
  item: string
  index: number
  dragged: number | null
  setDragged: (value: number | null) => void
  dropZone: number
}

function ReorderableListItem({ item, index, ...props }: ReorderableListItemProps) {
  return (
    <div>
      <li
        role="button"
        onMouseDown={event => {
          event.preventDefault()
          props.setDragged(index)
        }}
        className="bg-slate-750"
      >
        {item}
      </li>
      <DropZone isVisible={props.dragged !== null && props.dropZone === index + 1} />
    </div>
  )
}

type ReorderableListProps = {
  items: Option[]
}

export function ReorderableList({}: ReorderableListProps) {
  const initialItems = [
    'Arch Enemy',
    'Behemoth',
    'Cellar Darling',
    'Delain',
    'Eluveitie',
    'Fleshgod Apocalypse',
    'Gojira',
    'Halestorm',
    'Infected Rain',
    'Jinjer',
  ]
  const [items, setItems] = useState(initialItems)
  const [dragged, setDragged] = useState<number | null>(null)
  const [mouse, setMouse] = useState([0, 0])
  const [dropZone, setDropZone] = useState(0)

  useEffect(() => {
    function handleMouseMove(event: MouseEvent) {
      setMouse([event.x, event.y])
    }

    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    if (dragged !== null) {
      const dropZoneElements = Array.from(document.querySelectorAll('.drop-zone'))
      console.log(dropZoneElements)

      const elementPositions = dropZoneElements.map(element => element.getBoundingClientRect().top)
      const absoluteDifferences = elementPositions.map(position => Math.abs(position - mouse[1]))
      let result = absoluteDifferences.indexOf(Math.min(...absoluteDifferences))
      if (result > dragged) {
        result += 1
      }
      setDropZone(result)
    }
  }, [dragged, mouse])

  function reorderListForward(items: string[], start: number, end: number) {
    const temp = items[start]
    const reorderedItems = [...items]

    for (let i = start; i < end; i++) {
      reorderedItems[i] = reorderedItems[i + 1]
    }
    reorderedItems[end - 1] = temp

    return reorderedItems
  }

  const reorderListBackward = <T,>(items: T[], start: number, end: number) => {
    const temp = items[start]
    const reorderedItems = [...items]

    for (let i = start; i > end; i--) {
      reorderedItems[i] = reorderedItems[i - 1]
    }

    reorderedItems[end] = temp

    return reorderedItems
  }

  function reorderList(items: string[], start: number, end: number) {
    if (start < end) {
      return reorderListForward(items, start, end)
    } else if (start > end) {
      return reorderListBackward(items, start, end)
    }

    return items
  }

  useEffect(() => {
    function handleMouseUp(event: MouseEvent) {
      if (dragged !== null) {
        event.preventDefault()
        setDragged(null)
        setItems(prev => reorderList(prev, dragged, dropZone))
      }
    }

    document.addEventListener('mouseup', handleMouseUp)
    return () => document.removeEventListener('mouseup', handleMouseUp)
  })
  return (
    <ul className="grid gap-1">
      <button type="button" onClick={() => setItems(initialItems)}>
        Reset items
      </button>
      {dragged !== null && (
        <li
          className="fixed z-50 -translate-y-1/2 bg-slate-750 shadow-xl"
          style={{ top: `${mouse[1]}px` }}
        >
          {items[dragged]}
        </li>
      )}
      <DropZone isVisible={dragged !== null && dropZone === 0} />
      {items.map((item, index) => {
        if (dragged !== index) {
          return (
            <ReorderableListItem
              item={item}
              index={index}
              dragged={dragged}
              setDragged={setDragged}
              dropZone={dropZone}
              key={index}
            />
          )
        }
      })}
      <pre>dragged: {JSON.stringify(dragged)}</pre>
      <pre>dropZone: {JSON.stringify(dropZone)}</pre>
      <pre>mouse: {JSON.stringify(mouse)}</pre>
      <pre className="text-sm">items: {JSON.stringify(items, null, 2)}</pre>
    </ul>
  )
}
