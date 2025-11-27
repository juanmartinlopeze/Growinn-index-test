import { DemoInfoCard } from '../../components'
import DemoCarousel from '../../components/Carrousels/Demo-carrousel'
import { Footer } from '../../components/Footer'
import { CAROUSEL_SLIDES } from '../../constants/assetPaths'

function Demo() {
	return (
		<>
			<main className='px-[12%] w-full my-[10%] flex flex-col gap-19'>
				<div className='flex flex-col gap-12'>
					<div className='flex flex-col gap-6'>
						<h1 className='font-bold text-[40px] bg-gradient-to-br from-[#F56F10] to-[#FA9D5A] bg-clip-text text-transparent'>Demo Dashboard</h1>
						<p className='font-regular text-xl text-[#666666]'>Explora cómo funciona nuestra herramienta de dashboard</p>
					</div>
					<DemoCarousel slides={CAROUSEL_SLIDES.demo} />
					<div className='flex flex-col gap-8'>
						<div className='w-full flex flex-col'>
							<DemoInfoCard
								title='Tus datos en un solo lugar'
								highlight='INNDEX Dashboard '
								description='transforma datos dispersos en un diagnóstico visual y accionable, mostrando la información de tu organización desde una vista general hasta los niveles más profundos, incluyendo áreas, departamentos, roles y jerarquías.

            Esto facilita entender tus fortalezas y brechas, ahorra tiempo en el análisis y te permite tomar decisiones estratégicas basadas en datos reales y con mayor precisión.'
							/>
						</div>
						<div className='grid col-1 md:grid-cols-2 w-full gap-8'>
							<DemoInfoCard
								title='Análisis profundo y estructurado'
								description='Accede a información desde una vista general hasta los niveles más detallados de tu organización, facilitando una comprensión completa de su estado actual.'
							/>
							<DemoInfoCard
								title='Identificación de fortalezas y brechas'
								description='Detecta con claridad qué áreas funcionan bien y cuáles necesitan atención, permitiéndote priorizar esfuerzos con criterio.'
							/>
							<DemoInfoCard
								title='Ahorro de tiempo en evaluación'
								description='La plataforma organiza los datos por ti, reduciendo el tiempo invertido en análisis manuales y acelerando la toma de decisiones.'
							/>
							<DemoInfoCard
								title='Decisiones estratégicas basadas en datos'
								description='Recibe información confiable y visual que refuerza la precisión en la planificación y disminuye el riesgo de decisiones mal fundamentadas.'
							/>
						</div>
					</div>
				</div>

				<div className='flex flex-col gap-12'>
					<div className='flex flex-col gap-6'>
						<h1 className='font-bold text-[40px] bg-gradient-to-br from-[#F56F10] to-[#FA9D5A] bg-clip-text text-transparent'>Demo Reporte</h1>
						<p className='font-regular text-xl text-[#666666]'>Explora cómo recibirás tus reportes de forma detallada</p>
					</div>
					<DemoCarousel slides={CAROUSEL_SLIDES.report} />
					<div className='flex flex-col gap-8'>
						<div className='w-full flex flex-col'>
							<DemoInfoCard
								title='Visualización Completa de tu Organización'
								highlight='INNDEX '
								description='te permite visualizar y analizar la estructura completa de tu organización de manera intuitiva. Con nuestro dashboard interactivo, podrás identificar patrones, relaciones y oportunidades de optimización en tiempo real.

            La herramienta procesa tus datos organizacionales y genera visualizaciones claras que facilitan la toma de decisiones estratégicas. Desde la jerarquía de cargos hasta las métricas de desempeño, todo está diseñado para brindarte una visión 360° de tu empresa.'
							/>
						</div>
						<div className='grid col-1 md:grid-cols-2 w-full gap-8'>
							<DemoInfoCard title='Análisis en tiempo real' description='Visualiza cambios y tendencias organizacionales al instante con nuestros gráficos y tablas dinámicas.' />
							<DemoInfoCard title='Identificación de patrones' description='Descubre relaciones ocultas entre departamentos, roles y jerarquías que impulsan la eficiencia.' />
							<DemoInfoCard title='Reportes personalizables' description='Genera informes detallados adaptados a las necesidades específicas de tu organización.' />
							<DemoInfoCard title='Integración sencilla' description='Importa tus datos existentes fácilmente y comienza a obtener insights valiosos de inmediato.' />
						</div>
					</div>
				</div>

				<div className='flex flex-col gap-12'>
					<div className='flex flex-col gap-6'>
						<h1 className='font-bold text-[40px] bg-gradient-to-br from-[#F56F10] to-[#FA9D5A] bg-clip-text text-transparent'>Demo INNDEX</h1>
						<p className='font-regular text-xl text-[#666666]'>Explora cómo funciona nuestra herramienta de análisis organizacional y sus derivados</p>
					</div>
					<DemoCarousel slides={CAROUSEL_SLIDES.report} />
					<div className='flex flex-col gap-8'>
						<div className='w-full flex flex-col'>
							<DemoInfoCard
								title='Visualización Completa de tu Organización'
								highlight='INNDEX '
								description='te permite visualizar y analizar la estructura completa de tu organización de manera intuitiva. Con nuestro dashboard interactivo, podrás identificar patrones, relaciones y oportunidades de optimización en tiempo real.

            La herramienta procesa tus datos organizacionales y genera visualizaciones claras que facilitan la toma de decisiones estratégicas. Desde la jerarquía de cargos hasta las métricas de desempeño, todo está diseñado para brindarte una visión 360° de tu empresa.'
							/>
						</div>
						<div className='grid col-1 md:grid-cols-2 w-full gap-8'>
							<DemoInfoCard title='Análisis en tiempo real' description='Visualiza cambios y tendencias organizacionales al instante con nuestros gráficos y tablas dinámicas.' />
							<DemoInfoCard title='Identificación de patrones' description='Descubre relaciones ocultas entre departamentos, roles y jerarquías que impulsan la eficiencia.' />
							<DemoInfoCard title='Reportes personalizables' description='Genera informes detallados adaptados a las necesidades específicas de tu organización.' />
							<DemoInfoCard title='Integración sencilla' description='Importa tus datos existentes fácilmente y comienza a obtener insights valiosos de inmediato.' />
						</div>
					</div>
				</div>
			</main>
			<Footer />
		</>
	)
}
export default Demo
