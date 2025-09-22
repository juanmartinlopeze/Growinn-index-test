import { InputBox } from '../Inputs/Input-box'
import './Form.css'
export function Form({ questions, onInputChange, formData }) {
	return (
		<div className='hierachy-form'>
			{questions.map((question) => (
				<div key={question.id} className='form-group'>
					<div className='form-header'>
						<h2>{question.title}</h2>
						{question.icon && <span className='form-icon'>{question.icon}</span>}
					</div>
					<div>
						<InputBox placeholder={question.placeholder} type='number' value={formData[question.field] || ''} onChange={(e) => onInputChange(question.field, e.target.value)} required />
					</div>
				</div>
			))}
		</div>
	)
}
