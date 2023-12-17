function reorderListForward(items: number[], start: number, end: number) {
  const temp = items[start]
  const reorderedItems = [...items]

  for (let i = start; i < end; i++) {
    reorderedItems[i] = reorderedItems[i + 1]
  }
  reorderedItems[end - 1] = temp

  return reorderedItems
}

function reorderListBackward(items: number[], start: number, end: number) {
  const temp = items[start]
  const reorderedItems = [...items]

  for (let i = start; i > end; i--) {
    reorderedItems[i] = reorderedItems[i - 1]
  }

  reorderedItems[end] = temp

  return reorderedItems
}

export function reorderList(items: number[], start: number, end: number) {
  if (start < end) {
    return reorderListForward(items, start, end)
  } else if (start > end) {
    return reorderListBackward(items, start, end)
  }

  return items
}
