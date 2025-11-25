import { Survey, TitleSection } from '../../components/index'
import { SurveyTest } from '../../components/Survey/SurveyTest'
import './SurveyScreen.css'

export default function SurveyScreen() {
	return (
		<section className='survey-screen-container'>
			<TitleSection title='Encuesta de Innovación' />
			<SurveyTest />
			<img className='line-bckg-img' src='/images/decorative/BgLine-decoration.png' alt='' />
			<img className='dots-bckg-img' src='/images/decorative/BgPoints-decoration.png' alt='' />
		</section>
	)
}
