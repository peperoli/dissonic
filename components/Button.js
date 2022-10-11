export default function Button({ onClick, label, style, icon }) {
	return (
		<button type="button" onClick={onClick} className={`btn${style === 'primary' ? ' btn-primary' : ' btn-link'}`}>
			{icon}
			{label}
		</button>
	)
}