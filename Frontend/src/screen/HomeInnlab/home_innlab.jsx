import { Button, Description, HomeTitle, List, Subtitle, TitleJerarquias } from '../../components/index'
import './home_innlab.css'

const jerarquiasIntro = 'En la mayoría de las organizaciones, existen cuatro niveles jerárquicos:'
const jerarquiasItems = [
	'El Nivel 1 (Ejecución) realiza tareas operativas esenciales.',
	'El Nivel 2 (Supervisión) garantiza su cumplimiento.',
	'El Nivel 3 (Gerencial) implementa estrategias y toma decisiones a mediano plazo.',
	'El Nivel 4 (Directivo) define la estrategia general, establece objetivos y asigna recursos.',
]

export function HomeInnlab() {
	return (
		<>
			<section className='home-container'>
				<div className='home-head'>
					<HomeTitle title='Información previa...' />
					<TitleJerarquias title='Jerarquías y áreas' />
				</div>

				<div className='info-container'>
					<div className='info'>
						<Subtitle text='Jerarquías' />
						<Description text={jerarquiasIntro} />
						<List items={jerarquiasItems} />
					</div>
					<div className='info'>
						<Subtitle text='Áreas' />
						<Description text='Las áreas de las empresas son los departamentos o funciones específicas, como Recursos Humanos o Finanzas. Evaluar la innovación en cada área permite identificar el alineamiento y los desafíos dentro de la cultura de innovación.' />
					</div>
				</div>

				<div className='img-link'>
					<img src='/table-preview.jpg' alt='Matriz de asignación de cargos por área y jornada laboral, con algunos roles asignados y otros disponibles.' />
					<a href='#'>Video tutorial →</a>
				</div>

				<section className='navigation-buttons'>
					<Button variant='back' to='/' />
					<Button variant='next' text='Siguiente' to='/innlab_form' />
				</section>
			</section>
			<img className='line-bckg-img' src='/BgLine-decoration.png' alt='' />
			<img className='dots-bckg-img' src='/BgPoints-decoration.png' alt='' />
		</>
	)
}
