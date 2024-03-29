interface ObjectWithId {
  id: string | number
  [key: string]: any
}

export function getUniqueObjects<T extends ObjectWithId>(arrayOfObjects: (T | null | undefined)[]): NonNullable<T>[] {
  if (!arrayOfObjects) return []
  const uniqueObjects: T[] = []
  for (let i = 0; i < arrayOfObjects.length; i++) {
    const object = arrayOfObjects[i]
    if (object) {
      if (!uniqueObjects.find(uniqueObject => uniqueObject.id === object.id)) {
        uniqueObjects.push(object)
      }
    }
  }
  return uniqueObjects
}
