import React from 'react'
import { InputForm } from '../../components/index'
import PrincipalButton from '../../components/UiButtons/PrincipalButton'

export default function RegisterCard({ loading, status, msg, onSubmit }) {
	return (
		<form className='flex flex-col items-center justify-center gap-[50px] w-full max-w-[500px] shadow-[0_4px_20px_rgba(0,0,0,0.14)] rounded-[16px] p-[48px_30px] box-border' onSubmit={onSubmit}>
			<div className='w-full flex flex-col gap-8'>
				<InputForm icon={true} label='Nombre completo' placeholder='Ingresa tu nombre completo' name='name' required />
				<InputForm icon={true} label='Correo electrónico' placeholder='Ingresa tu correo electrónico' name='email' type='email' required />
				<InputForm icon={true} label='Contraseña' placeholder='Crea una contraseña segura' name='password' type='password' required />
				<InputForm icon={true} label='Confirma tu contraseña' placeholder='Confirma tu contraseña' name='password' type='password' required />
			</div>
			<div className='w-full flex flex-col gap-6'>
				<p className='text-[14px] font-normal text-[#706f6f]'>
					Al crear una cuenta, aceptas nuestros{' '}
					<span className='font-medium text-[#f56f10] ml-[5px]'>
						<a href='#'>Términos y condiciones</a>
					</span>
				</p>
				<PrincipalButton color='orange' variant='fill' type='submit' disabled={loading || status === 'submitting'} className='register-btn'>
					{status === 'submitting' ? 'Creando…' : 'Crear mi cuenta gratuita'}
				</PrincipalButton>
			</div>
			{msg && <p className='mt-2 text-[14px] text-red-600'>{msg}</p>}
		</form>
	)
}
