import Analisis from '../../assets/icons/etapas-analisis.svg?react'
import Areas from '../../assets/icons/etapas-areas.svg?react'
import Jerarquias from '../../assets/icons/etapas-jerarquias-cargos.svg?react'
import Registro from '../../assets/icons/etapas-registro.svg?react'
import Tabla from '../../assets/icons/etapas-tabla.svg?react'
import Validacion from '../../assets/icons/etapas-validacion.svg?react'

export function Etapas({ variant, number, title, description }) {
	const iconMap = {
		jerarquias: Jerarquias,
		registro: Registro,
		areas: Areas,
		tabla: Tabla,
		validacion: Validacion,
		analisis: Analisis,
	}

	const Icon = iconMap[variant]

	return (
		<div className='flex max-w-[362px]'>
			<div className='flex justify-center items-center m-0 bg-gradient-to-br from-[#F56F10] to-[#FA9D5A] py-8 px-4'>
				<h1 className='text-[65px] text-white font-bold'>{number}</h1>
			</div>
			<div className='bg-white flex flex-col justify-center items-start p-4 gap-3 w-full'>
				<div className='flex justify-start items-center text-left gap-2'>
					<Icon />
					<p className='text-[#333333] text-md font-bold'>{title}</p>
				</div>
				<p className='text-[#666666] text-sm font-regular text-left'>{description}</p>
			</div>
		</div>
	)
}
