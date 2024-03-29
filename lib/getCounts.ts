export type ItemCount = {
  id: number | string
  name: string
  count: number
}

export function getCounts<T>(
  items: ({ id: string | number; name: string } & T)[]
): (ItemCount & T)[] {
  const itemCounts: (ItemCount & T)[] = []
  items.forEach(item => {
    const matchingItem = itemCounts.find(itemCount => itemCount.id === item.id)
    if (!matchingItem) {
      itemCounts.push({
        count: 1,
        ...item,
      })
    } else if (matchingItem?.count) {
      matchingItem.count += 1
    }
  })

  return itemCounts
}
