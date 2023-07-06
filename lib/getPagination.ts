export const getPagination = function (page: number, size: number, count: number) {
  const limit = size ? +size : 25
  const from = page ? page * limit : 0
  const to = count >= size ? from + size - 1 : count

  return [from, to]
}
