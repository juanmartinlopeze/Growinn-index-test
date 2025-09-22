import { InputBox } from '../Inputs/Input-box'
import './form_areas.css'

export function FormAreas({ questions, onInputChange, formData }) {
	return (
		<div className='form-areas'>
			{questions.map((question) => (
				<div key={question.id} className='form-group'>
					<h2>{question.title}</h2>
					<div>
						<InputBox placeholder={question.placeholder} type='text' value={formData[question.field] || ''} onChange={(e) => onInputChange(question.field, e.target.value)} required />
					</div>
				</div>
			))}
		</div>
	)
}
