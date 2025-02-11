export function getPagination(page: number = 1, size: number = 25) {
  const limit = size ? +size : 25
  const from = page ? (page - 1) * limit : 0
  const to = page ? from + size - 1 : size - 1

  return [from, to]
}
