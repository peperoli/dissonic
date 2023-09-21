export const getPagination = function (page: number = 1, size: number = 25, count: number = 0) {
  const limit = size ? +size : 25
  const from = page ? (page - 1) * limit : 0
  const to = count >= size ? from + size : count

  return [from, to]
}
