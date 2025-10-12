import React, { useRef, useState } from 'react'
import { InputDrop, InputForm } from '../../components/index'
import PrincipalButton from '../../components/UiButtons/PrincipalButton'

export default function RegisterCard({ loading, status, msg, onSubmit }) {
	const [step, setStep] = useState(1)
	const formRef = useRef(null)

	const handleNext = () => {
		const form = formRef.current
		if (!form) return
		if (form.checkValidity()) {
			setStep(2)
			const firstStep2 = form.querySelector('[data-step="2"] input, [data-step="2"] select, [data-step="2"] textarea')
			firstStep2?.focus()
		} else {
			form.reportValidity()
		}
	}

	const handleBack = () => setStep(1)

	return (
		<form
			ref={formRef}
			className='flex flex-col items-center justify-center gap-[24px] w-full max-w-[500px] shadow-[0_4px_20px_rgba(0,0,0,0.14)] rounded-[16px] p-[32px] box-border'
			onSubmit={onSubmit}
		>
			{/* Progress */}
			<div className='w-full flex items-center justify-start gap-md'>
				<p className='text-caption font-semibold text-primary-n500 w-auto flex-none'>Paso {step} de 2</p>
				<div className='w-full outline-3 outline-neutral-100 outline-offset-2 h-2 rounded-full overflow-hidden'>
					<div className='h-2 rounded-full bg-primary-n500 transition-all' style={{ width: step === 1 ? '50%' : '100%' }} aria-hidden />
				</div>
			</div>

			<div className='w-full flex flex-col gap-6'>
				{/* Step 1 */}
				<div data-step='1' className={`${step === 1 ? 'block' : 'hidden'}`}>
					<div className='w-full flex flex-col gap-4'>
						<InputForm icon={true} label='Nombre completo' placeholder='Ingresa tu nombre completo' name='name' required />
						<InputForm icon={true} label='Correo electrónico' placeholder='Ingresa tu correo electrónico' name='email' type='email' required />
						<InputForm icon={true} label='Contraseña' placeholder='Crea una contraseña segura' name='password' type='password' required />
						<InputForm icon={true} label='Confirma tu contraseña' placeholder='Confirma tu contraseña' name='password' type='password' required />
					</div>
				</div>

				{/* Step 2 */}
				<div data-step='2' className={`${step === 2 ? 'block' : 'hidden'}`}>
					<div className='w-full flex flex-col gap-4'>
						<InputForm label='Nombre de la empresa' placeholder='Ingresa el nombre de la empresa' name='company' type='text' required />
						<InputDrop name='organization_type' label='Tipo de organización' placeholder='S.A.S' options={['S.A.S', 'S.A.', 'Ltda', 'S. en C', 'S.C.A.']} required />
						<InputForm label='Dirección sede principal' placeholder='Ingrese la dirección principal de la organización' name='adress' type='text' required />
						<InputDrop
							name='category'
							label='Categoría de la organización'
							placeholder='Selecciona el tamaño de tu empresa'
							options={['Microempresa', 'Pequeña empresa', 'Mediana empresa', 'Gran empresa']}
							required
						/>
						<InputDrop
							name='sector'
							label='Sector económico'
							placeholder='Selecciona tu sector económico'
							options={['Sector primario', 'Sector secundario', 'Sector terciario', 'Sector cuaternario', 'Sector quinario']}
							required
						/>
						<p className='text-[14px] font-normal text-[#706f6f] mt-2'>
							Al crear una cuenta, aceptas nuestros{' '}
							<span className='font-medium text-[#f56f10] ml-[5px]'>
								<a href='#'>Términos y condiciones</a>
							</span>
						</p>
					</div>
				</div>

				{msg && <p className='mt-2 text-[14px] text-red-600'>{msg}</p>}

				<div className='w-full flex items-center justify-start gap-4'>
					{step === 2 ? (
						<>
							<PrincipalButton className='border border-neutral-300' color='orange' variant='stroke' type='button' onClick={handleBack}>
								Volver{' '}
							</PrincipalButton>
							<PrincipalButton className='w-full' color='orange' variant='fill' type='submit' disabled={loading || status === 'submitting'}>
								{status === 'submitting' ? 'Creando…' : 'Crear mi cuenta gratuita'}
							</PrincipalButton>
						</>
					) : (
						<>
							<PrincipalButton className='w-full' color='orange' variant='fill' type='button' onClick={handleNext}>
								Siguiente paso{' '}
							</PrincipalButton>
						</>
					)}
				</div>
			</div>
		</form>
	)
}
