import './Input.css'

export function InputBox({ placeholder, type = 'text', name, value, required = false }) {
	const inputId = `input-${name}`

	return (
		<div className='flex flex-col w-full gap-sm text-left'>
			<div className='input-field-container flex items-center justify-between bg-neutral-white border-1 border-neutral-400 rounded-sm overflow-hidden transition-all duration-200 ease-in-out focus-within:shadow-[0_0_0_2px_rgba(245,111,16,0.1)] focus-within:border-[var(--color-primary-n400)]'>
				<input
					id={inputId}
					className='input-field py-3.5 px-4 w-full flex-1 border-none text-text-caption outline-none bg-transparent text-text-secondary'
					name={name}
					type={type}
					placeholder={placeholder}
					value={value}
					required={required}
				/>
			</div>
		</div>
	)
}
