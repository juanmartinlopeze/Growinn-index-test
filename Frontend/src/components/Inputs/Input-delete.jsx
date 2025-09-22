import './Input.css'

export function InputDelete({ label, placeholder, type = 'text', name, value, onChange, onClick, required = false }) {
	const inputId = `input-${name}`

	return (
		<div className='flex flex-col w-full gap-sm text-left'>
			{label && (
				<label className='text-body-small text-text-primary font-medium' htmlFor={inputId}>
					{label}
					{required && <span className='required'>*</span>}
				</label>
			)}
			<div className='input-field-container flex items-center justify-between bg-neutral-white border-1 border-neutral-400 rounded-sm overflow-hidden transition-all duration-200 ease-in-out focus-within:shadow-[0_0_0_2px_rgba(245,111,16,0.1)] focus-within:border-[var(--color-primary-n400)]'>
				<input
					id={inputId}
					className='input-field py-3.5 px-4  flex-1 border-none text-text-caption outline-none bg-transparent text-text-secondary w-full'
					name={name}
					type={type}
					placeholder={placeholder}
					value={value}
					onChange={onChange}
					required={required}
				/>
				<hr className='h-13 border-l border-neutral-400' />
				<span onClick={onClick} className='delete-icon flex items-center justify-center py-3.5 px-4 cursor-pointer hover:bg-red-500 fill-neutral-400 hover:fill-neutral-50 transition-all duration-200 ease-in-out'>
					<svg className='' width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
						<path
							className=''
							d='M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6H4V4H9V3H15V4H20V6H19V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM17 6H7V19H17V6ZM9 17H11V8H9V17ZM13 17H15V8H13V17Z'
						/>
					</svg>
				</span>
			</div>
		</div>
	)
}
