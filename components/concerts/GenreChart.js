import { Fragment } from "react"

export default function GenreChart({ bands }) {
  const genres = []

  bands.forEach(band => (
    band.genres.forEach(genre => {
      if (!genres.find(item => item.id === genre.id)) {
        genres.push({ id: genre.id, name: genre.name, count: 1 })
      } else {
        genres.find(item => item.id === genre.id).count += 1
      }
    })
  ))
  const highestCount = Math.max(...genres.map(item => item.count))

  function compare(a, b) {
    let comparison = 0
    if (a.count > b.count) {
      comparison = -1
    } else if (a.count < b.count) {
      comparison = 1
    }
    return comparison
  }
  return (
    <section>
      <h2>Genres</h2>
      <div className="grid md:grid-cols-2 items-center gap-x-4 gap-y-2">
        {genres.sort(compare).map((genre, index) => (
          <Fragment key={index}>
            <div className="hidden md:block">{genre.name}</div>
            <div className="flex items-center h-6 md:h-4 rounded bg-venom" style={{ width: genre.count / highestCount * 100 + '%' }}>
              <div className="md:hidden pl-2 mix-blend-difference whitespace-nowrap">{genre.name}</div>
              <span className="flex pl-2 md:pl-1 md:text-xs mix-blend-difference">{genre.count}</span>
            </div>
          </Fragment>
        ))}
      </div>
    </section>
  )
}