import React, { useState } from 'react'
import './InputDefault.css'

export function InputDefault({ icon = false, label, placeholder, type = 'text', name, value, onChange, required = false }) {
	const emailIcon = (
		<svg xmlns='http://www.w3.org/2000/svg' width='22' height='18' fill='none' viewBox='0 0 22 18'>
			<path
				stroke='#8E8E8E'
				d='m1.5 3.75 7.58 5.39c.49.39.96.59 1.42.59s.93-.2 1.42-.59l7.58-5.39M3 16.5h15a1.5 1.5 0 0 0 1.5-1.5V3A1.5 1.5 0 0 0 18 1.5H3A1.5 1.5 0 0 0 1.5 3v12A1.5 1.5 0 0 0 3 16.5Z'
			/>
		</svg>
	)

	const UserIcon = (
		<svg xmlns='http://www.w3.org/2000/svg' width='18' height='19' fill='none' viewBox='0 0 18 19'>
			<path
				stroke='#999'
				stroke-linecap='round'
				stroke-linejoin='round'
				stroke-width='2'
				d='M1 18v-2c0-1.06.562-2.078 1.562-2.828S4.92 12 6.333 12h5.334c1.414 0 2.77.421 3.77 1.172S17 14.939 17 16v2M5 5a4 4 0 1 0 8 0 4 4 0 0 0-8 0'
			/>
		</svg>
	)

	const passwordIcon = (
		<svg xmlns='http://www.w3.org/2000/svg' width='18' height='20' fill='none' viewBox='0 0 18 20'>
			<path
				stroke='#999'
				stroke-linecap='round'
				stroke-linejoin='round'
				stroke-width='2'
				d='M14 8V6A5 5 0 0 0 4 6v2m5 4.5v2M5.8 19h6.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C17 16.72 17 15.88 17 14.2v-1.4c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C14.72 8 13.88 8 12.2 8H5.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C1 10.28 1 11.12 1 12.8v1.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C3.28 19 4.12 19 5.8 19'
			/>
		</svg>
	)

	const eyeOpened = (
		<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' fill='none' viewBox='0 0 20 14'>
			<path stroke='#999' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M8 7a2 2 0 1 0 4 0 2 2 0 0 0-4 0' />
			<path stroke='#999' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 7q-3.6 6-9 6T1 7q3.6-6 9-6t9 6' />
		</svg>
	)

	const eyeClosed = (
		<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='none' viewBox='0 0 20 20'>
			<path
				stroke='#999'
				stroke-linecap='round'
				stroke-linejoin='round'
				stroke-width='2'
				d='M8.585 8.587a2 2 0 0 0 2.829 2.828m3.267 3.258A8.7 8.7 0 0 1 10 16q-5.4 0-9-6 1.908-3.18 4.32-4.674M8.18 4.18A9 9 0 0 1 10 4q5.4 0 9 6-1 1.665-2.138 2.87M1 1l18 18'
			/>
		</svg>
	)

	const [inputType, setInputType] = useState('password')
	const [eye, setEye] = useState(eyeClosed)

	const setIcon = () => {
		if (name === 'email') {
			return emailIcon
		} else if (name === 'name' || name === 'username') {
			return UserIcon
		} else if (name === 'password') {
			return passwordIcon
		} else {
			return null
		}
	}

	const handleToggle = () => {
		if (inputType === 'password') {
			setInputType('text')
			setEye(eyeOpened)
		} else {
			setInputType('password')
			setEye(eyeClosed)
		}
	}

	const inputId = `input-${name}`

	return (
		<div className='input-default-container'>
			{label && (
				<label className='input-label' htmlFor={inputId}>
					{label}
					{required && <span className='required'>*</span>}
				</label>
			)}
			<div className='input-field-container'>
				{icon && <div className='input-icon'>{setIcon()}</div>}
				<input
					id={inputId}
					className='input-field'
					name={name}
					type={name === 'password' ? inputType : type} // Use inputType for password fields
					placeholder={placeholder}
					value={value}
					onChange={onChange}
					required={required}
				/>
				{name === 'password' && (
					<span className='eye-icon' onClick={handleToggle}>
						{eye}
					</span>
				)}
			</div>
		</div>
	)
}
