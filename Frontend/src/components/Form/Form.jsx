import "./Form.css";
export function Form({ questions }) {
  return (
    <div className="hierachy-form">
      {questions.map((question) => (
        <div key={question.id} className="form-group">
          <div className="form-header">
            <h2>{question.title}</h2>
            {question.icon && <span className="form-icon">{question.icon}</span>}
          </div>
          <input
            className="questionnaire-forms"
            type="text"
            placeholder={question.placeholder}
          />
        </div>
      ))}
    </div>
  );
}