import PropTypes from 'prop-types'
import { useState } from 'react'

const PilaresCategorias = ({ highlightedText, highlightColor, description, items, defaultOpenIndex = 0 }) => {
	const [openIndex, setOpenIndex] = useState(defaultOpenIndex)

	const handleToggle = (index) => {
		setOpenIndex(openIndex === index ? -1 : index)
	}

	return (
		<div
			className='w-full h-min flex flex-col'
			style={{
				border: '1.5px solid #E4E4E7',
				borderRadius: '0px',
			}}
		>
			<div className='p-9 flex flex-col gap-4'>
				<h3 className='text-xl text-left font-semibold text-[#333333]'>
					Pilar de
					<span className='px-2 py-1' style={{ color: highlightColor }}>
						{highlightedText}
					</span>{' '}
				</h3>

				<p className='text-base text-left font-medium text-[#666666] leading-relaxed'>{description}</p>
			</div>

			<div className='flex-1 flex flex-col overflow-hidden'>
				{items.map((item, index) => (
					<div key={item.id} className='flex flex-col'>
						<button
							onClick={() => handleToggle(index)}
							className='flex items-center justify-between p-9 w-full text-left transition-colors duration-200'
							style={{
								borderTop: '1.5px solid #E4E4E7',
							}}
						>
							<span className={`text-lg font-semibold transition-colors duration-200 ${openIndex === index ? 'text-[#E9683B]' : 'text-[#333333]'}`}>{item.title}</span>

							<svg
								className={`w-5 h-5 transition-transform duration-300 ${openIndex === index ? 'rotate-180 stroke-[#E9683B]' : 'rotate-0'}`}
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.3} d='M19 9l-7 7-7-7' />
							</svg>
						</button>

						<div
							id={`pillar-content-${item.id}`}
							className={`transition-[max-height,opacity,padding] duration-700 ease-in-out ${
								openIndex === index ? 'max-h-[400px] opacity-100 py-4 pointer-events-auto overflow-auto' : 'max-h-0 opacity-0 py-0 pointer-events-none overflow-hidden'
							}`}
							style={{ willChange: 'max-height, opacity' }}
						>
							<div className='px-6 pb-6 text-base text-left font-medium text-[#666666] leading-relaxed'>{item.content}</div>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

PilaresCategorias.propTypes = {
	highlightedText: PropTypes.string.isRequired,
	highlightColor: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	items: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.number.isRequired,
			title: PropTypes.string.isRequired,
			content: PropTypes.string.isRequired,
		})
	).isRequired,
	defaultOpenIndex: PropTypes.number,
}

PilaresCategorias.defaultProps = {
	defaultOpenIndex: 0,
}

export default PilaresCategorias
