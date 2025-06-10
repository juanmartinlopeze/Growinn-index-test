import { useState, useEffect } from 'react';
import { Button } from '../../components/index';
import { ExplanationScreen } from './ExplanationScreen';
import questions from '../../data/question.json';
import './Survey.css';

export function Survey() {
  const [token, setToken] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState(true);

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('token');
    if (t) setToken(t);
  }, []);

  // Verifica que las preguntas están disponibles
  if (!Array.isArray(questions) || questions.length === 0) {
    return <p>Cargando preguntas…</p>;
  }

  // Verifica si se ha completado la encuesta
  if (currentIndex >= questions.length) {
    return (
      <div className="survey-container">
        <h2 className="survey-header">¡Gracias por completar la encuesta!</h2>
      </div>
    );
  }

  // Obtener las preguntas a mostrar
  const currentQuestions = questions.slice(currentIndex, currentIndex + 2);

  // Manejo de respuestas
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnswers((prev) => ({ ...prev, [name]: value }));
  };

  // Navegar entre preguntas
  const goNext = () => setCurrentIndex((i) => Math.min(i + 2, questions.length));
  const goBack = () => setCurrentIndex((i) => Math.max(i - 2, 0));

  // Enviar encuesta
  const handleSubmit = async () => {
    const payload = { token, ...answers };
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/encuesta`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Error en el envío');
      setCurrentIndex(questions.length);
    } catch {
      alert('Error al enviar la encuesta.');
    }
  };

  // Verificar si todas las preguntas están respondidas
  const allAnswered = currentQuestions.every((q) => answers[q.id]);

  // Función para manejar el inicio de la encuesta
  const handleStartSurvey = () => {
    setShowExplanation(false);
  };

  // Mostrar la pantalla de explicación antes de la encuesta
  if (showExplanation) {
    return <ExplanationScreen onStart={handleStartSurvey} />;
  }

  return (
    <div className="survey-container">
      {currentQuestions.map((question, index) => (
        <div key={question.id} className="question-block">
          <div className="question-header">
            <h3>
              Pregunta <span className="question-bold">{currentIndex + index + 1}</span> de <span className="question-bold">{questions.length}</span>
            </h3>
          </div>
          <p className="question-text">{question.text}</p>
          <p className="question-instruction">Por favor, seleccione una de las siguientes opciones:</p>
          <div className="options-stroke">
            <div className="options-container">
              {question.options.map((opt) => (
                <label key={opt} className={`option ${answers[question.id] === opt ? 'selected' : ''}`}>
                  <input type="radio" name={question.id} value={opt} checked={answers[question.id] === opt} onChange={handleChange} />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        </div>
      ))}

      <div className="navigation-buttons">
        <Button variant="back" onClick={goBack} disabled={currentIndex === 0} />
        {currentIndex + 2 < questions.length ? (
          <Button variant="next" text="Siguiente" onClick={goNext} disabled={!allAnswered} />
        ) : (
          <button className="nav-button submit" onClick={handleSubmit} disabled={!allAnswered}>
            Enviar encuesta
          </button>
        )}
      </div>
    </div>
  );
}
