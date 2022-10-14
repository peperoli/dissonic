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
  return (
    <section>
      <h2>Genres</h2>
      <div className="grid grid-cols-2 items-center gap-x-4 gap-y-2">
        {genres.map(genre => (
          <>
            <div>{genre.name}</div>
            <div className="h-4 rounded bg-venom" style={{ width: genre.count / highestCount * 100 }} />
          </>
        ))}
      </div>
    </section>
  )
}