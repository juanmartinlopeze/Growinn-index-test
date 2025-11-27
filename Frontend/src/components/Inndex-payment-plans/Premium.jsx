export default function PremiumPaymentPlan() {
	const IncludedTick = (
		<svg width='17' height='17' viewBox='0 0 17 17' fill='none' xmlns='http://www.w3.org/2000/svg'>
			<path
				d='M6.33816 15.4933H10.5636C14.0848 15.4933 15.4933 14.0848 15.4933 10.5636V6.33816C15.4933 2.81694 14.0848 1.40845 10.5636 1.40845H6.33816C2.81694 1.40845 1.40845 2.81694 1.40845 6.33816V10.5636C1.40845 14.0848 2.81694 15.4933 6.33816 15.4933Z'
				stroke='#FDFBFF'
				strokeWidth='0.845093'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
			<path d='M5.45776 8.45078L7.45078 10.4438L11.4438 6.45776' stroke='#FDFBFF' strokeWidth='0.845093' strokeLinecap='round' strokeLinejoin='round' />
		</svg>
	)

	const features = [
		{ text: 'Valores de índice general', singleLine: true },
		{ text: '3 Pilares', singleLine: true },
		{ text: '9 Categorías', singleLine: true },
		{ text: '45 Sub categorías', singleLine: true },
		{ text: 'Recomendaciones generales', singleLine: false },
		{ text: 'Análisis de entrevistas', singleLine: false },
		{
			text: 'Análisis de resultados correlacionados por áreas y jerarquías',
			singleLine: false,
		},
		{
			text: 'Recomendaciones detalladas y rutas de intervención',
			singleLine: false,
		},
	]

	return (
		<div className='flex flex-col max-w-[524px] w-full h-[560px] items-start gap-[35px] px-[23px] py-[34px] relative rounded-[13.52px] bg-[linear-gradient(149deg,rgba(245,111,16,1)_0%,rgba(250,157,90,1)_100%)] transition-all ease-in-out duration-300 hover:transform hover:scale-105'>
			<h1 className="relative w-fit mt-[-0.85px] font-semibold text-white [font-family:'General_Sans-Semibold',Helvetica] text-neutralwhite text-[20.3px] tracking-[0] leading-[16.9px] whitespace-nowrap">
				Premium
			</h1>

			<p className="relative w-fit [font-family:'General_Sans-Regular',Helvetica] font-normal text-transparent text-[27px] tracking-[0] leading-[16.9px] whitespace-nowrap">
				<span className='text-[#fdfbff] font-semibold'>$300.000</span>
				<span className='text-black text-[20.3px]'>&nbsp;</span>
			</p>

			<ul className='flex flex-col w-[209.58px] items-start gap-[18px] relative flex-[0_0_auto]' role='list'>
				{features.map((feature, index) => (
					<li
						key={index}
						className={`${feature.singleLine ? 'inline-flex' : 'flex'} items-${feature.singleLine ? 'center' : 'start'} gap-[6.76px] relative ${
							feature.singleLine ? 'flex-[0_0_auto]' : 'self-stretch w-full flex-[0_0_auto]'
						}`}
					>
						{IncludedTick}
						{feature.singleLine ? (
							<span className="relative w-fit mt-[-0.85px] text-left [font-family:'General_Sans-Regular',Helvetica] font-normal text-neutralwhite text-[13.5px] tracking-[0] leading-[16.9px] whitespace-nowrap text-white">
								{feature.text}
							</span>
						) : index === 4 ? (
							<span className="w-[176.62px] text-left relative mt-[-0.85px] [font-family:'General_Sans-Regular',Helvetica] font-normal text-neutralwhite text-[13.5px] tracking-[0] leading-[16.9px] text-white">
								{feature.text}
							</span>
						) : index === 5 ? (
							<span className="relative text-left w-[176.62px] mt-[-0.85px] [font-family:'General_Sans-Regular',Helvetica] font-normal text-neutralwhite text-[13.5px] tracking-[0] leading-[16.9px] text-white">
								{feature.text}
							</span>
						) : index === 6 ? (
							<p className="relative text-left w-[176.62px] mt-[-0.85px] [font-family:'General_Sans-Regular',Helvetica] font-normal text-neutralwhite text-[13.5px] tracking-[0] leading-[16.9px] text-white">
								{feature.text}
							</p>
						) : (
							<span className="w-[185.92px] text-left relative mt-[-0.85px] [font-family:'General_Sans-Regular',Helvetica] font-normal text-neutralwhite text-[13.5px] tracking-[0] leading-[16.9px] text-white">
								{feature.text}
							</span>
						)}
					</li>
				))}
			</ul>

			{/* CONECTAR AQUI LAS PAGINAS */}
			<a
				href='#'
				className='flex h-[38.03px] items-center justify-center gap-[var(--3-spacing-spacing-xs)] pt-[var(--3-spacing-spacing-md)] pr-[var(--3-spacing-spacing-lg)] pb-[var(--3-spacing-spacing-md)] pl-[var(--3-spacing-spacing-lg)] relative self-stretch w-full bg-white rounded-[8.51px] overflow-hidden hover:border-[1.06px] hover:border-solid border-0 text-[#E9683B] hover:bg-transparent hover:border-white shadow-[0px_1.06px_2.11px_#1018280d] cursor-pointer hover:text-white transition-all duration-200'
				type='button'
				aria-label='Escoger plan Premium'
			>
				<span className='inline-flex items-center justify-center pr-[var(--3-spacing-spacing-xxs)] pl-[var(--3-spacing-spacing-xxs)] py-0 relative flex-[0_0_auto] mt-[-0.44px] mb-[-0.44px]'>
					<span className="relative w-fit mt-[-1.06px] [font-family:'General_Sans-Regular',Helvetica] font-normal text-colors-colors-primary-color-n500 text-[14.8px] tracking-[0] leading-[21.1px] whitespace-nowrap">
						Obtener
					</span>
				</span>
			</a>
		</div>
	)
}
