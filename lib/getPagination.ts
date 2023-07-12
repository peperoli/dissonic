export const getPagination = function (page: number = 0, size: number = 25, count: number = 0) {
  const limit = size ? +size : 25
  const from = page ? page * limit : 0
  const to = count >= size ? from + size - 1 : count

  return [from, to]
}
