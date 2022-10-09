export default function BandCheckbox({ band, selectedConcertBands, setSelectedConcertBands }) {
  const isSelected = selectedConcertBands.some(item => item === band.id)

  function handleChange() {
    if (selectedConcertBands.some(item => item === band.id)) {
      setSelectedConcertBands(selectedConcertBands.filter(item => item !== band.id))
    } else {
      setSelectedConcertBands([
        ...selectedConcertBands,
        band.id
      ])
    }
  }

  return (
    <label className="block" htmlFor={`band${band.id}`}>
      <input
        type="checkbox"
        name="bands"
        value={`band${band.id}`}
        id={`band${band.id}`}
        checked={isSelected}
        onChange={handleChange}
      />
      {band.name}
    </label>
  )
}