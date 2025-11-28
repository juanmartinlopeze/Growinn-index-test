import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import PropTypes from 'prop-types'
import { CAROUSEL_SLIDES } from '../../constants/assetPaths'

const DemoCarousel = ({ slides = CAROUSEL_SLIDES }) => {
	const [emblaRef, emblaApi] = useEmblaCarousel({
		loop: true,
		align: 'center',
	})

	const scrollPrev = () => emblaApi?.scrollPrev()
	const scrollNext = () => emblaApi?.scrollNext()

	if (!slides || slides.length === 0) {
		return null
	}

	return (
		<div className='relative w-full'>
			<button onClick={scrollPrev} className='absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors' aria-label='Previous slide'>
				<ChevronLeft className='w-6 h-6 text-gray-700' />
			</button>

			<button onClick={scrollNext} className='absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors' aria-label='Next slide'>
				<ChevronRight className='w-6 h-6 text-gray-700' />
			</button>

			<div className='overflow-hidden rounded-lg' ref={emblaRef}>
				<div className='flex'>
					{slides.map((slide) => (
						<div key={slide.id} className='flex-[0_0_100%] min-w-0 px-4'>
							<div className='relative rounded-lg overflow-hidden shadow-lg'>
								<img src={slide.image} alt={slide.title} className='w-full h-auto object-cover' />
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

DemoCarousel.propTypes = {
	slides: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
			image: PropTypes.string.isRequired,
			title: PropTypes.string,
			description: PropTypes.string,
		})
	),
}

export default DemoCarousel
