import { Fragment } from "react"

export default function GenreChart({ bands }) {
  const genres = []

  bands.forEach(band => (
    band.genres.forEach(genre => {
      if (!genres.find(item => item.name === genre)) {
        genres.push({ name: genre, count: 1 })
      } else {
        genres.find(item => item.name === genre).count += 1
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
      <div className="grid grid-cols-2 items-center gap-x-4 gap-y-2">
        {genres.sort(compare).map((genre, index) => (
          <Fragment key={index}>
            <div>{genre.name}</div>
            <div className="h-4 rounded bg-venom" style={{ width: genre.count / highestCount * 200 }}>
            <span className="flex pl-1 text-xs font-bold text-slate-800">{genre.count}</span>
            </div>
          </Fragment>
        ))}
      </div>
    </section>
  )
}