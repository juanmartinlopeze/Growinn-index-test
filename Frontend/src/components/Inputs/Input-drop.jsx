import React from 'react'
import './Input.css'

export function InputDrop({ label, placeholder = 'Selecciona una opción', name, value, onChange, required = false, options = [], disabled = false, className = '' }) {
	const inputId = `input-${name}`

	return (
		<div className={`flex flex-col w-full gap-sm text-left ${className}`}>
			{label && (
				<label className='text-body-small text-text-primary font-medium' htmlFor={inputId}>
					{label}
				</label>
			)}
			<div className='input-field-container relative flex items-center bg-neutral-white border-1 border-neutral-400 rounded-sm overflow-hidden transition-all duration-200 ease-in-out focus-within:shadow-[0_0_0_2px_rgba(245,111,16,0.1)] focus-within:border-[var(--color-primary-n400)]'>
				<select
					id={inputId}
					name={name}
					className='input-field flex-1 border-none py-3.5 px-4 pr-10 text-text-caption outline-none bg-transparent text-text-secondary w-full appearance-none'
					{...(value !== undefined ? { value } : {})}
					onChange={onChange}
					required={required}
					disabled={disabled}
					aria-disabled={disabled}
				>
					<option value='' disabled hidden>
						{placeholder}
					</option>

					{options.map((opt) =>
						opt && typeof opt === 'object' && Array.isArray(opt.options) ? (
							<optgroup key={opt.label} label={opt.label}>
								{opt.options.map((o) => (
									<option key={o.value} value={o.value} disabled={o.disabled}>
										{o.label}
									</option>
								))}
							</optgroup>
						) : (
							<option key={opt} value={opt}>
								{opt}
							</option>
						)
					)}
				</select>

				<span className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500'>
					<svg width='18' height='18' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
						<path d='M6 9l6 6 6-6' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
					</svg>
				</span>
			</div>
		</div>
	)
}

export default InputDrop
