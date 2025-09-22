import React from 'react'
import { InputForm } from '../../components/index'
import PrincipalButton from '../../components/UiButtons/PrincipalButton'

export default function LoginCard({ email, password, remember, loading, msg, msgKind, onEmailChange, onPasswordChange, onRememberChange, onSubmit, onForgotPassword }) {
	return (
		<form className='flex flex-col items-center justify-center gap-[50px] w-full max-w-[500px] shadow-[0_4px_20px_rgba(0,0,0,0.14)] rounded-[16px] p-[48px_30px] box-border' onSubmit={onSubmit}>
			<div className='w-full flex flex-col gap-8'>
				<InputForm icon={true} label='Correo electrónico' placeholder='Ingresa tu correo' name='email' type='email' value={email} onChange={onEmailChange} required />
				<InputForm icon={true} label='Contraseña' placeholder='Ingresa tu contraseña' name='password' type='password' value={password} onChange={onPasswordChange} required />
			</div>
			<div className='w-full flex flex-col gap-6'>
				{msg && (
					<div
						role='alert'
						aria-live='polite'
						className={`p-3 rounded-lg m-0 text-[14px] ${
							msgKind === 'error' ? 'border border-[#FCA5A5] bg-[#FEF2F2] text-[#991B1B]' : 'border border-[#6EE7B7] bg-[#ECFDF5] text-[#065F46]'
						}`}
					>
						{msg}
					</div>
				)}
				<div className='w-full flex items-center justify-between gap-12 m-0'>
					<label className='inline-flex items-center gap-2 text-[14px]'>
						<input type='checkbox' checked={remember} onChange={onRememberChange} />
						Recordarme
					</label>
					<a href='#' onClick={onForgotPassword} className='text-[14px] text-[#F36A12]'>
						¿Olvidaste tu contraseña?
					</a>
				</div>
				<PrincipalButton color='orange' variant='fill' type='submit' disabled={loading}>
					{loading ? 'Entrando…' : 'Iniciar sesión'}
				</PrincipalButton>
			</div>
		</form>
	)
}
