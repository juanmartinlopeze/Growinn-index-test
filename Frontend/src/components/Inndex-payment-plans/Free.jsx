export default function FreePaymentPlan() {
	const IncludedTick = (
		<svg width='17' height='17' viewBox='0 0 17 17' fill='none' xmlns='http://www.w3.org/2000/svg'>
			<path
				d='M6.33816 15.4933H10.5636C14.0848 15.4933 15.4933 14.0848 15.4933 10.5636V6.33816C15.4933 2.81694 14.0848 1.40845 10.5636 1.40845H6.33816C2.81694 1.40845 1.40845 2.81694 1.40845 6.33816V10.5636C1.40845 14.0848 2.81694 15.4933 6.33816 15.4933Z'
				stroke='#090011'
				strokeWidth='0.845093'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
			<path d='M5.45776 8.45078L7.45078 10.4438L11.4438 6.45776' stroke='#090011' strokeWidth='0.845093' strokeLinecap='round' strokeLinejoin='round' />
		</svg>
	)

	const ExcludedCross = (
		<svg width='17' height='17' viewBox='0 0 17 17' fill='none' xmlns='http://www.w3.org/2000/svg'>
			<path d='M6.45801 10.4438L10.444 6.45776' stroke='#848088' strokeWidth='0.845093' strokeLinecap='round' strokeLinejoin='round' />
			<path d='M10.444 10.4438L6.45801 6.45776' stroke='#848088' strokeWidth='0.845093' strokeLinecap='round' strokeLinejoin='round' />
			<path
				d='M6.33816 15.4933H10.5636C14.0848 15.4933 15.4933 14.0848 15.4933 10.5636V6.33816C15.4933 2.81694 14.0848 1.40845 10.5636 1.40845H6.33816C2.81694 1.40845 1.40845 2.81694 1.40845 6.33816V10.5636C1.40845 14.0848 2.81694 15.4933 6.33816 15.4933Z'
				stroke='#848088'
				strokeWidth='0.845093'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</svg>
	)

	const includedFeatures = [
		{ id: 1, text: 'Valores de índice general', included: true },
		{ id: 2, text: '3 Pilares', included: true },
		{ id: 3, text: '9 Categorías', included: true },
	]

	const excludedFeatures = [
		{ id: 4, text: '45 Sub categorías', included: true },
		{
			id: 5,
			text: 'Recomendaciones generales',
			included: true,
			multiline: false,
		},
		{ id: 6, text: 'Análisis de entrevistas', included: false },
		{
			id: 7,
			text: 'Análisis de resultados correlacionados por áreas y jerarquías',
			included: false,
		},
		{
			id: 8,
			text: 'Recomendaciones detalladas y rutas de intervención',
			included: false,
		},
	]

	return (
		<article className='flex flex-col max-w-[524px] w-full h-[560px] items-start gap-[35px] px-[23px] py-[34px] relative bg-white rounded-[13.52px] border-[1.27px] border-solid border-[#D9D9D9] transition-all ease-in-out duration-300 hover:transform hover:scale-105'>
			<header className="relative w-fit mt-[-1.27px] [font-family:'General_Sans-Semibold',Helvetica] font-semibold text-black text-[20.3px] tracking-[0] leading-[16.9px] whitespace-nowrap">
				Free
			</header>

			<p className="relative w-fit [font-family:'General_Sans-Regular',Helvetica] font-normal text-transparent text-[27px] tracking-[0] leading-[16.9px] whitespace-nowrap">
				<span className='text-black font-semibold'>$00</span>
				<span className='text-black text-[20.3px]'>&nbsp;</span>
			</p>

			<ul className='flex flex-col w-[216.34px] items-start gap-[18px] relative flex-[0_0_auto]' role='list'>
				{includedFeatures.map((feature) => (
					<li key={feature.id} className='inline-flex items-center gap-[6.76px] relative flex-[0_0_auto]'>
						{IncludedTick}
						<span
							className={`relative ${
								feature.id === 5 ? 'w-[176.62px]' : 'w-fit'
							} mt-[-0.85px] [font-family:'General_Sans-Regular',Helvetica] font-normal text-neutralblack text-[13.5px] tracking-[0] leading-[16.9px] ${
								feature.id !== 5 ? 'whitespace-nowrap' : ''
							}`}
						>
							{feature.text}
						</span>
					</li>
				))}

				{excludedFeatures.map((feature) => (
					<li key={feature.id} className={`flex items-start gap-[6.76px] relative ${feature.id === 6 ? 'flex-[0_0_auto]' : 'self-stretch w-full flex-[0_0_auto]'}`}>
						{ExcludedCross}
						<span
							className={`relative ${
								feature.id === 6 ? 'w-fit' : 'w-[192.68px]'
							} mt-[-0.85px] text-left [font-family:'General_Sans-Regular',Helvetica] font-normal text-[#848088] text-[13.5px] tracking-[0] leading-[16.9px] ${
								feature.id === 6 ? 'whitespace-nowrap' : ''
							}`}
						>
							{feature.text}
						</span>
					</li>
				))}
			</ul>

			{/* CONECTAR AQUI LAS PAGINAS */}
			<a
				href='#'
				type='button'
				className='flex h-[42.25px] items-center justify-center gap-[var(--3-spacing-spacing-xs)] px-[14.79px] py-[10.56px] relative self-stretch w-full mb-[-2.25px] rounded-[8.51px] overflow-hidden border-[1.06px] border-solid border-[#E56C33] shadow-[0px_1.06px_2.11px_#1018280d] hover:bg-[#E56C33] hover:text-[white] text-[#E56C33] hover:bg-opacity-5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#e56c33] focus:ring-offset-2'
				aria-label='Escoger plan Medium'
			>
				Obtener
			</a>
		</article>
	)
}
