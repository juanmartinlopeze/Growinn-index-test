import { useState, useEffect } from 'react';
import questions from '../../data/question.json';

export function Survey() {
  const [token, setToken] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});


  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('token');
    if (t) setToken(t);
  }, []);

  // 1️⃣ Asegurarnos de que questions sea un array con elementos
  if (!Array.isArray(questions) || questions.length === 0) {
    return <p>Cargando preguntas…</p>;
  }

  // 2️⃣ Si no tenemos token, esperamos
  if (!token) return <p>Cargando encuesta…</p>;

  // 3️⃣ Si ya llegamos al final, mostramos agradecimiento
  if (currentIndex === questions.length) {
    return (
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <h2>¡Gracias por completar la encuesta!</h2>
        <p>Tus respuestas han sido registradas exitosamente.</p>
      </div>
    );
  }

  // 4️⃣ Obtenemos la pregunta actual y guardamos otro guard
  const question = questions[currentIndex];
  if (!question || !Array.isArray(question.options)) {
    return <p>Cargando pregunta…</p>;
  }

  // … el resto de tu componente sin cambios…
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnswers(prev => ({ ...prev, [name]: value }));
  };
  const goNext = () => setCurrentIndex(i => Math.min(i + 1, questions.length));
  const goBack = () => setCurrentIndex(i => Math.max(i - 1, 0));
  const handleSubmit = async () => {
    const payload = { token, ...answers };
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/encuesta`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Error en el envío');
      setCurrentIndex(questions.length);
    } catch {
      alert('Error al enviar la encuesta.');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h3>Pregunta {currentIndex + 1} de {questions.length}</h3>
      <p>{question.text}</p>

      {question.options.map(opt => (
        <label key={opt} style={{ display: 'block', margin: '0.5rem 0' }}>
          <input
            type="radio"
            name={question.id}
            value={opt}
            checked={answers[question.id] === opt}
            onChange={handleChange}
          />{' '}{opt}
        </label>
      ))}

      <div style={{ marginTop: '1.5rem' }}>
        <button onClick={goBack} disabled={currentIndex === 0}>Anterior</button>
        {currentIndex < questions.length - 1 ? (
          <button onClick={goNext} disabled={!answers[question.id]} style={{ marginLeft: '1rem' }}>Siguiente</button>
        ) : (
          <button onClick={handleSubmit} disabled={!answers[question.id]} style={{ marginLeft: '1rem' }}>Enviar encuesta</button>
        )}
      </div>
    </div>
  );
}
