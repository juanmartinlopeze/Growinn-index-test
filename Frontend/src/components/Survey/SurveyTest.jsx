import { useState } from 'react'
import { Button } from '../../components/index'
import questions from '../../data/question.json'
import './Survey.css'

export function SurveyTest() {
	const [currentIndex, setCurrentIndex] = useState(0)
	const [answers, setAnswers] = useState({})

	if (!Array.isArray(questions) || questions.length === 0) {
		return <p>Cargando preguntas…</p>
	}

	if (currentIndex >= questions.length) {
		return (
			<div className='survey-container'>
				<h2 className='survey-header'>¡Gracias por completar la encuesta!</h2>
				<p>(Esto es un entorno de prueba, tus respuestas no serán enviadas.)</p>
			</div>
		)
	}

	const currentQuestions = questions.slice(currentIndex, currentIndex + 2)

	const handleChange = (e) => {
		const { name, value } = e.target
		setAnswers((prev) => ({ ...prev, [name]: value }))
	}

	const goNext = () => setCurrentIndex((i) => Math.min(i + 2, questions.length))
	const goBack = () => setCurrentIndex((i) => Math.max(i - 2, 0))

	const handleSubmit = () => {
		console.log('Respuestas (prueba):', answers)
		setCurrentIndex(questions.length)
	}

	const allAnswered = currentQuestions.every((q) => answers[q.id])

	return (
		<div className='survey-container'>
			{currentQuestions.map((question, index) => (
				<div key={question.id} className='question-block'>
					<div className='question-header'>
						<h3>
							Pregunta <span className='question-bold'>{currentIndex + index + 1}</span> de <span className='question-bold'>{questions.length}</span>
						</h3>
					</div>
					<p className='question-text'>{question.text}</p>
					<p className='question-instruction'>Por favor, seleccione una de las siguientes opciones:</p>
					<div className='options-stroke'>
						<div className='options-container'>
							{question.options.map((opt) => (
								<label key={opt} className={`option ${answers[question.id] === opt ? 'selected' : ''}`}>
									<input type='radio' name={question.id} value={opt} checked={answers[question.id] === opt} onChange={handleChange} />
									{opt}
								</label>
							))}
						</div>
					</div>
				</div>
			))}

			<div className='navigation-buttons'>
				<Button variant='back' onClick={goBack} disabled={currentIndex === 0} />
				{currentIndex + 2 < questions.length ? (
					<Button variant='next' text='Siguiente' onClick={goNext} disabled={!allAnswered} />
				) : (
					<button className='nav-button submit' onClick={handleSubmit} disabled={!allAnswered}>
						Enviar encuesta
					</button>
				)}
			</div>
		</div>
	)
}
