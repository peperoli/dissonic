export default function Button({ handleClick, label, style, icon }) {
	return (
		<button type="button" onClick={handleClick} className={`btn${style === 'primary' ? ' btn-primary' : ' btn-link'}`}>
			{icon}
			{label}
		</button>
	)
}