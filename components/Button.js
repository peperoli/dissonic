export default function Button({ onClick, label, style, type, icon, disabled }) {
	return (
		<button 
		type="button" 
		onClick={onClick}
		disabled={disabled}
		className={`btn${style === 'primary' ? ' btn-primary' : ' btn-secondary'}${type === 'icon' ? ' btn-icon' : ''}`}>
			{icon}
			{label}
		</button>
	)
}