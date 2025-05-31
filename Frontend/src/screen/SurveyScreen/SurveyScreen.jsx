
import { Survey } from "../../components/index";

export default function SurveyScreen() {
  return (
    <div className="encuesta-screen" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      {/* Puedes agregar aquí un título o instrucciones previas */}
      <h1 style={{ textAlign: 'center', color: '#5646F0' }}>Encuesta de Innovación</h1>
      <Survey/>
    </div>
  );
}
