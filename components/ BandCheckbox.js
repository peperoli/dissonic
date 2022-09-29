export default function BandCheckbox({ concertId, band, selectedConcertBands, setSelectedConcertBands }) {
  const isSelected = selectedConcertBands.some(item => item.band_id === band.id)

  function handleChange(bandId) {
    if (selectedConcertBands.some(item => item.band_id === bandId)) {
      setSelectedConcertBands(selectedConcertBands.filter(item => item.band_id !== bandId))
    } else {
      setSelectedConcertBands([
        ...selectedConcertBands,
        { concert_id: concertId, band_id: bandId, }
      ])
    }
  }

  return (
    <label key={band.id} className="block" htmlFor={`band${band.id}`}>
      <input
        type="checkbox"
        name="bands"
        value={`band${band.id}`}
        id={`band${band.id}`}
        checked={isSelected}
        onChange={() => handleChange(band.id)}
      />
      {band.name}
    </label>
  )
}