import React, { useState } from 'react'
import './InputDefault.css'

export function InputDefault({ icon = false, label, placeholder, type = 'text', name, value, onChange, required = false }) {
	const emailIcon = (
		<svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 4L9.16492 9.71544C9.82609 10.1783 10.1567 10.4097 10.5163 10.4993C10.8339 10.5785 11.1661 10.5785 11.4837 10.4993C11.8433 10.4097 12.1739 10.1783 12.8351 9.71544L21 4M5.8 17H16.2C17.8802 17 18.7202 17 19.362 16.673C19.9265 16.3854 20.3854 15.9265 20.673 15.362C21 14.7202 21 13.8802 21 12.2V5.8C21 4.11984 21 3.27976 20.673 2.63803C20.3854 2.07354 19.9265 1.6146 19.362 1.32698C18.7202 1 17.8802 1 16.2 1H5.8C4.11984 1 3.27976 1 2.63803 1.32698C2.07354 1.6146 1.6146 2.07354 1.32698 2.63803C1 3.27976 1 4.11984 1 5.8V12.2C1 13.8802 1 14.7202 1.32698 15.362C1.6146 15.9265 2.07354 16.3854 2.63803 16.673C3.27976 17 4.11984 17 5.8 17Z" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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
					type={name === 'password' ? inputType : type}
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
