import { Link } from 'react-router-dom'
import { Beneficios } from '../../components/Cards/Beneficios.jsx'
import { Etapas } from '../../components/Cards/Etapas.jsx'
import PilaresCategorias from '../../components/Cards/PilaresCategorias.jsx'
import { Footer } from '../../components/Footer.jsx'
import FreePaymentPlan from '../../components/Inndex-payment-plans/Free'
import PremiumPaymentPlan from '../../components/Inndex-payment-plans/Premium'
import { IMAGES } from '../../constants/assetPaths'

function LandingPage() {
	return (
		<main>
			{/* COVER */}
			<div
				className='bg-cover bg-center h-screen w-screen flex flex-col justify-center items-center'
				style={{
					backgroundImage: `url('${IMAGES.backgrounds.hero}')`,
				}}
			>
				<div className='bg-[#E4EB60] p-2.5'>
					<p className='font-bold text-2xl'>
						Tu <span className='text-[#5454E9]'>innovación</span>, nuestro <span className='text-[#5454E9]'>impulso</span>
					</p>
				</div>
				<div className='bg-[#5454E9] p-2.5'>
					<p className='font-extrabold text-9xl text-white'>INNDEX</p>
				</div>
				<div className='bg-[#E9683B] p-2.5'>
					<p className='font-bold text-2xl text-white'>Transforma los datos en crecimiento </p>
				</div>
				<div className='w-full flex gap-8 justify-center mt-15'>
					{/* CONECTAR AHI LAS PAGINAS */}
					<Link
						to='/home'
						className='w-auto flex gap-2.5 items-center justify-center bg-[linear-gradient(149.16deg,#F56F10_0%,#FA9D5A_100%)] shadow-[0px_0px_20px_rgba(233,104,59,0.5)] text-white font-regular text-lg px-24 p-4 transition-all ease-in-out duration-300 hover:transform hover:scale-105'
					>
						Comienza ahora mismo{' '}
						{
							<svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
								<path d='M16.175 11L10.575 5.4L12 4L20 12L12 20L10.575 18.6L16.175 13L4 13L4 11L16.175 11Z' fill='white' />
							</svg>
						}
					</Link>
				</div>
			</div>

			{/* Section Lo que no se define */}
			<div className='bg-[#FBFBFC] flex flex-col justify-center items-center text-center py-26 px-[10%] gap-6 w-full relative'>
				<div className='bg-[#E9683B] h-0.5 w-26 mb-6'></div>
				<h2 className='italic text-5xl font-light text-[#333333] z-1'>
					"Lo que no se <span className='text-[#F98D46] font-bold italic'>define </span> no se puede <span className='text-[#F98D46] font-bold italic'>medir</span>. Lo que no se{' '}
					<span className='text-[#F98D46] font-bold italic'>mide</span>, no se puede <span className='text-[#F98D46] font-bold italic'>mejorar</span>. Lo que no se{' '}
					<span className='text-[#F98D46] font-bold italic'>mejora</span>, se <span className='text-[#F98D46] font-bold italic'>degrada</span> siempre."
				</h2>
				<p className='text-xl text-[#666666]'>William Thomson, 1883</p>
				<img className='absolute right-2 top-4 z-0' src={IMAGES.decorative.lineOrange} alt='' />
				<img className='absolute right-2 top-4 z-0' src={IMAGES.decorative.lineOrange} alt='' />
				<img className='absolute left-100 top-12 z-0' src={IMAGES.decorative.orangeRectangle} alt='' />
				<img className='absolute right-120 top-20 z-0' src={IMAGES.decorative.purpleRectangle} alt='' />
				<img className='absolute left-40 bottom-22 z-0' src={IMAGES.decorative.greenRectangle} alt='' />
			</div>

			{/* Section Los datos no mienten */}
			<div className='flex flex-col justify-center items-center text-center py-26 px-[10%] gap-16 w-full relative'>
				<div className='flex flex-col gap-5 items-center justify-center text-center'>
					<h2 className='text-5xl font-light text-[#333333] leading-[120%]'>
						Los datos <span className='bg-gradient-to-br from-[#F56F10] to-[#FA9D5A] bg-clip-text text-transparent font-bold'>no mienten</span>, las empresas innovadoras tienen los
						siguientes resultados:
					</h2>
				</div>
				<div className='flex flex-col lg:flex-row gap-8'>
					<div className='bg-[#e9693b10] border-1 border-[#FEDAC8] text-left py-18 px-7 backdrop-blur-lg'>
						<div className='flex flex-col gap-3'>
							<p className='text-4xl font-light text-[#333333]'>
								<span className='text-[#F98D46] font-bold'>2.5 veces más</span> probabilidades de superar a sus competidores.
							</p>
						</div>
					</div>
					<div className='bg-[#e9693b10] border-1 border-[#FEDAC8] text-left py-18 px-7 backdrop-blur-lg'>
						<div className='flex flex-col gap-3'>
							<p className='text-4xl font-light text-[#333333]'>
								Escalan
								<span className='text-[#F98D46] font-bold'> 6 veces más</span> rápido que sus competencias directas.
							</p>
						</div>
					</div>
					<div className='bg-[#e9693b10] border-1 border-[#FEDAC8] text-left py-18 px-7 backdrop-blur-lg'>
						<div className='flex flex-col gap-3'>
							<p className='text-4xl font-light text-[#333333]'>
								Un retorno
								<span className='text-[#F98D46] font-bold'> mayor al 5.6%</span> para los accionistas a corto plazo.
							</p>
						</div>
					</div>
				</div>

				<img className='absolute top-0 left-0 -z-10 opacity-60' src={IMAGES.decorative.lineGreen} alt='line' />
			</div>

			{/* Section INNDEX es más que una herramienta */}
			<div className='flex flex-col justify-center items-center text-center py-26 px-[10%] gap-16 w-full relative'>
				<div className='flex flex-col gap-5 items-center justify-center text-center'>
					<h2 className='text-5xl font-light text-[#333333] leading-[120%]'>
						<span className='bg-gradient-to-br from-[#F56F10] to-[#FA9D5A] bg-clip-text text-transparent font-bold'>INNDEX</span> es más que una herramienta
					</h2>
					<p className='text-xl text-[#666666] max-w-8/12'>
						Somos la plataforma líder en gestión de indicadores empresariales, ayudando a organizaciones a tomar decisiones basadas en datos reales y medibles.
					</p>
				</div>
				<div className='flex gap-12 max-w-[1093px]'>
					<div className='flex flex-col gap-4 items-start text-left w-1/2'>
						<h4 className='font-bold text-[#333333] text-2xl'>¿Qué es INNDEX?</h4>
						<p className='font-regular text-lg text-[#666666]'>
							El <strong>INNDEX</strong> nace de la necesidad de conocer el estado del sistema y la cultura de innovación de las organizaciones. Creemos que lo que no se mide no se puede
							mejorar, y por eso hemos creado una plataforma que hace que medir y analizar datos sea tan fácil como hacer un clic.
						</p>
						<p className='font-regular text-lg text-[#666666]'>
							Trabajamos con empresas de todos los tamaños, desde startups hasta grandes corporaciones multilatinas, proporcionando soluciones escalables que crecen con tu negocio.{' '}
						</p>
					</div>
					<div className='flex flex-col gap-4 items-start text-left w-1/2'>
						<h4 className='font-bold text-[#333333] text-2xl'>Cultura e innovación</h4>
						<p className='font-regular text-lg text-[#666666]'>
							Con el <strong>INNDEX</strong> fomentamos en las empresas una cultura donde la curiosidad, la colaboración y la mejora continua son el centro de todo lo que se hace.
							Creemos que la innovación no es un resultado, sino un proceso constante impulsado por la experimentación.
						</p>
						<p className='font-regular text-lg text-[#666666]'>
							Promovemos un entorno en el que las ideas fluyen, la tecnología se convierte en un aliado estratégico y los equipos trabajan con libertad creativa.{' '}
						</p>
					</div>
				</div>
			</div>

			{/* Section los beneficios llegan */}
			<div className='flex flex-col justify-center items-center text-center py-26 px-[10%] gap-16 w-full relative bg-[#FBFBFC]'>
				<div className='flex flex-col gap-5 items-center justify-center text-center'>
					<h2 className='text-5xl font-light text-[#333333] leading-[120%]'>
						Cuando haces las cosas bien, los <span className='bg-gradient-to-br from-[#F56F10] to-[#FA9D5A] bg-clip-text text-transparent font-bold'>beneficios</span> llegan:
					</h2>
				</div>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-7'>
					<Beneficios
						number={1}
						title='Diagnóstico de madurez'
						description='Obtén una visión clara del nivel de madurez de tu compañía y de cómo se encuentran tus procesos y capacidades actuales.'
					/>
					<Beneficios
						number={2}
						title='Comparativa de desempeño'
						description='Compara la evolución de tus indicadores a lo largo del tiempo y evalúa tu posición frente a otras organizaciones del sector.'
					/>
					<Beneficios
						number={3}
						title='Recomendaciones estratégicas'
						description='Accede a sugerencias prácticas y orientadas a la acción, basadas en el análisis de tus resultados y en el criterio de especialistas.'
					/>
					<Beneficios
						number={4}
						title='Identificación de brechas'
						description='Detecta las principales brechas de tu organización para priorizar acciones y planear intervenciones con mayor precisión.'
					/>
				</div>
			</div>

			{/* Section Pilares y categorías */}
			<div className='flex flex-col justify-center items-center text-center py-26 px-[10%] gap-16 w-full relative'>
				<div className='flex flex-col gap-5 items-center justify-center text-center'>
					<h2 className='text-5xl font-light text-[#333333] leading-[120%]'>
						Pilares y <span className='bg-gradient-to-br from-[#F56F10] to-[#FA9D5A] bg-clip-text text-transparent font-bold'>categorías</span>
					</h2>
					<p className='text-xl text-[#666666] max-w-8/12'>Explora nuestras dimensiones clave para el análisis organizacional </p>
				</div>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
					<PilaresCategorias
						highlightedText='arquitectura estratégica'
						highlightColor='#B6BC4D'
						description='Evalúa cómo se orienta la innovación mediante una visión clara, decisiones coherentes y redes internas y externas que potencian el valor.'
						items={[
							{
								id: 1,
								title: '1. Estrategia',
								content: 'Evidencia acerca del programa de gestión de innovación y su alineación con los objetivos estratégicos de la compañía, de cara a la innovación.',
							},
							{
								id: 2,
								title: '2. Gobernanza',
								content: 'Modelos con los que se maneja la compañía, las reglas que tiene y su capacidad de adaptarse al cambio y no ser tan estrictos con ellas.',
							},
							{
								id: 3,
								title: '3. Colaboración',
								content: 'Dedicación en tiempo y energía a encontrar y probar nuevas ideas a través de una red de individuos diversos.',
							},
						]}
						defaultOpenIndex={0}
					/>

					<PilaresCategorias
						highlightedText='dinámica cultural'
						highlightColor='#DC2626'
						description='Mide el nivel de adopción de prácticas innovadoras, la mentalidad de experimentación y la capacidad de adaptación al cambio dentro de la organización.'
						items={[
							{
								id: 1,
								title: '4. Clima',
								content:
									'Construcción de una cultura exitosa que estimula el comportamiento innovador en la organización. Análisis del lugar de trabajo, la seguridad en dicho lugar, la simplicidad y la colaboración.',
							},
							{
								id: 2,
								title: '5. Personas',
								content: 'Elemento central de cualquier actividad de innovación, en donde es necesaria la diversidad y creatividad para generar nuevas ideas.',
							},
							{
								id: 3,
								title: '6. Liderazgo',
								content: 'Ser un modelo a seguir, tomar la iniciativa, asumir riesgos, toma de decisiones y proporcionar feedback.',
							},
						]}
						defaultOpenIndex={0}
					/>

					<PilaresCategorias
						highlightedText='plataforma de ejecución'
						highlightColor='#06B6D4'
						description='Analiza la eficiencia operativa, la optimización de recursos y la implementación de metodologías que aceleren la generación de valor e innovación.'
						items={[
							{
								id: 1,
								title: '7. Procesos',
								content: 'Gestión de logros repetibles por medio de la administración de la innovación. También permite que la innovación sea parte del trabajo diario.',
							},
							{
								id: 2,
								title: '8. Recursos',
								content: 'Son los insumos que se tienen a disposición para llevar a cabo la innovación: dinero, espacios, expertos, recompensas y tecnología.',
							},
							{
								id: 3,
								title: '9. Resultados',
								content:
									'Imagen clara que se apoya con datos sobre dónde la cultura es fuerte o débil, permite descubrir las fortalezas y debilidades en las diferentes áreas de la compañía.',
							},
						]}
						defaultOpenIndex={0}
					/>
				</div>
			</div>

			{/* Section Demo */}
			<div className='flex flex-col min-[1300px]:flex-row justify-center items-center text-center min-[1300px]:text-left min-[1300px]:items-end py-26 px-[10%] gap-16 w-full relative'>
				<div className='flex flex-col gap-7 items-center justify-center text-center min-[1300px]:text-left min-[1300px]:items-start w-full min-[1300px]:w-1/2'>
					<h2 className='text-5xl font-light text-[#333333] leading-[120%]'>
						Descubre ya mismo nuestras <span className='bg-gradient-to-br from-[#F56F10] to-[#FA9D5A] bg-clip-text text-transparent font-bold'>herramientas</span>
					</h2>
					<p className='text-xl text-[#666666] w-full'>
						La medición de la madurez de la organización se hace con encuestas a la población y entrevistas a las personas encargadas de áreas claves. Se entrega un reporte con los{' '}
						<strong>hallazgos</strong> y <strong>recomendaciones</strong>.{' '}
					</p>
					<div className='w-full flex gap-8 justify-center min-[1300px]:justify-start'>
						{/* CONECTAR AHI LAS PAGINAS */}
						<Link
							to='/demo'
							className='w-auto flex gap-2.5 items-center justify-center bg-[linear-gradient(149.16deg,#F56F10_0%,#FA9D5A_100%)] shadow-[0px_0px_20px_rgba(233,104,59,0.5)] text-white font-regular text-lg px-10 p-4 transition-all ease-in-out duration-300 hover:transform hover:scale-105'
						>
							Ejemplos de nuestros reportes{' '}
							{
								<svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
									<path d='M16.175 11L10.575 5.4L12 4L20 12L12 20L10.575 18.6L16.175 13L4 13L4 11L16.175 11Z' fill='white' />
								</svg>
							}
						</Link>
					</div>
				</div>
				<img src={IMAGES.mockups.pcMockup} alt='' />
			</div>

			{/* Section ¿Cómo es nuestro proceso diagnóstico? */}
			<div className='flex flex-col justify-center items-center text-center py-26 px-[10%] gap-28 w-auto relative bg-[#FBFBFC]'>
				<div className='w-full max-w-7xl mx-auto z-1'>
					<div className='flex flex-col gap-16 items-center min-[1300px]:items-start min-[1300px]:text-left text-center'>
						<div className='flex flex-col min-[1300px]:flex-row'>
							<div className='flex flex-col gap-5 items-center justify-center min-[1300px]:items-start min-[1300px]:justify-start min-[1300px]:text-left text-center mb-16'>
								<h2 className='text-5xl font-light text-[#333333] max-w-[494px] leading-[120%]'>
									¿Cómo es nuestro <span className='bg-gradient-to-br from-[#F56F10] to-[#FA9D5A] bg-clip-text text-transparent font-bold'>proceso diagnóstico</span>?
								</h2>
								<p className='text-xl text-[#333333] max-w-[573px]'>
									La medición de la madurez de la organización se hace con encuestas a la población y entrevistas a las personas encargadas de áreas claves. Se entrega un reporte con
									los
									<strong> hallazgos</strong> y <strong>recomendaciones</strong>.
								</p>
							</div>
							<img className='z-1 h-1/3 w-auto' src={IMAGES.mockups.toolPreview} alt='line' />
						</div>

						<h2 className='text-5xl font-light text-[#333333] mb-8'>
							Conoce nuestras <span className='bg-gradient-to-br from-[#F56F10] to-[#FA9D5A] bg-clip-text text-transparent font-bold'>etapas</span>
						</h2>

						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-20'>
							<Etapas
								variant='registro'
								number={1}
								title='Registro'
								description='Crea tu cuenta y configura tu organización en pocos minutos
'
							/>
							<Etapas
								variant='jerarquias'
								number={2}
								title='Jerarquías y cargos'
								description='Define la estructura organizacional con niveles y posiciones
'
							/>
							<Etapas
								variant='areas'
								number={3}
								title='Áreas'
								description='Organiza departamentos y áreas funcionales de tu empresa

'
							/>
							<Etapas
								variant='tabla'
								number={4}
								title='Tabla de jerarquías'
								description='Visualiza y ajusta las relaciones jerárquicas completas

'
							/>
							<Etapas
								variant='validacion'
								number={5}
								title='Validación de datos'
								description='Crea tu cuenta y configura tu organización en pocos minutosVerifica la consistencia e integridad de la información
'
							/>
							<Etapas
								variant='analisis'
								number={6}
								title='Análisis'
								description='Obtén insights y métricas sobre tu estructura organizacional
'
							/>
						</div>
						<div className='w-full flex gap-8 justify-center'>
							{/* CONECTAR AHI LAS PAGINAS */}
							<Link
								to='/home'
								className='w-auto flex gap-2.5 items-center justify-center bg-[linear-gradient(149.16deg,#F56F10_0%,#FA9D5A_100%)] shadow-[0px_0px_20px_rgba(233,104,59,0.5)] text-white font-regular text-lg px-24 p-4 transition-all ease-in-out duration-300 hover:transform hover:scale-105'
							>
								Comienza ahora mismo{' '}
								{
									<svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
										<path d='M16.175 11L10.575 5.4L12 4L20 12L12 20L10.575 18.6L16.175 13L4 13L4 11L16.175 11Z' fill='white' />
									</svg>
								}
							</Link>
						</div>
					</div>
				</div>

				<img className='absolute top-0 right-0 z-0 opacity-80 scale-50 hidden md:hidden lg:block' src={IMAGES.decorative.linePurple} alt='line' />
				<img className='absolute top-100 left-0 z-0 opacity-80 scale-50 hidden md:hidden lg:block' src={IMAGES.decorative.lineOrange} alt='line' />
			</div>

			{/* Section Conoce nuestros paquetes */}
			<div className='flex flex-col gap-10 items-center text-center py-26 px-[10%]'>
				<h2 className='text-5xl font-light text-[#333333] max-w-[620px] leading-[120%] mb-10'>
					Conoce nuestros <span className='bg-gradient-to-br from-[#F56F10] to-[#FA9D5A] bg-clip-text text-transparent font-bold'>paquetes y sus beneficios </span>
				</h2>
				<div className='flex flex-col lg:flex-row gap-10 w-full items-center justify-center'>
					<FreePaymentPlan />
					<PremiumPaymentPlan />
				</div>
				<p className='text-xl font-regular text-[#666666] '>¿Necesitas más información? Nuestro equipo está listo para ayudarte.</p>
				<a
					href='#'
					className='w-auto flex gap-2.5 items-center justify-center border-1 border-[#E4E4E7] text-[#333333] font-regular text-lg px-4 p-4 hover:bg-[#F5F5F5] transition-all ease-in-out duration-300'
				>
					Hablar con un experto
				</a>
			</div>

			{/* Section 6 */}
			<div className='flex flex-col gap-26 items-center justify-center mb-30'>
				<div className='w-full flex flex-col lg:flex-row gap-12 justify-center items-center'>
					<div className='inline-flex flex-col min-w-[300px] h-full items-center text-center gap-6 p-8 relative bg-white max-w-[440px] shadow-[0px_20px_25px_-5px_rgba(55,0,103,0.1),_0px_10px_10px_rgba(55,0,103,0.04)] rounded-[10px]'>
						<svg className='relative' width='60' height='39' viewBox='0 0 60 39' fill='none' xmlns='http://www.w3.org/2000/svg'>
							<path
								d='M52.6472 14.6612C54.8686 15.4017 56.6457 16.7345 57.9785 18.6598C59.3114 20.4369 59.9778 22.4361 59.9778 24.6575C60.1259 26.8789 59.5335 29.1003 58.2007 31.3217C57.0159 33.395 55.0907 35.1722 52.425 36.6531C48.1303 38.8745 44.3539 39.4669 41.0959 38.4302C37.8378 37.2455 35.5424 35.4683 34.2095 33.0989C33.4691 31.9141 32.8767 30.2851 32.4324 28.2118C32.1362 26.1385 31.9882 23.9911 31.9882 21.7697C32.1362 19.4002 32.4324 17.1048 32.8767 14.8834C33.321 12.662 33.9874 10.8108 34.876 9.32988C35.6164 8.29323 36.505 7.18253 37.5416 5.99778C38.4302 4.96113 39.4669 3.92447 40.6516 2.88782C41.9845 1.85117 43.4654 0.88856 45.0944 0L52.8693 0.44428C51.8327 1.62903 50.87 2.73973 49.9815 3.77638C49.241 4.66494 48.5746 5.47945 47.9822 6.21992C47.3899 6.96039 46.7975 7.62681 46.2051 8.21918C45.1685 9.25583 44.3539 10.2925 43.7616 11.3291C43.1692 12.2177 42.6509 13.1803 42.2066 14.217C41.9104 15.2536 41.9104 16.2903 42.2066 17.3269C44.1318 15.2536 46.3532 14.217 48.8708 14.217C50.0555 14.217 51.3143 14.3651 52.6472 14.6612ZM21.9919 15.7719C24.0652 16.9567 25.5461 18.5857 26.4347 20.659C27.4713 22.5842 27.8415 24.6575 27.5454 26.8789C27.2492 29.1003 26.2866 31.1736 24.6575 33.0989C23.1766 35.0241 20.9552 36.505 17.9933 37.5417C13.4024 39.0226 9.62606 38.9485 6.6642 37.3195C3.70233 35.5424 1.70307 33.395 0.66642 30.8775C0.22214 29.5446 0 27.8415 0 25.7682C0 23.6949 0.22214 21.5476 0.66642 19.3262C1.1107 17.1048 1.70307 14.9574 2.44354 12.8841C3.18401 10.8108 4.14661 9.10774 5.33136 7.7749C6.21992 6.73825 7.25657 5.77564 8.44132 4.88708C9.47797 4.14661 10.6627 3.3321 11.9956 2.44354C13.4765 1.55498 15.1055 0.740467 16.8826 0L24.6575 1.99926C23.4728 3.03591 22.3621 3.92447 21.3254 4.66494C20.4369 5.40541 19.6224 6.07183 18.8819 6.6642C18.1414 7.25657 17.401 7.84895 16.6605 8.44132C15.6238 9.32988 14.7353 10.2184 13.9948 11.107C13.2544 11.8475 12.5879 12.736 11.9956 13.7727C11.4032 14.6612 11.181 15.6238 11.3291 16.6605C12.5139 15.7719 13.6986 15.2536 14.8834 15.1055C16.2162 14.8093 17.401 14.7353 18.4376 14.8834C19.6224 15.0315 20.8071 15.3277 21.9919 15.7719Z'
								fill='#F2F4F7'
							/>
						</svg>

						<p className='text-[#333333] text-2xlg text-center font-regular leading-[120%]'>
							El iNNLab Inndex nos permitió obtener una radiografía precisa de nuestra cultura de innovación y tomar decisiones basadas en datos para acelerar la innovacion y la
							transformación digital en Gases de Occidente.
						</p>

						<footer className='flex flex-col items-center justify-center gap-4 relative self-stretch w-full flex-[0_0_auto]'>
							<div className='flex flex-col items-center justify-center gap-1 relative self-stretch w-full flex-[0_0_auto]'>
								<h4 className='text-3xl text-[#2C2C2C] font-semibold leading-[120%] text-center'>Andrés Felipe Correa Zuñiga</h4>
							</div>
						</footer>
					</div>
					<div className='inline-flex flex-col min-w-[300px] h-full items-center text-center gap-6 p-8 relative bg-white  max-w-[440px] shadow-[0px_20px_25px_-5px_rgba(55,0,103,0.1),_0px_10px_10px_rgba(55,0,103,0.04)] rounded-[10px]'>
						<svg className='relative' width='60' height='39' viewBox='0 0 60 39' fill='none' xmlns='http://www.w3.org/2000/svg'>
							<path
								d='M52.6472 14.6612C54.8686 15.4017 56.6457 16.7345 57.9785 18.6598C59.3114 20.4369 59.9778 22.4361 59.9778 24.6575C60.1259 26.8789 59.5335 29.1003 58.2007 31.3217C57.0159 33.395 55.0907 35.1722 52.425 36.6531C48.1303 38.8745 44.3539 39.4669 41.0959 38.4302C37.8378 37.2455 35.5424 35.4683 34.2095 33.0989C33.4691 31.9141 32.8767 30.2851 32.4324 28.2118C32.1362 26.1385 31.9882 23.9911 31.9882 21.7697C32.1362 19.4002 32.4324 17.1048 32.8767 14.8834C33.321 12.662 33.9874 10.8108 34.876 9.32988C35.6164 8.29323 36.505 7.18253 37.5416 5.99778C38.4302 4.96113 39.4669 3.92447 40.6516 2.88782C41.9845 1.85117 43.4654 0.88856 45.0944 0L52.8693 0.44428C51.8327 1.62903 50.87 2.73973 49.9815 3.77638C49.241 4.66494 48.5746 5.47945 47.9822 6.21992C47.3899 6.96039 46.7975 7.62681 46.2051 8.21918C45.1685 9.25583 44.3539 10.2925 43.7616 11.3291C43.1692 12.2177 42.6509 13.1803 42.2066 14.217C41.9104 15.2536 41.9104 16.2903 42.2066 17.3269C44.1318 15.2536 46.3532 14.217 48.8708 14.217C50.0555 14.217 51.3143 14.3651 52.6472 14.6612ZM21.9919 15.7719C24.0652 16.9567 25.5461 18.5857 26.4347 20.659C27.4713 22.5842 27.8415 24.6575 27.5454 26.8789C27.2492 29.1003 26.2866 31.1736 24.6575 33.0989C23.1766 35.0241 20.9552 36.505 17.9933 37.5417C13.4024 39.0226 9.62606 38.9485 6.6642 37.3195C3.70233 35.5424 1.70307 33.395 0.66642 30.8775C0.22214 29.5446 0 27.8415 0 25.7682C0 23.6949 0.22214 21.5476 0.66642 19.3262C1.1107 17.1048 1.70307 14.9574 2.44354 12.8841C3.18401 10.8108 4.14661 9.10774 5.33136 7.7749C6.21992 6.73825 7.25657 5.77564 8.44132 4.88708C9.47797 4.14661 10.6627 3.3321 11.9956 2.44354C13.4765 1.55498 15.1055 0.740467 16.8826 0L24.6575 1.99926C23.4728 3.03591 22.3621 3.92447 21.3254 4.66494C20.4369 5.40541 19.6224 6.07183 18.8819 6.6642C18.1414 7.25657 17.401 7.84895 16.6605 8.44132C15.6238 9.32988 14.7353 10.2184 13.9948 11.107C13.2544 11.8475 12.5879 12.736 11.9956 13.7727C11.4032 14.6612 11.181 15.6238 11.3291 16.6605C12.5139 15.7719 13.6986 15.2536 14.8834 15.1055C16.2162 14.8093 17.401 14.7353 18.4376 14.8834C19.6224 15.0315 20.8071 15.3277 21.9919 15.7719Z'
								fill='#F2F4F7'
							/>
						</svg>

						<p className='text-[#333333] text-2xlg text-center font-regular leading-[120%]'>
							El Innlab Inndex nos dio una radiografía muy clara de cómo estamos innovando en FVL. Pasamos de percepciones sueltas a contar con datos que muestran nuestras fortalezas,
							brechas y oportunidades. Gracias a ese diagnóstico hoy podemos priorizar iniciativas.
						</p>

						<footer className='flex flex-col items-center justify-center gap-4 relative self-stretch w-full flex-[0_0_auto]'>
							<div className='flex flex-col items-center justify-center gap-1 relative self-stretch w-full flex-[0_0_auto]'>
								<h4 className='text-3xl text-[#2C2C2C] font-semibold leading-[120%] text-center'>David Lemus</h4>
							</div>
						</footer>
					</div>
				</div>
				<img src={IMAGES.brands.affiliateBrands} alt='Affiliate Brands' className='' />
			</div>
			<Footer />
		</main>
	)
}

export default LandingPage
