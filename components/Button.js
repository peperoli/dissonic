export default function Button({ handleClick, label, style }) {
	return (
		<button type="button" onClick={handleClick} className={`btn${style === 'primary' ? ' btn-primary' : ' btn-link'}`}>
			{label}
		</button>
	)
}