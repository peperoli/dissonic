export default function GenreCheckbox({ genre, selectedGenres, setSelectedGenres }) {
  function handleChange(genreName) {
    if (selectedGenres.some(item => item === genreName)) {
      setSelectedGenres(selectedGenres.filter(item => item !== genreName))
    } else {
      setSelectedGenres([
        ...selectedGenres,
        genreName
      ])
    }
  }
  return (
    <label>
      <input
        type="checkbox"
        name="genres"
        value={genre.name}
        checked={selectedGenres.some(selectedGenre => selectedGenre === genre.name)}
        onChange={() => handleChange(genre.name)}
      />
      {genre.name}
    </label>
  )
}