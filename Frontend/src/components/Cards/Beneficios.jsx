export function Beneficios({ number, title, description }) {
	return (
		<div className='flex flex-col items-start justify-center max-w-[562px] gap-7 text-left bg-white border border-[#E5E5E7] p-10'>
			<div className="flex items-center gap-5">
				<div className='rounded-full h-12 w-12 justify-center flex items-center p-2 bg-gradient-to-br from-[#F56F10] to-[#FA9D5A]'>
					<h1 className='text-white m-0 font-bold text-2xl'>{number}</h1>
				</div>
				<h1 className='font-bold text-2xl text-[#333333]'>{title}</h1>
			</div>
			<p className='text-lg font-regular text-[#666666]'>{description}</p>
		</div>
	)
}
